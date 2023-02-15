import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(5000),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.log('invalid envs', env.error.format());
  throw new Error('Invalid environments variables');
}

export const config = env.data;
