import {
  isUserCreatedEvent,
  isUserAccountStatusUpdatedEvent,
  isPostLikeCreatedEvent,
  UserCreatedEvent,
} from '../src';

describe('Contracts Events', () => {
  it('correctly discriminates UserCreatedEvent', () => {
    const event: UserCreatedEvent = {
      event_id: '123e4567-e89b-12d3-a456-426614174000',
      event_name: 'user.created.v1',
      occurred_at: new Date().toISOString(),
      producer: 'auth-service',
      payload: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        username: 'testuser',
        displayName: 'Test User',
      },
    };

    expect(isUserCreatedEvent(event)).toBe(true);
    expect(isUserAccountStatusUpdatedEvent(event)).toBe(false);
    expect(isPostLikeCreatedEvent(event)).toBe(false);
  });
});
