import {FirebaseApp as App} from 'firebase/app';
export const enum FirebaseError {
  ProviderNotFound = 'FirebaseProviderNotFound',
}

export type FirebaseApp = App;
