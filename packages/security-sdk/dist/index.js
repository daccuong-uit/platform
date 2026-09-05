"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = exports.AuthErrorCode = exports.RefreshTokenPayloadSchema = exports.AccessTokenPayloadSchema = void 0;
const jwt = require("jsonwebtoken");
const zod_1 = require("zod");
/** Access token payload schema */
exports.AccessTokenPayloadSchema = zod_1.z.object({
    sub: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    iat: zod_1.z.number().optional(),
    exp: zod_1.z.number().optional(),
});
/** Refresh token payload schema */
exports.RefreshTokenPayloadSchema = zod_1.z.object({
    sub: zod_1.z.string().uuid(),
    jti: zod_1.z.string().uuid(),
    iat: zod_1.z.number().optional(),
    exp: zod_1.z.number().optional(),
});
/** Standardized Auth Error Codes */
exports.AuthErrorCode = {
    INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
    EXPIRED_TOKEN: 'AUTH_TOKEN_EXPIRED',
    INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
    ACCOUNT_NOT_FOUND: 'AUTH_ACCOUNT_NOT_FOUND',
    ACCOUNT_BANNED: 'AUTH_ACCOUNT_BANNED',
    INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
};
/**
 * Stateless JWT utility for signing and verifying tokens across services.
 */
class JwtService {
    constructor(options) {
        this.options = options;
    }
    signAccessToken(payload) {
        const signOptions = {
            expiresIn: (this.options.accessTokenExpiresIn ?? '15m'),
        };
        return jwt.sign(payload, this.options.accessTokenSecret, signOptions);
    }
    signRefreshToken(payload) {
        if (!this.options.refreshTokenSecret) {
            throw new Error('refreshTokenSecret must be provided to sign refresh tokens');
        }
        const signOptions = {
            expiresIn: (this.options.refreshTokenExpiresIn ?? '7d'),
        };
        return jwt.sign(payload, this.options.refreshTokenSecret, signOptions);
    }
    verifyAccessToken(token) {
        return jwt.verify(token, this.options.accessTokenSecret);
    }
    verifyRefreshToken(token) {
        if (!this.options.refreshTokenSecret) {
            throw new Error('refreshTokenSecret must be provided to verify refresh tokens');
        }
        return jwt.verify(token, this.options.refreshTokenSecret);
    }
    signTokenPair(accountId, email, jti) {
        return {
            accessToken: this.signAccessToken({ sub: accountId, email }),
            refreshToken: this.signRefreshToken({ sub: accountId, jti }),
        };
    }
}
exports.JwtService = JwtService;
//# sourceMappingURL=index.js.map