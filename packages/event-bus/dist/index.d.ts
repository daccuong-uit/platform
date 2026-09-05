import { OnModuleDestroy } from '@nestjs/common';
import { DomainEvent } from '@daccuong-uit/contracts-events';
/**
 * Enterprise Event Bus transport client using Redis Pub/Sub.
 * Manages reliable publishing and subscribing across microservices.
 */
export declare class EventBusService implements OnModuleDestroy {
    private readonly logger;
    private readonly publisher;
    private readonly subscriber;
    private readonly handlers;
    constructor(redisUrl: string);
    publish(event: DomainEvent<any>): Promise<void>;
    subscribe(eventName: string, handler: (event: DomainEvent<any>) => Promise<void>): Promise<void>;
    private handleMessage;
    private getChannelName;
    onModuleDestroy(): Promise<void>;
}
export { DomainEvent } from '@daccuong-uit/contracts-events';
