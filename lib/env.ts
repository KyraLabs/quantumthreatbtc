import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  MEILISEARCH_URL: z.string().url(),
  MEILISEARCH_MASTER_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  MEILISEARCH_URL: process.env.MEILISEARCH_URL,
  MEILISEARCH_MASTER_KEY: process.env.MEILISEARCH_MASTER_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
