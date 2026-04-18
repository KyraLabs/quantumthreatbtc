import 'dotenv/config';
import { initializeMeilisearchIndex } from '../lib/meilisearch';

initializeMeilisearchIndex()
  .then(() => {
    console.log('Index initialized successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
