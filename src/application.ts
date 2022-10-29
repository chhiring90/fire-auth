import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import * as firebaseAdmin from 'firebase-admin';
import path from 'path';
import {FirebaseComponent} from './components';
import {FirebaseBindings} from './keys';
import {FirebaseProvider} from './providers';
import {MySequence} from './sequence';
import {FirebaseTokenService} from './services';

export {ApplicationConfig};

export class FireAuthApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    super(options);

    //firebaseAdmin
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);

    this.component(FirebaseComponent);

    this.bind(FirebaseBindings.Config).to({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MESUREMENT_ID,
    });

    this.bind(FirebaseBindings.FirebaseProvider).toProvider(FirebaseProvider);

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(FirebaseTokenService);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
