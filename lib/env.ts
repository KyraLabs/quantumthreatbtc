import { z } from 'zod';

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  MEILISEARCH_URL: z.string().url(),
  MEILISEARCH_API_KEY: z.string().min(1),
  MEILISEARCH_MASTER_KEY: z.string().min(1).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

if (typeof window !== 'undefined') {
  throw new Error('lib/env.ts server exports must not be imported in client code');
}

export const serverEnv = serverSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  MEILISEARCH_URL: process.env.MEILISEARCH_URL,
  MEILISEARCH_API_KEY: process.env.MEILISEARCH_API_KEY,
  MEILISEARCH_MASTER_KEY: process.env.MEILISEARCH_MASTER_KEY,
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
