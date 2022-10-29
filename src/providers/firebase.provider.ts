import {inject, Provider, ValueOrPromise} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {FirebaseOptions, initializeApp} from 'firebase/app';
import {FirebaseBindings} from '../keys';
import {FirebaseApp, FirebaseError} from '../types';

export class FirebaseProvider implements Provider<FirebaseApp> {
  constructor(
    @inject(FirebaseBindings.Config, {optional: true})
    private readonly firebaseConfig: FirebaseOptions,
  ) {
    if (!this.firebaseConfig)
      throw new HttpErrors.PreconditionFailed('Firebase Config Missing!');

    this.firebaseApp = initializeApp(this.firebaseConfig);
  }

  public firebaseApp: FirebaseApp;

  value(): ValueOrPromise<FirebaseApp> {
    if (!this.firebaseApp) {
      throw new HttpErrors.UnprocessableEntity(FirebaseError.ProviderNotFound);
    }
    return this.firebaseApp;
  }
}
