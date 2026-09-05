import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

export interface TracingOptions {
  serviceName: string;
  serviceVersion?: string;
  /** OTLP collector endpoint. Defaults to http://localhost:4318/v1/traces */
  collectorUrl?: string;
  /** Set to false to disable tracing (e.g. in test environments). Default: true */
  enabled?: boolean;
}

let sdk: NodeSDK | null = null;

/**
 * Initializes OpenTelemetry distributed tracing.
 * MUST be invoked at the absolute beginning of service entrypoint before other imports.
 */
export function initTracing(options: TracingOptions): void {
  const {
    serviceName,
    serviceVersion = '1.0.0',
    collectorUrl = 'http://localhost:4318/v1/traces',
    enabled = process.env.NODE_ENV !== 'test',
  } = options;

  if (!enabled) {
    return;
  }

  const exporter = new OTLPTraceExporter({ url: collectorUrl });

  sdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: serviceName,
      [SEMRESATTRS_SERVICE_VERSION]: serviceVersion,
    }),
    traceExporter: exporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false }, // avoid excessive noise
      }),
    ],
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk?.shutdown().finally(() => process.exit(0));
  });
}

export { NodeSDK };
