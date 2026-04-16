import { sql } from '../db/index';

async function runSmokeTest() {
  console.log('Running backup restore smoke test...');

  try {
    const result = await sql`SELECT version()`;
    console.log('✓ Database connection successful');
    console.log(`  PostgreSQL version: ${result[0].version}`);

    const resourceCount = await sql`SELECT count(*)::int as count FROM resources`;
    console.log(`✓ Resources table accessible: ${resourceCount[0].count} rows`);

    if (Number(resourceCount[0].count) === 0) {
      throw new Error('Resources table is empty — backup may be incomplete');
    }

    const sampleId = '019d9481-b79b-7287-9f8c-1e6d18a26b29';

    if (sampleId !== 'TBD') {
      const sampleResource = await sql`
        SELECT id, title FROM resources WHERE id = ${sampleId}
      `;
      if (sampleResource.length === 0) {
        console.warn('⚠ Known sample resource not found');
      } else {
        console.log(`✓ Sample resource verified: ${sampleResource[0].title}`);
      }
    }

    const firstResource = await sql`SELECT id, title FROM resources LIMIT 1`;
    if (firstResource.length > 0) {
      console.log(`✓ Fallback resource verified: ${firstResource[0].title}`);
    } else {
      throw new Error('No resources found — backup is empty');
    }

    const tagCount = await sql`SELECT count(*)::int as count FROM tags`;
    console.log(`✓ Tags table accessible: ${tagCount[0].count} rows`);

    const indexes = await sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename IN ('resources', 'tags')
      ORDER BY indexname
    `;
    console.log(`✓ Indexes verified: ${indexes.length} indexes found`);

    const ginIndexes = indexes.filter((idx: { indexdef: string }) => idx.indexdef.includes('gin'));
    if (ginIndexes.length < 2) {
      console.warn(`⚠ Expected 2 GIN indexes, found ${ginIndexes.length}`);
    }

    console.log('\n✅ Smoke test PASSED — backup restore successful');
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Smoke test FAILED');
    console.error(error);
    await sql.end();
    process.exit(1);
  }
}

runSmokeTest();
