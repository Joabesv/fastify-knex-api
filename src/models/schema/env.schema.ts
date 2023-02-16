import { config as dotEnvConfig } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test') {
  dotEnvConfig({ path: '.env.test' });
} else {
  dotEnvConfig();
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['pg', 'sqlite']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(5000),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.log('invalid envs', env.error.format());
  throw new Error('Invalid environments variables');
}

export const config = env.data;
