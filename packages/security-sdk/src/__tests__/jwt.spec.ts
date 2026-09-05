import { JwtService, AuthErrorCode } from '../src';

describe('Platform Security SDK', () => {
  const jwtService = new JwtService({
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
    expect(AuthErrorCode.INVALID_TOKEN).toBe('AUTH_INVALID_TOKEN');
    expect(AuthErrorCode.EXPIRED_TOKEN).toBe('AUTH_TOKEN_EXPIRED');
  });
});
