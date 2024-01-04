import { configureStore } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { Action, ApplicationState } from './types';

// import languageSlice from '../shared/language/reducer';
import errorAbsoluteSlice from '#src/components/errorAbsolute/reducer';

export const rootReducer = configureStore<ApplicationState, Action, Middleware[]>({
  reducer: {
    // language: languageSlice.reducer,
    errorAbsolute: errorAbsoluteSlice.reducer,
  },
});
