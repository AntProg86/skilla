import { createSlice } from '@reduxjs/toolkit';

const errorAbsoluteSlice = createSlice({
  name: 'application-errors',
  initialState: {
    errorMessage: '',
  },
  reducers: {
    ActionSetErrorMessageAbsolute(state, action) {
      // Записываем значение языка в localStorage а затем и в state             
      state.errorMessage = action.payload;
    },
  },
});

export const {
  ActionSetErrorMessageAbsolute,
} = errorAbsoluteSlice.actions;

export default errorAbsoluteSlice;