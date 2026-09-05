import Redis, { RedisOptions } from 'ioredis';
export interface RedisClientOptions {
    url?: string;
    host?: string;
    port?: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
    /** Enable automatic reconnect on connection drop. Default: true */
    enableAutoReconnect?: boolean;
}
/**
 * Creates a configured resilient ioredis client.
 * Supports URI strings and host/port connection parameters.
 */
export declare function createRedisClient(options?: RedisClientOptions): Redis;
export { Redis };
export type { RedisOptions };
