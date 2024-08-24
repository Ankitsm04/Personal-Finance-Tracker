import { configureStore } from '@reduxjs/toolkit';
import { api } from './slices/currencyApiSlice';
import transactionsReducer from './slices/transactionsSlice';
import budgetReducer from './slices/budgetSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    budget: budgetReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
