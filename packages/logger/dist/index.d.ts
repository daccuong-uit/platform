import * as winston from 'winston';
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';
export interface LoggerOptions {
    service: string;
    level?: LogLevel;
    prettyPrint?: boolean;
}
/**
 * Creates a structured, production-ready logger for a microservice.
 * Emits JSON in production and colorized human-readable logs in local development.
 */
export declare function createLogger(options: LoggerOptions): winston.Logger;
export type Logger = winston.Logger;
export { winston };
