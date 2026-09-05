import { z } from 'zod';

/**
 * Validates and parses environment variables using a Zod schema.
 * Throws a descriptive error at startup if any required variable is missing or invalid.
 */
export function loadConfig<T extends z.ZodTypeAny>(schema: T): z.infer<T> {
  const result = schema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');

    throw new Error(
      `\n[CONFIG] Invalid environment variables detected:\n${formatted}\n\nPlease check your .env file or environment setup.\n`,
    );
  }

  return result.data;
}

/** Base environment variables that every microservice must specify. */
export const BaseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'verbose']).default('info'),
});

export type BaseEnv = z.infer<typeof BaseEnvSchema>;

export { z };
