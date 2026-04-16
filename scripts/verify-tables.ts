import { sql } from '../db/index';
import 'dotenv/config';

(async () => {
  const tables = await sql`
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename
  `;
  console.log('Tables in database:');
  tables.forEach(t => console.log('  -', t.tablename));
  await sql.end();
})();
