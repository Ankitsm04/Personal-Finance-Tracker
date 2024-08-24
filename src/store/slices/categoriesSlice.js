import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: ['Food', 'Rent', 'Entertainment', 'Utilities', 'Transportation', 'Miscellaneous'],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
});

export default categoriesSlice.reducer;
