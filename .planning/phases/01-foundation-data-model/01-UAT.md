---
status: diagnosed
phase: 01-foundation-data-model
source:
  - 01-01-SUMMARY.md
  - 01-02-SUMMARY.md
  - 01-03-SUMMARY.md
  - 01-04-SUMMARY.md
  - 01-05-SUMMARY.md
started: 2026-04-17T05:17:37Z
updated: 2026-04-17T05:45:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Cold Start Smoke Test
expected: |
  Stop any running Meilisearch container and Next.js dev server. Start stack
  from scratch (docker compose up -d, db:migrate, npm run dev, smoke-test.ts).
  All four steps succeed without errors on a cold start.
result: pass

### 2. Next.js Dev Server Boot
expected: |
  Running `npm run dev` launches Next.js 16.2.4 with Turbopack, server becomes
  ready in under 2 seconds, and http://localhost:3001 (or 3000) renders the
  QuantumThreat BTC page without console errors.
result: pass

### 3. Environment Validation Fails Fast
expected: |
  Temporarily remove or rename `.env`, then run any DB script
  (e.g. `npx tsx db/migrate.ts`). The Zod schema in lib/env.ts rejects the
  missing config and exits with a clear error listing the missing variable(s)
  (DATABASE_URL, MEILISEARCH_URL, MEILISEARCH_MASTER_KEY). Restore `.env`
  afterward.
result: pass

### 4. Biome Lint Passes
expected: |
  Running `npm run lint` reports zero errors and zero warnings across the
  project. Running `npm run format` leaves the tree clean (no diff).
result: issue
reported: "10 errors, 4 warnings: noNonNullAssertion in db/index.ts, db/migrate.ts, drizzle.config.ts; unused import Resource in lib/meilisearch.ts; unsorted imports in db/schema.ts, db/seed.ts, scripts/check-meilisearch.ts, scripts/get-sample-id.ts; formatter violations in db/seed.ts, lib/meilisearch.ts, drizzle/meta/*.json, scripts/verify-tables.ts; useIterableCallbackReturn error in scripts/verify-tables.ts"
severity: major

### 5. Database Schema Applied
expected: |
  Running `npx tsx scripts/verify-tables.ts` (or equivalent query) confirms
  tables `resources` and `tags` exist in Neon Postgres with the expected
  columns, and the 5 resources indexes are present including 2 GIN indexes
  (idx_resources_tags, idx_resources_extras).
result: pass

### 6. Seed Data Loaded
expected: |
  Querying the database shows 17 rows in `tags` and 18 rows in `resources`.
  Resource type distribution: 7 Paper, 5 Article, 4 Research, 2 BIP. Each
  resource has non-null title, summary, type, date, and at least one tag.
result: pass

### 7. Meilisearch Index Populated
expected: |
  Visiting http://localhost:7700 (or running
  `npx tsx scripts/check-meilisearch.ts`) shows the `resources` index with 18
  documents indexed, searchable attributes configured (title, summary,
  authors, tags), and filterable attributes (type, date, technical_level,
  tags).
result: issue
reported: "Meilisearch dashboard shows no indexes at all — 'Select an index' dropdown is empty. No resources index exists."
severity: major

### 8. Smoke Test Script Passes
expected: |
  Running `npx tsx scripts/smoke-test.ts` prints 5 passing checks:
    1. Database connection successful (PostgreSQL 18.x)
    2. Resources table accessible (18 rows)
    3. Sample resource verified
    4. Tags table accessible (17 rows)
    5. Indexes verified (9 indexes found, 2+ GIN)
  Exit code 0.
result: pass

### 9. Backup Script Produces Dump
expected: |
  Running `./scripts/backup.sh` creates a timestamped file
  `backups/quantumthreatbtc_YYYYMMDD_HHMMSS.dump` in custom format with
  compression level 9. File is non-empty and `pg_restore --list` can read it.
result: issue
reported: "./scripts/backup.sh exits with: 'Error: DATABASE_URL environment variable not set. Load it from .env or export manually' — script does not auto-load .env"
severity: major

### 10. Restore Script Round-Trip
expected: |
  Running `./scripts/restore.sh <dump-file>` against a test database prompts
  for confirmation, restores the backup, then automatically runs smoke-test.ts
  which reports all 5 checks passing against the restored database.
result: blocked
blocked_by: prior-phase
reason: "No dump file available because backup.sh failed in test 9 (DATABASE_URL not loaded from .env)"

## Summary

total: 10
passed: 6
issues: 3
pending: 0
skipped: 0
blocked: 1

## Gaps

- truth: "npm run lint reports zero errors and zero warnings"
  status: diagnosed
  reason: "User reported: 10 errors, 4 warnings — noNonNullAssertion in db/index.ts, db/migrate.ts, drizzle.config.ts; unused import in lib/meilisearch.ts; unsorted imports in db/schema.ts, db/seed.ts, scripts/*.ts; formatter violations in multiple files; useIterableCallbackReturn in scripts/verify-tables.ts"
  severity: major
  test: 4
  root_cause: "Non-null assertions (!) on process.env.DATABASE_URL in db/index.ts, db/migrate.ts, drizzle.config.ts instead of guard pattern. Unused Resource type import in lib/meilisearch.ts. forEach callback with implicit return in scripts/verify-tables.ts. Multiple files committed without running biome format/check first."
  artifacts:
    - path: "db/index.ts"
      issue: "process.env.DATABASE_URL! — noNonNullAssertion violation"
    - path: "db/migrate.ts"
      issue: "process.env.DATABASE_URL! — noNonNullAssertion violation"
    - path: "drizzle.config.ts"
      issue: "process.env.DATABASE_URL! — noNonNullAssertion violation"
    - path: "lib/meilisearch.ts"
      issue: "import type { Resource } declared but never used in the file"
    - path: "scripts/verify-tables.ts"
      issue: "forEach callback has implicit return — needs block braces"
    - path: "drizzle/meta/"
      issue: "Generated files included in Biome check — should be in files.ignore"
  missing:
    - "Run biome check --write to auto-fix formatter, organizeImports, and unused import"
    - "Replace process.env.DATABASE_URL! with guard pattern in 3 files"
    - "Fix forEach callback in scripts/verify-tables.ts to use block braces"
    - "Add drizzle/meta/ to files.ignore in biome.json"
- truth: "Meilisearch resources index exists with 18 documents indexed"
  status: diagnosed
  reason: "User reported: Meilisearch dashboard shows no indexes at all — 'Select an index' dropdown is empty. No resources index exists."
  severity: major
  test: 7
  root_cause: "addDocuments() in Meilisearch client is async and returns an EnqueuedTask immediately. db/seed.ts calls syncResourceToMeilisearch() in a loop but exits with process.exit(0) before Meilisearch finishes processing the queued indexing tasks. On container restart, the indexes/ directory is empty because writes never completed."
  artifacts:
    - path: "db/seed.ts"
      issue: "Calls syncResourceToMeilisearch() then exits immediately — does not await task completion"
    - path: "lib/meilisearch.ts"
      issue: "syncResourceToMeilisearch returns EnqueuedTask but callers don't wait for task completion"
  missing:
    - "Collect EnqueuedTask UIDs from each addDocuments() call in seed"
    - "Await meilisearchClient.waitForTasks(taskUids) before process.exit(0)"
    - "Consider startup sync script to re-index from PostgreSQL when Meilisearch index is empty"
- truth: "./scripts/backup.sh runs without manual env export and produces a .dump file"
  status: diagnosed
  reason: "User reported: script exits with 'Error: DATABASE_URL environment variable not set. Load it from .env or export manually' — backup.sh does not auto-load .env"
  severity: major
  test: 9
  root_cause: "Bash scripts have no dotenv equivalent. backup.sh and restore.sh check for DATABASE_URL but never load .env. TypeScript scripts use import 'dotenv/config' but bash cannot."
  artifacts:
    - path: "scripts/backup.sh"
      issue: "No .env loading before DATABASE_URL check on line 8"
    - path: "scripts/restore.sh"
      issue: "No .env loading before DATABASE_URL check on line 22"
  missing:
    - "Add 'set -a; source .env; set +a' block after set -euo pipefail in backup.sh"
    - "Add same block to restore.sh"
