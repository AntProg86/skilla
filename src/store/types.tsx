import { AnyAction } from 'redux';
// import { LanguageState } from '../shared/language/types';
import { ErrorAbsoluteState } from '#src/components/errorAbsolute/types';

export type Action = AnyAction;

export type ApplicationState = {
  // language: LanguageState;
  errorAbsolute: ErrorAbsoluteState;
};
