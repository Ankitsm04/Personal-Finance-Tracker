'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTransaction } from '../store/slices/transactionsSlice';
import TransactionForm from './TransactionForm';
import { useGetExchangeRatesQuery } from '../store/slices/currencyApiSlice';

export default function TransactionTable() {
  const transactions = useSelector((state) => state.transactions.items);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); // Default currency
  const dispatch = useDispatch();
  const { data: ratesData, isLoading, isError } = useGetExchangeRatesQuery('INR');

  useEffect(() => {
    // Optionally handle currency change effect if needed
  }, [selectedCurrency]);

  const convertToCurrency = (amountInINR, targetCurrency) => {
    if (targetCurrency === 'INR') return amountInINR;
    const rate = ratesData?.conversion_rates[targetCurrency];
    return rate ? (amountInINR * rate).toFixed(2) : amountInINR;
  };

  const handleDelete = (id) => {
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading exchange rates.</div>;

  return (
    <div className="p-4 bg-gray-100 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      {editingTransaction && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
      <div className="mb-4">
        <label className="block mb-1">Select Currency</label>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="p-2 border-b">Description</th>
              <th className="p-2 border-b">Category</th>
              <th className="p-2 border-b">Amount (Original Currency)</th>
              <th className="p-2 border-b">Amount (INR)</th>
              <th className="p-2 border-b">Amount ({selectedCurrency})</th>
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="p-2 border-b">{transaction.description}</td>
                <td className="p-2 border-b">{transaction.category || 'Uncategorized'}</td>
                <td className="p-2 border-b">{transaction.amount} {transaction.currency}</td>
                <td className="p-2 border-b">{transaction.amountInINR} INR</td>
                <td className="p-2 border-b">
                  {convertToCurrency(transaction.amountInINR, selectedCurrency)} {selectedCurrency}
                </td>
                <td className="p-2 border-b">{transaction.date}</td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => setEditingTransaction(transaction)}
                    className="mr-2 p-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
