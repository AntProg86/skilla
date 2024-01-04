import { createSlice, PayloadAction  } from '@reduxjs/toolkit';

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    //Ошибка пойманная try catch
    errorMessage: '',
  },
  reducers: {
    setErrorMessage(state, action: PayloadAction<any>) {
      // Показать/скрыть индикацию загрузки
      state.errorMessage = action.payload;
    },
  },
});

export const {
  setErrorMessage
} = applicationSlice.actions;

export default applicationSlice;
