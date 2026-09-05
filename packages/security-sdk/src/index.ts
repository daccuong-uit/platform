import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';

/** Access token payload schema */
export const AccessTokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

/** Refresh token payload schema */
export const RefreshTokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  jti: z.string().uuid(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;

/** Standardized Auth Error Codes */
export const AuthErrorCode = {
  INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  EXPIRED_TOKEN: 'AUTH_TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
  ACCOUNT_NOT_FOUND: 'AUTH_ACCOUNT_NOT_FOUND',
  ACCOUNT_BANNED: 'AUTH_ACCOUNT_BANNED',
  INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

export interface JwtServiceOptions {
  accessTokenSecret: string;
  refreshTokenSecret?: string;
  accessTokenExpiresIn?: string | number;
  refreshTokenExpiresIn?: string | number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Stateless JWT utility for signing and verifying tokens across services.
 */
export class JwtService {
  constructor(private readonly options: JwtServiceOptions) {}

  signAccessToken(payload: Omit<AccessTokenPayload, 'iat' | 'exp'>): string {
    const signOptions: SignOptions = {
      expiresIn: (this.options.accessTokenExpiresIn ?? '15m') as any,
    };
    return jwt.sign(payload, this.options.accessTokenSecret, signOptions);
  }

  signRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
    if (!this.options.refreshTokenSecret) {
      throw new Error('refreshTokenSecret must be provided to sign refresh tokens');
    }
    const signOptions: SignOptions = {
      expiresIn: (this.options.refreshTokenExpiresIn ?? '7d') as any,
    };
    return jwt.sign(payload, this.options.refreshTokenSecret, signOptions);
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, this.options.accessTokenSecret) as AccessTokenPayload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    if (!this.options.refreshTokenSecret) {
      throw new Error('refreshTokenSecret must be provided to verify refresh tokens');
    }
    return jwt.verify(token, this.options.refreshTokenSecret) as RefreshTokenPayload;
  }

  signTokenPair(accountId: string, email: string, jti: string): TokenPair {
    return {
      accessToken: this.signAccessToken({ sub: accountId, email }),
      refreshToken: this.signRefreshToken({ sub: accountId, jti }),
    };
  }
}
