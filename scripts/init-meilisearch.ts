import { initializeMeilisearchIndex } from '../lib/meilisearch';

initializeMeilisearchIndex()
  .then(() => console.log('Index initialized successfully'))
  .catch(console.error)
  .finally(() => process.exit());
