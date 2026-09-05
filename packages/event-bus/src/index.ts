import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { DomainEvent } from '@daccuong-uit/contracts-events';

/**
 * Enterprise Event Bus transport client using Redis Pub/Sub.
 * Manages reliable publishing and subscribing across microservices.
 */
@Injectable()
export class EventBusService implements OnModuleDestroy {
  private readonly logger = new Logger('EventBusService');
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  private readonly handlers: Map<string, Set<(event: DomainEvent<any>) => Promise<void>>> = new Map();

  constructor(redisUrl: string) {
    this.publisher = new Redis(redisUrl, {
      enableAutoPipelining: true,
      maxRetriesPerRequest: 3,
    });

    this.subscriber = new Redis(redisUrl, {
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

  async publish(event: DomainEvent<any>): Promise<void> {
    try {
      const channel = this.getChannelName(event.event_name);
      const payload = JSON.stringify({
        ...event,
        event_id: event.event_id || randomUUID(),
        occurred_at: event.occurred_at || new Date().toISOString(),
      });

      const numSubscribers = await this.publisher.publish(channel, payload);
      this.logger.debug(
        `Event published: ${event.event_name} (subscribers: ${numSubscribers})`,
        { event_id: event.event_id },
      );
    } catch (error) {
      this.logger.error(`Failed to publish event: ${event.event_name}`, error);
      throw error;
    }
  }

  async subscribe(
    eventName: string,
    handler: (event: DomainEvent<any>) => Promise<void>,
  ): Promise<void> {
    try {
      const channel = this.getChannelName(eventName);

      if (!this.handlers.has(channel)) {
        this.handlers.set(channel, new Set());

        this.subscriber.subscribe(channel, (err) => {
          if (err) {
            this.logger.error(`Failed to subscribe to ${channel}`, err);
          } else {
            this.logger.debug(`Subscribed to channel: ${channel}`);
          }
        });
      }

      this.handlers.get(channel)!.add(handler);

      this.subscriber.on('message', async (chan, message) => {
        if (chan === channel) {
          await this.handleMessage(chan, message);
        }
      });
    } catch (error) {
      this.logger.error(`Failed to subscribe to ${eventName}`, error);
      throw error;
    }
  }

  private async handleMessage(channel: string, message: string): Promise<void> {
    try {
      const event: DomainEvent<any> = JSON.parse(message);
      const handlers = this.handlers.get(channel);

      if (!handlers) {
        return;
      }

      const promises = Array.from(handlers).map((handler) =>
        handler(event).catch((err) => {
          this.logger.error(`Handler error for event ${event.event_name}`, err);
        }),
      );

      await Promise.all(promises);
    } catch (error) {
      this.logger.error(`Failed to handle message on ${channel}`, error);
    }
  }

  private getChannelName(eventName: string): string {
    return `events:${eventName}`;
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.debug('Disconnecting Redis event bus connections');
    await Promise.all([this.publisher.quit(), this.subscriber.quit()]);
  }
}

export { DomainEvent } from '@daccuong-uit/contracts-events';
