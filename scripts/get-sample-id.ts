import { sql } from '../db/index';

(async () => {
  const result = await sql`SELECT id FROM resources LIMIT 1`;
  console.log(result[0].id);
  await sql.end();
})();
