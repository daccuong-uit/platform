import { NodeSDK } from '@opentelemetry/sdk-node';
export interface TracingOptions {
    serviceName: string;
    serviceVersion?: string;
    /** OTLP collector endpoint. Defaults to http://localhost:4318/v1/traces */
    collectorUrl?: string;
    /** Set to false to disable tracing (e.g. in test environments). Default: true */
    enabled?: boolean;
}
/**
 * Initializes OpenTelemetry distributed tracing.
 * MUST be invoked at the absolute beginning of service entrypoint before other imports.
 */
export declare function initTracing(options: TracingOptions): void;
export { NodeSDK };
