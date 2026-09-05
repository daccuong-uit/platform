import { loadConfig, BaseEnvSchema, z } from '../src';

describe('Platform Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('successfully loads and parses valid environment variables', () => {
    process.env.PORT = '4000';
    process.env.NODE_ENV = 'production';
    process.env.LOG_LEVEL = 'debug';

    const config = loadConfig(BaseEnvSchema);
    expect(config.PORT).toBe(4000);
    expect(config.NODE_ENV).toBe('production');
    expect(config.LOG_LEVEL).toBe('debug');
  });

  it('throws descriptive error on missing required variable', () => {
    const CustomSchema = z.object({
      REQUIRED_SECRET: z.string().min(10),
    });

    expect(() => loadConfig(CustomSchema)).toThrow('Invalid environment variables detected');
  });
});
