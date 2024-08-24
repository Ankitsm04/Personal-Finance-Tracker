'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, updateTransaction } from '../store/slices/transactionsSlice';
import { selectTotalExpenses, selectBudget, setSavings } from '../store/slices/budgetSlice';
import { useGetExchangeRatesQuery } from '../store/slices/currencyApiSlice';

export default function TransactionForm({ transaction, onClose }) {
  const dispatch = useDispatch();
  const totalExpenses = useSelector(selectTotalExpenses);
  const budget = useSelector(selectBudget);
  const [description, setDescription] = useState('Details not updated yet');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('Details not updated yet');
  const [currency, setCurrency] = useState('INR'); // Default currency
  const [category, setCategory] = useState(''); // New state for category
  const [exceedsBudget, setExceedsBudget] = useState(false);
  const [budgetExceededBy, setBudgetExceededBy] = useState(0);

  const { data: ratesData, isLoading, isError } = useGetExchangeRatesQuery('INR');

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description || 'Details not updated yet');
      setAmount(transaction.amount);
      setDate(transaction.date || 'Details not updated yet');
      setCurrency(transaction.currency || 'INR'); // Set the currency if editing
      setCategory(transaction.category || ''); // Set the category if editing
    }
  }, [transaction]);

  const convertToINR = (amount, baseCurrency) => {
    if (baseCurrency === 'INR') return amount;
    const rate = ratesData?.conversion_rates[baseCurrency];
    return rate ? (amount / rate).toFixed(2) : amount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const amountInINR = parseFloat(convertToINR(Number(amount), currency));

    const newTransaction = { 
      id: transaction?.id || Date.now(), 
      description, 
      amount: Number(amount), // Store amount in original currency
      amountInINR, // Store amount in INR for internal calculations
      date, 
      currency,
      category // Include category in the transaction
    };

    let newTotalExpenses = totalExpenses;
    let newSavings = budget - totalExpenses; // Calculate initial savings

    if (amount < 0) {
      // Handle expense
      const expenseAmount = Math.abs(amountInINR); // Convert to positive for budget comparison
      newTotalExpenses = transaction
        ? totalExpenses - Math.abs(transaction.amountInINR) + expenseAmount
        : totalExpenses + expenseAmount;

      const difference = newTotalExpenses - budget;

      if (difference > 0) {
        setExceedsBudget(true);
        setBudgetExceededBy(difference);
        return; // Prevent submission if budget is exceeded
      }
    } else {
      // Handle income
      newTotalExpenses = transaction
        ? totalExpenses - Math.abs(transaction.amountInINR) + amountInINR
        : totalExpenses + amountInINR;
    }

    newSavings = budget - newTotalExpenses;    

    if (transaction) {
      dispatch(updateTransaction({ id: transaction.id, updatedTransaction: newTransaction }));
    } else {
      dispatch(addTransaction(newTransaction));
    }

    if (onClose) onClose(); // Ensure onClose is defined before calling
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading exchange rates.</div>;

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>

        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <input
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transportation">Transportation</option>
            <option value="Utilities">Utilities</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        {exceedsBudget && (
          <div className="mb-4 text-red-600">
            Warning: This expense exceeds your budget by ₹{budgetExceededBy}!
          </div>
        )}

        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded"
        >
          {transaction ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </form>
    </>
  );
}
