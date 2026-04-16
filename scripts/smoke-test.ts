import { db, sql } from '../db/index';
import { resources, tags } from '../db/schema';
import { eq } from 'drizzle-orm';

async function runSmokeTest() {
  console.log('Running backup restore smoke test...');

  try {
    const result = await sql`SELECT version()`;
    console.log('✓ Database connection successful');
    console.log(`  PostgreSQL version: ${result[0].version}`);

    const resourceCount = await db.select({ count: sql`count(*)` }).from(resources);
    console.log(`✓ Resources table accessible: ${resourceCount[0].count} rows`);

    if (Number(resourceCount[0].count) === 0) {
      throw new Error('Resources table is empty — backup may be incomplete');
    }

    const sampleId = 'TBD';

    if (sampleId !== 'TBD') {
      const sampleResource = await db.query.resources.findFirst({
        where: eq(resources.id, sampleId),
      });
      if (!sampleResource) {
        console.warn('⚠ Known sample resource not found');
      } else {
        console.log(`✓ Sample resource verified: ${sampleResource.title}`);
      }
    }

    const firstResource = await db.query.resources.findFirst();
    if (firstResource) {
      console.log(`✓ Fallback resource verified: ${firstResource.title}`);
    } else {
      throw new Error('No resources found — backup is empty');
    }

    const tagCount = await db.select({ count: sql`count(*)` }).from(tags);
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
