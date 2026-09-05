import { z } from 'zod';
/**
 * Validates and parses environment variables using a Zod schema.
 * Throws a descriptive error at startup if any required variable is missing or invalid.
 */
export declare function loadConfig<T extends z.ZodTypeAny>(schema: T): z.infer<T>;
/** Base environment variables that every microservice must specify. */
export declare const BaseEnvSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "debug", "verbose"]>>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    LOG_LEVEL: "error" | "warn" | "info" | "debug" | "verbose";
}, {
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: number | undefined;
    LOG_LEVEL?: "error" | "warn" | "info" | "debug" | "verbose" | undefined;
}>;
export type BaseEnv = z.infer<typeof BaseEnvSchema>;
export { z };
