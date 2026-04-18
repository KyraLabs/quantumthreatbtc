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

    const overrideId = process.env.SAMPLE_RESOURCE_ID;
    const sampleResource = overrideId
      ? await sql`SELECT id, title FROM resources WHERE id = ${overrideId} LIMIT 1`
      : await sql`SELECT id, title FROM resources ORDER BY created_at ASC LIMIT 1`;

    if (sampleResource.length === 0) {
      throw new Error('No resources found — backup is empty');
    }
    console.log(`✓ Sample resource verified: ${sampleResource[0].title}`);

    const tagCount = await sql`SELECT count(*)::int as count FROM tags`;
    console.log(`✓ Tags table accessible: ${tagCount[0].count} rows`);

    const indexes = await sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename IN ('resources', 'tags')
      ORDER BY indexname
    `;
    console.log(`✓ Indexes verified: ${indexes.length} indexes found`);

    const ginIndexes = (indexes as unknown as Array<{ indexname: string; indexdef: string }>).filter(
      (idx) => /USING gin/i.test(idx.indexdef)
    );
    if (ginIndexes.length < 2) {
      throw new Error(`Missing GIN indexes for full-text search (expected 2, found ${ginIndexes.length})`);
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
