import { z } from 'zod';
/** Access token payload schema */
export declare const AccessTokenPayloadSchema: z.ZodObject<{
    sub: z.ZodString;
    email: z.ZodString;
    iat: z.ZodOptional<z.ZodNumber>;
    exp: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sub: string;
    email: string;
    iat?: number | undefined;
    exp?: number | undefined;
}, {
    sub: string;
    email: string;
    iat?: number | undefined;
    exp?: number | undefined;
}>;
/** Refresh token payload schema */
export declare const RefreshTokenPayloadSchema: z.ZodObject<{
    sub: z.ZodString;
    jti: z.ZodString;
    iat: z.ZodOptional<z.ZodNumber>;
    exp: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sub: string;
    jti: string;
    iat?: number | undefined;
    exp?: number | undefined;
}, {
    sub: string;
    jti: string;
    iat?: number | undefined;
    exp?: number | undefined;
}>;
export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;
/** Standardized Auth Error Codes */
export declare const AuthErrorCode: {
    readonly INVALID_TOKEN: "AUTH_INVALID_TOKEN";
    readonly EXPIRED_TOKEN: "AUTH_TOKEN_EXPIRED";
    readonly INSUFFICIENT_PERMISSIONS: "AUTH_INSUFFICIENT_PERMISSIONS";
    readonly ACCOUNT_NOT_FOUND: "AUTH_ACCOUNT_NOT_FOUND";
    readonly ACCOUNT_BANNED: "AUTH_ACCOUNT_BANNED";
    readonly INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS";
};
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
export declare class JwtService {
    private readonly options;
    constructor(options: JwtServiceOptions);
    signAccessToken(payload: Omit<AccessTokenPayload, 'iat' | 'exp'>): string;
    signRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string;
    verifyAccessToken(token: string): AccessTokenPayload;
    verifyRefreshToken(token: string): RefreshTokenPayload;
    signTokenPair(accountId: string, email: string, jti: string): TokenPair;
}
