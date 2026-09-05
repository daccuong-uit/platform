"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = void 0;
exports.createRedisClient = createRedisClient;
const ioredis_1 = require("ioredis");
exports.Redis = ioredis_1.default;
/**
 * Creates a configured resilient ioredis client.
 * Supports URI strings and host/port connection parameters.
 */
function createRedisClient(options = {}) {
    const { url, enableAutoReconnect = true, keyPrefix, ...rest } = options;
    const ioredisOptions = {
        keyPrefix,
        enableAutoPipelining: true,
        maxRetriesPerRequest: 3,
        retryStrategy: enableAutoReconnect
            ? (times) => Math.min(times * 100, 3000) // exponential backoff capped at 3s
            : undefined,
        ...rest,
    };
    if (url) {
        return new ioredis_1.default(url, ioredisOptions);
    }
    return new ioredis_1.default({
        host: rest.host ?? 'localhost',
        port: rest.port ?? 6379,
        ...ioredisOptions,
    });
}
//# sourceMappingURL=index.js.map