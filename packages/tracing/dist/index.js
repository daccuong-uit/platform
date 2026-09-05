"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeSDK = void 0;
exports.initTracing = initTracing;
const sdk_node_1 = require("@opentelemetry/sdk-node");
Object.defineProperty(exports, "NodeSDK", { enumerable: true, get: function () { return sdk_node_1.NodeSDK; } });
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
let sdk = null;
/**
 * Initializes OpenTelemetry distributed tracing.
 * MUST be invoked at the absolute beginning of service entrypoint before other imports.
 */
function initTracing(options) {
    const { serviceName, serviceVersion = '1.0.0', collectorUrl = 'http://localhost:4318/v1/traces', enabled = process.env.NODE_ENV !== 'test', } = options;
    if (!enabled) {
        return;
    }
    const exporter = new exporter_trace_otlp_http_1.OTLPTraceExporter({ url: collectorUrl });
    sdk = new sdk_node_1.NodeSDK({
        resource: new resources_1.Resource({
            [semantic_conventions_1.SEMRESATTRS_SERVICE_NAME]: serviceName,
            [semantic_conventions_1.SEMRESATTRS_SERVICE_VERSION]: serviceVersion,
        }),
        traceExporter: exporter,
        instrumentations: [
            (0, auto_instrumentations_node_1.getNodeAutoInstrumentations)({
                '@opentelemetry/instrumentation-fs': { enabled: false }, // avoid excessive noise
            }),
        ],
    });
    sdk.start();
    process.on('SIGTERM', () => {
        sdk?.shutdown().finally(() => process.exit(0));
    });
}
//# sourceMappingURL=index.js.map