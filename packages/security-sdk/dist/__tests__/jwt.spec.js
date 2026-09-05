"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
describe('Platform Security SDK', () => {
    const jwtService = new src_1.JwtService({
        accessTokenSecret: 'test-access-secret-1234567890123456',
        refreshTokenSecret: 'test-refresh-secret-1234567890123456',
        accessTokenExpiresIn: '1h',
        refreshTokenExpiresIn: '7d',
    });
    const accountId = '123e4567-e89b-12d3-a456-426614174000';
    const email = 'developer@company.com';
    const jti = '223e4567-e89b-12d3-a456-426614174000';
    it('signs and verifies access and refresh tokens properly', () => {
        const tokens = jwtService.signTokenPair(accountId, email, jti);
        expect(tokens.accessToken).toBeDefined();
        expect(tokens.refreshToken).toBeDefined();
        const accessPayload = jwtService.verifyAccessToken(tokens.accessToken);
        expect(accessPayload.sub).toBe(accountId);
        expect(accessPayload.email).toBe(email);
        const refreshPayload = jwtService.verifyRefreshToken(tokens.refreshToken);
        expect(refreshPayload.sub).toBe(accountId);
        expect(refreshPayload.jti).toBe(jti);
    });
    it('exposes AuthErrorCode constants', () => {
        expect(src_1.AuthErrorCode.INVALID_TOKEN).toBe('AUTH_INVALID_TOKEN');
        expect(src_1.AuthErrorCode.EXPIRED_TOKEN).toBe('AUTH_TOKEN_EXPIRED');
    });
});
//# sourceMappingURL=jwt.spec.js.map