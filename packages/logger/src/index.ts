import * as winston from 'winston';
import { trace, context } from '@opentelemetry/api';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';

export interface LoggerOptions {
  service: string;
  level?: LogLevel;
  prettyPrint?: boolean;
}

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

/**
 * Winston format that injects OpenTelemetry trace context into the log info object.
 * Enables zero-effort correlation between application logs and distributed traces.
 */
const tracingFormat = winston.format((info) => {
  const span = trace.getSpan(context.active());
  if (span) {
    const { traceId, spanId } = span.spanContext();
    info.traceId = traceId;
    info.spanId = spanId;
  }
  return info;
});

const prettyFormat = combine(
  tracingFormat(),
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, service, stack, traceId, ...meta }) => {
    const traceStr = traceId ? ` [trace_id=${traceId}]` : '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const stackStr = stack ? `\n${stack}` : '';
    return `${timestamp} [${service}]${traceStr} ${level}: ${message}${metaStr}${stackStr}`;
  }),
);

const jsonFormat = combine(
  tracingFormat(),
  timestamp(),
  errors({ stack: true }),
  json(),
);

/**
 * Creates a structured, production-ready logger for a microservice.
 * Emits JSON in production and colorized human-readable logs in local development.
 */
export function createLogger(options: LoggerOptions): winston.Logger {
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

export type Logger = winston.Logger;
export { winston };
