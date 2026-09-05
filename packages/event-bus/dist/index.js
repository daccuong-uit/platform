"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBusService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const crypto_1 = require("crypto");
/**
 * Enterprise Event Bus transport client using Redis Pub/Sub.
 * Manages reliable publishing and subscribing across microservices.
 */
let EventBusService = class EventBusService {
    constructor(redisUrl) {
        this.logger = new common_1.Logger('EventBusService');
        this.handlers = new Map();
        this.publisher = new ioredis_1.default(redisUrl, {
            enableAutoPipelining: true,
            maxRetriesPerRequest: 3,
        });
        this.subscriber = new ioredis_1.default(redisUrl, {
            enableAutoPipelining: true,
            maxRetriesPerRequest: 3,
        });
        this.publisher.on('error', (err) => {
            this.logger.error('Publisher error', err);
        });
        this.subscriber.on('error', (err) => {
            this.logger.error('Subscriber error', err);
        });
    }
    async publish(event) {
        try {
            const channel = this.getChannelName(event.event_name);
            const payload = JSON.stringify({
                ...event,
                event_id: event.event_id || (0, crypto_1.randomUUID)(),
                occurred_at: event.occurred_at || new Date().toISOString(),
            });
            const numSubscribers = await this.publisher.publish(channel, payload);
            this.logger.debug(`Event published: ${event.event_name} (subscribers: ${numSubscribers})`, { event_id: event.event_id });
        }
        catch (error) {
            this.logger.error(`Failed to publish event: ${event.event_name}`, error);
            throw error;
        }
    }
    async subscribe(eventName, handler) {
        try {
            const channel = this.getChannelName(eventName);
            if (!this.handlers.has(channel)) {
                this.handlers.set(channel, new Set());
                this.subscriber.subscribe(channel, (err) => {
                    if (err) {
                        this.logger.error(`Failed to subscribe to ${channel}`, err);
                    }
                    else {
                        this.logger.debug(`Subscribed to channel: ${channel}`);
                    }
                });
            }
            this.handlers.get(channel).add(handler);
            this.subscriber.on('message', async (chan, message) => {
                if (chan === channel) {
                    await this.handleMessage(chan, message);
                }
            });
        }
        catch (error) {
            this.logger.error(`Failed to subscribe to ${eventName}`, error);
            throw error;
        }
    }
    async handleMessage(channel, message) {
        try {
            const event = JSON.parse(message);
            const handlers = this.handlers.get(channel);
            if (!handlers) {
                return;
            }
            const promises = Array.from(handlers).map((handler) => handler(event).catch((err) => {
                this.logger.error(`Handler error for event ${event.event_name}`, err);
            }));
            await Promise.all(promises);
        }
        catch (error) {
            this.logger.error(`Failed to handle message on ${channel}`, error);
        }
    }
    getChannelName(eventName) {
        return `events:${eventName}`;
    }
    async onModuleDestroy() {
        this.logger.debug('Disconnecting Redis event bus connections');
        await Promise.all([this.publisher.quit(), this.subscriber.quit()]);
    }
};
exports.EventBusService = EventBusService;
exports.EventBusService = EventBusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], EventBusService);
//# sourceMappingURL=index.js.map