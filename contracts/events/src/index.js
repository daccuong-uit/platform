"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserCreatedEvent = isUserCreatedEvent;
exports.isUserAccountStatusUpdatedEvent = isUserAccountStatusUpdatedEvent;
exports.isPostLikeCreatedEvent = isPostLikeCreatedEvent;
/**
 * Type guards for safe runtime event discrimination
 */
function isUserCreatedEvent(event) {
    return event.event_name === 'user.created.v1';
}
function isUserAccountStatusUpdatedEvent(event) {
    return event.event_name === 'user.account-status-updated.v1';
}
function isPostLikeCreatedEvent(event) {
    return event.event_name === 'post.like.created.v1';
}
//# sourceMappingURL=index.js.map