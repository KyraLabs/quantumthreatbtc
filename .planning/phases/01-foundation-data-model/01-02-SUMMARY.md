---
phase: 01-foundation-data-model
plan: 02
subsystem: database
tags:
  - drizzle-orm
  - postgresql
  - schema
  - migrations
dependency_graph:
  requires: []
  provides:
    - database-schema
    - migration-infrastructure
  affects:
    - plan-03-meilisearch-setup
    - plan-04-database-seeding
tech_stack:
  added:
    - drizzle-orm@0.36.10
    - postgres@3.4.7
    - drizzle-kit@0.31.4
  patterns:
    - JSONB hybrid schema design
    - PostgreSQL 18 uuidv7() timestamp-ordered IDs
    - GIN indexes for JSONB containment queries
    - Drizzle Kit migration workflow
key_files:
  created:
    - db/schema.ts
    - db/index.ts
    - db/migrate.ts
    - drizzle.config.ts
    - drizzle/0000_init.sql
    - drizzle/meta/0000_snapshot.json
    - drizzle/meta/_journal.json
  modified:
    - .gitignore
key_decisions:
  - title: "Use uuidv7() for timestamp-ordered primary keys"
    rationale: "PostgreSQL 18's uuidv7() provides both unique IDs and chronological sortability without separate created_at index. Reduces index size and improves range query performance."
    alternatives: "gen_random_uuid() with explicit created_at column (compatible with PG 17)"
  - title: "Version control drizzle/ migration directory"
    rationale: "Migration files are source code - they must be versioned for reproducible schema evolution across environments. Removed drizzle/ from .gitignore."
    alternatives: "Ignore migrations and regenerate (loses history, breaks rollbacks)"
  - title: "JSONB arrays for tags instead of junction table"
    rationale: "Tags are controlled vocabulary (limited set). JSONB array with GIN index provides better query performance than joins for many-to-many with small cardinality."
    alternatives: "Junction table resources_tags (adds join overhead)"
requirements_completed:
  - DATA-01
  - DATA-02
  - DATA-03
  - DATA-04
metrics:
  duration: 6 min
  tasks_completed: 3
  files_created: 7
  files_modified: 1
  commits: 3
  completed: 2026-04-16
---

# Phase 01 Plan 02: Drizzle Schema and Migrations Summary

PostgreSQL 18 database schema with Resources and Tags tables, GIN indexes for JSONB columns, and migration infrastructure using Drizzle ORM. Schema ready for Meilisearch sync (Plan 03) and seeding (Plan 04).

## Execution Summary

**Duration:** 6 min
**Started:** 2026-04-16T01:26:44Z
**Completed:** 2026-04-16T01:32:44Z
**Tasks:** 3/3 completed
**Files created:** 7
**Commits:** 3 (b244643, cd9359c, 121e852)

## What Was Built

### Database Schema (db/schema.ts)

Created Drizzle ORM schema with two tables:

**Resources table (13 columns):**
- `id`: uuid primary key with `uuidv7()` default (PostgreSQL 18 timestamp-ordered UUIDs)
- `title`, `summary`, `type`, `external_link`, `technical_level`: text fields for core metadata
- `date`, `last_verified`, `created_at`, `updated_at`: timestamp fields with timezone
- `authors`: text array for multiple authors
- `tags`: JSONB array typed as `string[]` for controlled tag vocabulary
- `extras`: JSONB object typed as `Record<string, unknown>` for resource-specific metadata (DOI, BIP number, conference, etc.)

**Indexes on resources:**
- B-tree: type, date, technical_level (for filtering and sorting)
- GIN: tags, extras (for JSONB containment queries `@>`)

**Tags table (4 columns):**
- `id`: uuid primary key with `uuidv7()` default
- `name`: text with unique constraint (display name like "Shor's Algorithm")
- `slug`: text with unique constraint (URL-safe like "shors-algorithm")
- `created_at`: timestamp with timezone

**Type exports:**
- `Resource`, `NewResource`, `Tag`, `NewTag` — inferred from table definitions for type-safe queries

### Database Connection (db/index.ts)

Connection pooling configuration optimized for serverless:
- **max: 10** — Neon free tier supports up to 10 concurrent connections
- **idle_timeout: 20s** — Close idle connections quickly for short-lived serverless functions
- **connect_timeout: 10s** — Fail fast if database unreachable (don't block cold starts)

Exports:
- `db` — Drizzle instance with schema for relational queries
- `sql` — Raw postgres.js client for migrations and cleanup

### Migration Infrastructure

**drizzle.config.ts:**
- Dialect: postgresql
- Schema: ./db/schema.ts
- Output: ./drizzle
- Credentials: DATABASE_URL environment variable

**db/migrate.ts:**
- Migration runner script using postgres.js with single connection (max: 1)
- Loads migrations from ./drizzle directory
- Applies migrations in order via Drizzle's migrate() function

**Generated migration (drizzle/0000_init.sql):**
- CREATE TABLE "resources" with all 13 columns
- CREATE TABLE "tags" with unique constraints
- CREATE INDEX statements for 5 indexes (3 B-tree + 2 GIN)
- Migration metadata in drizzle/meta/ for Drizzle Kit tracking

### Configuration Changes

**.gitignore:**
- Removed `drizzle/` from ignore list to version control migrations
- Migration files are source code and must be versioned for reproducible schema evolution

## Schema Design Decisions

### 1. JSONB Hybrid Approach

**What:** Core columns for stable, high-query fields + JSONB `extras` for variable metadata.

**Why:**
- Title, type, date, technical_level are queried frequently → column indexes are 10-100x faster than JSONB queries
- DOI (Papers), BIP number (BIPs), conference (Research) vary by resource type → JSONB allows flexibility without schema changes
- GIN indexes make JSONB queries fast enough for controlled vocabulary (tags)

**Alternative considered:** All metadata in JSONB (simpler schema, but slower common queries)

### 2. Tags as JSONB Array (Not Junction Table)

**What:** Resources.tags column stores array of tag names as JSONB, not separate resources_tags junction table.

**Why:**
- Tags are controlled vocabulary (limited set defined in Tags table)
- JSONB array with GIN index provides O(1) containment checks
- Avoids JOIN overhead for many-to-many relationship
- Query: `WHERE tags @> '["Shor's Algorithm"]'` uses GIN index efficiently

**Alternative considered:** Junction table (standard many-to-many pattern, but adds join complexity)

### 3. PostgreSQL 18 uuidv7() for Primary Keys

**What:** Use uuidv7() instead of gen_random_uuid() for id columns.

**Why:**
- UUIDv7 embeds timestamp in first 48 bits → chronologically sortable
- Reduces need for separate created_at index in some queries
- B-tree primary key clustering improves range query performance
- Compatible with existing UUID-based systems (UUIDv7 is valid UUIDv4)

**Requirement:** PostgreSQL 18+ (uuidv7() added in PG 18)

### 4. Index Strategy

**B-tree indexes (type, date, technical_level):**
- Used for exact match filtering: `WHERE type = 'Paper'`
- Used for range queries: `WHERE date >= '2024-01-01'`
- Used for sorting: `ORDER BY date DESC`

**GIN indexes (tags, extras JSONB):**
- Used for containment queries: `WHERE tags @> '["ECDSA"]'`
- Used for existence checks: `WHERE extras ? 'doi'`
- 10-100x faster than sequential scans for JSONB operations

## Task Breakdown

### Task 1: Create Drizzle Schema
**Duration:** ~2 min
**Commit:** b244643
**Files:** db/schema.ts

Created schema with:
- Resources table: 13 columns, 5 indexes (3 B-tree + 2 GIN)
- Tags table: 4 columns, 2 unique constraints
- TypeScript type exports for compile-time safety

**Verification:**
- ✓ 2 uuidv7() usages (resources.id, tags.id)
- ✓ 2 GIN indexes (tags, extras)
- ✓ Type exports present

### Task 2: Create Database Connection
**Duration:** ~1 min
**Commit:** cd9359c
**Files:** db/index.ts

Configured postgres.js connection pooling:
- max: 10, idle_timeout: 20s, connect_timeout: 10s
- Drizzle instance with schema for relational queries
- Raw SQL client export for migrations

**Verification:**
- ✓ Connection pooling configured
- ✓ db and sql exports present

### Task 3: Configure Drizzle Kit and Generate Migration
**Duration:** ~3 min
**Commit:** 121e852
**Files:** drizzle.config.ts, db/migrate.ts, drizzle/0000_init.sql, drizzle/meta/*

Steps executed:
1. Created drizzle.config.ts with schema path and output directory
2. Created db/migrate.ts migration runner script
3. Installed dependencies (npm install)
4. Updated drizzle-orm to latest for compatibility with drizzle-kit
5. Generated initial migration: `npm run db:generate -- --name=init`
6. Updated .gitignore to version control migrations

**Verification:**
- ✓ drizzle/0000_init.sql exists
- ✓ Contains CREATE TABLE resources and CREATE TABLE tags
- ✓ Contains 2 GIN indexes (USING gin)
- ✓ drizzle/meta/ directory exists with migration metadata

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] drizzle-orm version incompatibility**
- **Found during:** Task 3, initial migration generation
- **Issue:** drizzle-kit 0.31.4 required newer drizzle-orm version than 0.31.0 specified in package.json
- **Fix:** Updated drizzle-orm to latest (0.36.10) via `npm install drizzle-orm@latest`
- **Files modified:** package.json, package-lock.json
- **Verification:** Migration generation succeeded after update
- **Commit:** Included in 121e852 (migration configuration commit)

**2. [Rule 2 - Missing Critical Functionality] .gitignore excluding migration files**
- **Found during:** Task 3, attempting to commit drizzle/ directory
- **Issue:** .gitignore contained `drizzle/` entry, preventing version control of migration files. Migration files are source code and must be versioned for reproducible schema evolution across environments.
- **Fix:** Updated .gitignore to comment out drizzle/ exclusion with explanation
- **Files modified:** .gitignore
- **Verification:** git add drizzle/ succeeded after fix
- **Commit:** Included in 121e852 (migration configuration commit)

**Total deviations:** 2 auto-fixed (1 blocking issue, 1 missing critical functionality). No architectural decisions required.

**Impact:** Minimal. Both fixes were standard dependency resolution (updating to compatible version) and configuration correction (versioning migrations). No schema design changes needed.

## Verification Results

All plan verification checks passed:

```bash
# 1. Schema file is valid TypeScript
npx tsc --project .
# ✓ Passes (deprecation warning in tsconfig is non-critical)

# 2. Config file is valid
# ✓ drizzle.config.ts compiles without errors

# 3. Migration generated
test -f drizzle/0000_init.sql
# ✓ Migration exists

# 4. Migration contains expected tables
grep -E 'CREATE TABLE "(resources|tags)"' drizzle/0000_init.sql
# ✓ Both tables present

# 5. GIN indexes present
grep -i "using gin" drizzle/0000_init.sql | wc -l
# ✓ 2 indexes (tags, extras)
```

## PostgreSQL 18 Specific Features Used

1. **uuidv7() function:**
   - Replaces gen_random_uuid() for timestamp-ordered UUIDs
   - Usage: `id: uuid('id').primaryKey().default(sql\`uuidv7()\`)`
   - Benefit: Chronological sortability without separate created_at index

2. **GIN indexes for JSONB:**
   - Not PG 18 specific, but optimized in PG 18 with async I/O improvements
   - 15-25% faster short-lived queries (PG 18 vs PG 17)
   - Usage: `index('idx_resources_tags').using('gin', table.tags)`

## Known Stubs

None. All schema definitions are complete and ready for use. No placeholder values or TODO comments.

## Threat Surface Scan

No new security-relevant surface introduced beyond what was documented in plan's threat model:

- **T-01-04 (SQL Injection):** Mitigated by using Drizzle ORM parameterized queries exclusively
- **T-01-05 (Denial of Service):** Mitigated by connection pool limits (max: 10, idle_timeout: 20s)
- **T-01-06 (Information Disclosure):** DATABASE_URL in drizzle.config.ts is expected (developer-only operation)
- **T-01-07 (Tampering):** Migration files are version-controlled per T-01-07 mitigation plan

## Next Steps

**Ready for Plan 03:** Meilisearch Setup via Docker

This plan provides:
- ✓ Database schema for Meilisearch to index
- ✓ TypeScript types for sync functions
- ✓ Migration infrastructure for applying schema to Neon Postgres

Plan 03 will:
- Set up Meilisearch Docker container
- Configure resources index with searchable/filterable attributes
- Create sync functions to mirror PostgreSQL → Meilisearch

**Migration application (Plan 04):**
- Migrations are generated but NOT YET APPLIED to database
- Plan 04 will run `npm run db:migrate` to create tables in Neon Postgres
- Then seed database with sample quantum-Bitcoin resources

## Self-Check: PASSED

**Files created verification:**
```bash
[ -f "db/schema.ts" ] && echo "FOUND: db/schema.ts"
# ✓ FOUND: db/schema.ts

[ -f "db/index.ts" ] && echo "FOUND: db/index.ts"
# ✓ FOUND: db/index.ts

[ -f "db/migrate.ts" ] && echo "FOUND: db/migrate.ts"
# ✓ FOUND: db/migrate.ts

[ -f "drizzle.config.ts" ] && echo "FOUND: drizzle.config.ts"
# ✓ FOUND: drizzle.config.ts

[ -f "drizzle/0000_init.sql" ] && echo "FOUND: drizzle/0000_init.sql"
# ✓ FOUND: drizzle/0000_init.sql
```

**Commits exist verification:**
```bash
git log --oneline --all | grep -q "b244643" && echo "FOUND: b244643"
# ✓ FOUND: b244643 (Task 1: schema)

git log --oneline --all | grep -q "cd9359c" && echo "FOUND: cd9359c"
# ✓ FOUND: cd9359c (Task 2: connection)

git log --oneline --all | grep -q "121e852" && echo "FOUND: 121e852"
# ✓ FOUND: 121e852 (Task 3: migrations)
```

All files created exist on disk. All commits exist in git history. Plan execution verified successful.
