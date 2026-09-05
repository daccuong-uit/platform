"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winston = void 0;
exports.createLogger = createLogger;
const winston = require("winston");
exports.winston = winston;
const api_1 = require("@opentelemetry/api");
const { combine, timestamp, printf, colorize, json, errors } = winston.format;
/**
 * Winston format that injects OpenTelemetry trace context into the log info object.
 * Enables zero-effort correlation between application logs and distributed traces.
 */
const tracingFormat = winston.format((info) => {
    const span = api_1.trace.getSpan(api_1.context.active());
    if (span) {
        const { traceId, spanId } = span.spanContext();
        info.traceId = traceId;
        info.spanId = spanId;
    }
    return info;
});
const prettyFormat = combine(tracingFormat(), colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), printf(({ level, message, timestamp, service, stack, traceId, ...meta }) => {
    const traceStr = traceId ? ` [trace_id=${traceId}]` : '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const stackStr = stack ? `\n${stack}` : '';
    return `${timestamp} [${service}]${traceStr} ${level}: ${message}${metaStr}${stackStr}`;
}));
const jsonFormat = combine(tracingFormat(), timestamp(), errors({ stack: true }), json());
/**
 * Creates a structured, production-ready logger for a microservice.
 * Emits JSON in production and colorized human-readable logs in local development.
 */
function createLogger(options) {
    const { service, level = 'info', prettyPrint = process.env.NODE_ENV !== 'production' } = options;
    return winston.createLogger({
        level,
        defaultMeta: { service },
        format: prettyPrint ? prettyFormat : jsonFormat,
        transports: [
            new winston.transports.Console(),
        ],
    });
}
//# sourceMappingURL=index.js.map