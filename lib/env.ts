import { z } from 'zod';

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  MEILISEARCH_URL: z.string().url(),
  MEILISEARCH_API_KEY: z.string().min(1),
  MEILISEARCH_MASTER_KEY: z.string().min(1).optional(),
});

if (typeof window !== 'undefined') {
  throw new Error('lib/env.ts must not be imported in client code');
}

export const serverEnv = serverSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  MEILISEARCH_URL: process.env.MEILISEARCH_URL,
  MEILISEARCH_API_KEY: process.env.MEILISEARCH_API_KEY,
  MEILISEARCH_MASTER_KEY: process.env.MEILISEARCH_MASTER_KEY,
});
