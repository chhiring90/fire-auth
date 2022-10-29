import {BindingScope, inject, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import {FirebaseBindings} from '../keys';
import {Credentials, FirebaseApp} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class FirebaseService {
  constructor(
    @inject(FirebaseBindings.FirebaseProvider)
    private firebaseProvider: FirebaseApp,
  ) {
    this.authFirebase = getAuth(this.firebaseProvider);
  }

  private authFirebase: Auth;

  async signup(creds: Credentials): Promise<UserCredential> {
    try {
      return await createUserWithEmailAndPassword(
        this.authFirebase,
        creds.email,
        creds.password,
      );
    } catch (err) {
      throw new HttpErrors.Forbidden(err.message);
    }
  }

  async login(creds: Credentials): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(
        this.authFirebase,
        creds.email,
        creds.password,
      );
    } catch (err) {
      throw new HttpErrors.Unauthorized(err.message);
    }
  }

  async signout(): Promise<void> {
    try {
      return await signOut(this.authFirebase);
    } catch (err) {
      throw new HttpErrors.Forbidden(err.message);
    }
  }
}
