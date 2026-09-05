/**
 * Universal Domain Event Envelope.
 * Compliant with CloudEvents-like semantic structure.
 * Independent of any message broker (Kafka, RabbitMQ, Redis, SQS).
 */
export interface DomainEvent<TPayload = Record<string, unknown>> {
  event_id: string;
  event_name: string;
  occurred_at: string;
  producer: string;
  trace_id?: string;
  payload: TPayload;
}

/**
 * Payload for user.created.v1
 * Emitted when a new user is registered in iam-service.
 */
export interface UserCreatedPayload {
  userId: string;
  email?: string;
  phoneNumber?: string;
  username: string;
  displayName: string;
  preferredContactMethod?: 'EMAIL' | 'PHONE';
}

export interface UserCreatedEvent extends DomainEvent<UserCreatedPayload> {
  event_name: 'user.created.v1';
}

/**
 * Payload for user.account-status-updated.v1
 * Emitted when account state changes (e.g. BANNED, ACTIVE).
 */
export interface UserAccountStatusUpdatedPayload {
  userId: string;
  status: 'PENDING' | 'ACTIVE' | 'BANNED' | 'DELETED';
}

export interface UserAccountStatusUpdatedEvent extends DomainEvent<UserAccountStatusUpdatedPayload> {
  event_name: 'user.account-status-updated.v1';
}

/**
 * Payload for post.like.created.v1
 */
export interface PostLikeCreatedPayload {
  postId: string;
  userId: string;
}

export interface PostLikeCreatedEvent extends DomainEvent<PostLikeCreatedPayload> {
  event_name: 'post.like.created.v1';
}

/**
 * Type guards for safe runtime event discrimination
 */
export function isUserCreatedEvent(event: DomainEvent<unknown>): event is UserCreatedEvent {
  return event.event_name === 'user.created.v1';
}

export function isUserAccountStatusUpdatedEvent(
  event: DomainEvent<unknown>,
): event is UserAccountStatusUpdatedEvent {
  return event.event_name === 'user.account-status-updated.v1';
}

export function isPostLikeCreatedEvent(
  event: DomainEvent<unknown>,
): event is PostLikeCreatedEvent {
  return event.event_name === 'post.like.created.v1';
}
