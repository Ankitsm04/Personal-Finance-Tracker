// src/store/slices/transactionsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    totalIncome: 0,
    totalExpenses: 0,
  },
  reducers: {
    addTransaction: (state, action) => {
      const { amountInINR } = action.payload;
      state.items.push(action.payload);
      if (amountInINR > 0) {
        state.totalIncome += parseFloat(amountInINR); // Ensure numeric addition
      } else {
        state.totalExpenses += parseFloat(amountInINR); // Ensure numeric addition
      }
    },
    updateTransaction: (state, action) => {
      const { id, updatedTransaction } = action.payload;
      const index = state.items.findIndex((t) => t.id === id);
      if (index !== -1) {
        const oldTransaction = state.items[index];
        const oldAmountInINR = parseFloat(oldTransaction.amountInINR);
        const newAmountInINR = parseFloat(updatedTransaction.amountInINR);
        state.items[index] = updatedTransaction;
        state.totalIncome -= oldAmountInINR > 0 ? oldAmountInINR : 0;
        state.totalExpenses -= oldAmountInINR < 0 ? oldAmountInINR : 0;
        state.totalIncome += newAmountInINR > 0 ? newAmountInINR : 0;
        state.totalExpenses -= newAmountInINR < 0 ? newAmountInINR : 0;
      }
    },
    deleteTransaction: (state, action) => {
      const id = action.payload;
      const index = state.items.findIndex((t) => t.id === id);
      if (index !== -1) {
        const amountInINR = parseFloat(state.items[index].amountInINR);
        state.items.splice(index, 1);
        if (amountInINR > 0) {
          state.totalIncome -= amountInINR;
        } else {
          state.totalExpenses -= amountInINR;
        }
      }
    },
  },
});

export const { addTransaction, updateTransaction, deleteTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
