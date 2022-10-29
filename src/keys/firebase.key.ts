import {BindingKey} from '@loopback/context';
import {FirebaseApp} from '../types';

export namespace FirebaseBindings {
  export const FirebaseProvider = BindingKey.create<FirebaseApp>('firebase');

  export const Config = BindingKey.create<any | null>('firebase.config');
}
