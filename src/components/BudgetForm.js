'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBudget, selectBudget } from '../store/slices/budgetSlice';
import { useGetExchangeRatesQuery } from '../store/slices/currencyApiSlice';

export default function BudgetForm() {
  const dispatch = useDispatch();
  const currentBudget = useSelector(selectBudget);
  const [budget, setBudgetInput] = useState(currentBudget || 0);
  const [currency, setCurrency] = useState('INR'); // Default currency
  const [submitted, setSubmitted] = useState(false); // New state to track form submission
  const { data: ratesData, isLoading, isError } = useGetExchangeRatesQuery('INR');

  useEffect(() => {
    if (currentBudget && currency !== 'INR') {
      const convertedBudget = convertToINR(currentBudget, currency);
      setBudgetInput(convertedBudget);
    }
  }, [currency, currentBudget]);

  const convertToINR = (amount, baseCurrency) => {
    if (baseCurrency === 'INR') return amount;
    const rate = ratesData?.conversion_rates[baseCurrency];
    return rate ? (amount / rate).toFixed(2) : amount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const budgetInINR = convertToINR(Number(budget), currency);
    dispatch(setBudget(Number(budgetInINR)));
    setSubmitted(true); // Set submitted state to true after submission
    alert('Budget updated successfully');
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading exchange rates.</div>;

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 shadow-md rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Set Budget</h2>
      
      <div className="mb-4">
        <label className="block mb-1">Budget Amount</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => !submitted && setBudgetInput(e.target.value)} // Allow changes only if not submitted
          className="p-2 border rounded w-full"
          readOnly={submitted} // Make input read-only if submitted
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Currency</label>
        <select
          value={currency}
          onChange={(e) => !submitted && setCurrency(e.target.value)} // Allow changes only if not submitted
          className="p-2 border rounded w-full"
          disabled={submitted} // Disable select if submitted
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>
      </div>

      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded"
        disabled={submitted} // Disable button if already submitted
      >
        Update Budget
      </button>
    </form>
  );
}
