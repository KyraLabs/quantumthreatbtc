import { sql } from '../db/index';

(async () => {
  try {
    const result = await sql`SELECT id FROM resources LIMIT 1`;
    console.log(result[0].id);
  } finally {
    await sql.end();
  }
})();
