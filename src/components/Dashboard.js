'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetExchangeRatesQuery } from '../store/slices/currencyApiSlice';
import TransactionTable from './TransactionTable';
import ChartComponent from './Chart';

export default function Dashboard() {
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const { data: ratesData, isLoading, isError, refetch } = useGetExchangeRatesQuery('INR'); 

  useEffect(() => {
    refetch();
  }, [refetch]);

  const transactions = useSelector((state) => state.transactions.items);
  const totalIncome = useSelector((state) => state.transactions.totalIncome);
  const totalExpenses = useSelector((state) => state.transactions.totalExpenses);
  const monthlyBudget = useSelector((state) => state.budget.budget);

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
    refetch(); 
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading exchange rates.</div>;

  const convertCurrency = (amount, baseCurrency) => {
    if (baseCurrency === 'INR') return amount;
    const rate = ratesData?.conversion_rates[baseCurrency];
    return rate ? (amount * rate).toFixed(2) : amount;
  };

  const totalIncomeInSelectedCurrency = convertCurrency(totalIncome, selectedCurrency);
  const totalExpensesInSelectedCurrency = Math.abs(convertCurrency(totalExpenses, selectedCurrency));
  const monthlyBudgetInSelectedCurrency = convertCurrency(monthlyBudget, selectedCurrency);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      
      <div className="mb-4">
        <label className="block mb-1">Select Currency</label>
        <select
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          className="p-2 border rounded"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>
      </div>

      <div className="mb-4">
        <h3>Total Income: {totalIncomeInSelectedCurrency} {selectedCurrency}</h3>
        <h3>Total Expenses: {totalExpensesInSelectedCurrency} {selectedCurrency}</h3>
        <h3>Savings: {(totalIncome + totalExpenses).toFixed(2)} {selectedCurrency}</h3>
        <h3>Monthly Budget: {monthlyBudgetInSelectedCurrency} {selectedCurrency}</h3>
      </div>
      <ChartComponent />
    </div>
  );
}
