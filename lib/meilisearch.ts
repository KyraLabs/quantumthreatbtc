import { MeiliSearch } from 'meilisearch';
import type { Resource } from '../db/schema';
import 'dotenv/config';

if (!process.env.MEILISEARCH_URL || !process.env.MEILISEARCH_MASTER_KEY) {
  throw new Error('Missing Meilisearch environment variables');
}

export const meilisearchClient = new MeiliSearch({
  host: process.env.MEILISEARCH_URL,
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});

export async function initializeMeilisearchIndex() {
  const index = meilisearchClient.index('resources');

  await index.updateSettings({
    searchableAttributes: ['title', 'summary', 'authors', 'tags'],
    filterableAttributes: ['type', 'date', 'technical_level', 'tags'],
    sortableAttributes: ['date'],
    rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 5,
        twoTypos: 9,
      },
    },
  });

  console.log('Meilisearch index configured');
}

export async function syncResourceToMeilisearch(resource: {
  id: string;
  title: string;
  summary: string;
  type: string;
  date: Date;
  authors: string[];
  tags: string[];
  technical_level: string;
  external_link: string;
}) {
  const index = meilisearchClient.index('resources');

  const document = {
    id: resource.id,
    title: resource.title,
    summary: resource.summary,
    type: resource.type,
    date: resource.date.toISOString(),
    authors: resource.authors,
    tags: resource.tags,
    technical_level: resource.technical_level,
    external_link: resource.external_link,
  };

  return await index.addDocuments([document]);
}

export async function deleteResourceFromMeilisearch(resourceId: string) {
  const index = meilisearchClient.index('resources');
  return await index.deleteDocument(resourceId);
}
