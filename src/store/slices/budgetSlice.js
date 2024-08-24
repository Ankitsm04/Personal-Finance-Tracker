// src/store/slices/budgetSlice.js

import { createSlice } from '@reduxjs/toolkit';

const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    budget: 0,          // Define your initial budget
    totalExpenses: 0,   // Define your initial total expenses
    // Add other states if needed
  },
  reducers: {
    setBudget: (state, action) => {
      state.budget = action.payload;
    },
    updateTotalExpenses: (state, action) => {
      state.totalExpenses = action.payload;
    },
    // Add more reducers if needed
  },
});

export const { setBudget, updateTotalExpenses } = budgetSlice.actions;

// Selectors
export const selectBudget = (state) => state.budget.budget;
export const selectTotalExpenses = (state) => state.budget.totalExpenses;

export default budgetSlice.reducer;
