import { meilisearchClient } from '../lib/meilisearch';
(async () => {
  try {
    const index = meilisearchClient.index('resources');
    const stats = await index.getStats();
    console.log('Meilisearch stats:', JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
})();
