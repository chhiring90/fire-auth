import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  get,
  post,
  Request,
  requestBody,
  RestBindings,
  SessionUserProfile,
} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {FirebaseService} from '../services';
import {Credentials} from '../types';
import {credentialRequestBody} from './specs';

export class UserController {
  constructor(
    @service(FirebaseService) private readonly firebaseService: FirebaseService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: SessionUserProfile,
    @inject(RestBindings.Http.REQUEST) private req: Request,
  ) {}

  @authenticate('jwt')
  @get('/users/me', {
    responses: {
      ['200']: {
        description: 'Current User',
        content: {
          ['application/json']: {},
        },
      },
    },
  })
  async findAll(
    @inject(SecurityBindings.USER)
    currentUserProfile: SessionUserProfile,
  ): Promise<any> {
    return currentUserProfile;
  }

  @post('/users/signup', {
    responses: {
      ['200']: {
        description: 'Current User',
        content: {
          ['application/json']: {},
        },
      },
    },
  })
  async signup(
    @requestBody(credentialRequestBody) creds: Credentials,
  ): Promise<any> {
    return await this.firebaseService.signup(creds);
  }

  @post('/users/login', {
    responses: {
      ['200']: {
        description: 'Current User',
        content: {
          ['application/json']: {},
        },
      },
    },
  })
  async login(
    @requestBody(credentialRequestBody) creds: Credentials,
  ): Promise<any> {
    return await this.firebaseService.login(creds);
  }

  @authenticate('jwt')
  @post('/users/signout', {
    responses: {
      ['200']: {
        description: 'Current User',
        content: {
          ['application/json']: {},
        },
      },
    },
  })
  async signout() {
    return await this.firebaseService.signout();
  }
}
