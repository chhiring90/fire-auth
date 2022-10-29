import {TokenService} from '@loopback/authentication';
import {BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import * as firebaseAdmin from 'firebase-admin';

@injectable({scope: BindingScope.TRANSIENT})
export class FirebaseTokenService implements TokenService {
  constructor(/* Add @inject to inject parameters */) {}

  tokenToUserProfile(token: firebaseAdmin.auth.DecodedIdToken): UserProfile {
    return {
      [securityId]: token.uid,
      email: token.email,
      name: token.name,
      picture: token.picture,
      isEmailVerified: token.email_verified,
      createdAt: token.iat,
    };
  }

  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      return this.tokenToUserProfile(decodedToken);
    } catch (error: any) {
      throw new HttpErrors.Unauthorized(error.code);
    }
  }

  generateToken(userProfile: UserProfile): Promise<string> {
    throw new HttpErrors.PreconditionFailed('Method not implemented.');
  }
}
