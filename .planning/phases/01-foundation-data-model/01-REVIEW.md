---
phase: 01-foundation-data-model
reviewed: 2026-04-17T00:00:00Z
depth: standard
files_reviewed: 28
files_reviewed_list:
  - app/globals.css
  - app/layout.tsx
  - app/page.tsx
  - biome.json
  - db/index.ts
  - db/migrate.ts
  - db/schema.ts
  - db/seed.ts
  - docker-compose.yml
  - docs/BACKUP_RESTORE.md
  - drizzle/0000_init.sql
  - drizzle.config.ts
  - drizzle/meta/0000_snapshot.json
  - drizzle/meta/_journal.json
  - .env.example
  - .gitignore
  - lib/env.ts
  - lib/meilisearch.ts
  - next.config.ts
  - package.json
  - postcss.config.mjs
  - scripts/backup.sh
  - scripts/check-meilisearch.ts
  - scripts/get-sample-id.ts
  - scripts/init-meilisearch.ts
  - scripts/restore.sh
  - scripts/verify-tables.ts
  - tailwind.config.ts
  - tsconfig.json
findings:
  critical: 1
  warning: 5
  info: 4
  total: 10
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-04-17T00:00:00Z
**Depth:** standard
**Files Reviewed:** 28
**Status:** issues_found

## Summary

This phase establishes the project foundation: database schema, ORM configuration, Meilisearch integration, environment validation, and supporting scripts. The overall structure is solid — the schema is well-designed, environment validation uses Zod properly, and the backup/restore scripts are thorough.

Three areas require attention before moving forward:

1. **Security:** The Meilisearch client uses the master key directly in `lib/meilisearch.ts` rather than a scoped API key. The master key must never be used in application code — only in admin scripts and service initialization.
2. **Correctness:** `db/seed.ts` calls `process.exit(0)` unconditionally via `.finally()`, which will mask and swallow errors even when the `.catch()` block runs first.
3. **Shell safety:** `scripts/backup.sh` and `scripts/restore.sh` parse `.env` with a raw `export "$line"` pattern that is vulnerable to code injection if the `.env` file contains lines with shell metacharacters.

---

## Critical Issues

### CR-01: Meilisearch master key used in application client

**File:** `lib/meilisearch.ts:8-11`
**Issue:** `meilisearchClient` is initialized with `MEILISEARCH_MASTER_KEY`. The master key grants unrestricted administrative access to Meilisearch — it can delete indexes, change settings, and rotate keys. Exposing it in application-layer code (which runs in a serverless/request context) widens the blast radius of any key leak. Meilisearch is designed for applications to use scoped API keys with limited permissions (search-only, or read/write on specific indexes). The master key should only be used in administrative scripts such as `scripts/init-meilisearch.ts`.

**Fix:** Create a separate `MEILISEARCH_API_KEY` environment variable holding a scoped key generated via the Meilisearch Keys API. Use the master key only in `scripts/init-meilisearch.ts` to create the scoped key, then use the scoped key everywhere else.

```typescript
// lib/meilisearch.ts — use a scoped API key, not the master key
export const meilisearchClient = new MeiliSearch({
  host: process.env.MEILISEARCH_URL,
  apiKey: process.env.MEILISEARCH_API_KEY, // scoped key, not master
});
```

```bash
# .env.example — add the scoped key variable
MEILISEARCH_API_KEY=your_scoped_api_key_here
```

---

## Warnings

### WR-01: `process.exit(0)` in `.finally()` swallows seed errors

**File:** `db/seed.ts:332-337`
**Issue:** The call chain is `seed().catch(handler).finally(() => process.exit(0))`. The `.finally()` callback runs after `.catch()`, meaning `process.exit(0)` executes even when the seed failed and the catch block ran. This produces a zero exit code on failure, which will cause CI pipelines and scripts that check exit codes to silently treat a failed seed as success.

**Fix:** Remove `.finally()` and let each branch exit explicitly.

```typescript
seed()
  .then(() => {
    console.log('Seed complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
```

### WR-02: Shell `.env` parser vulnerable to injection via `export "$line"`

**File:** `scripts/backup.sh:8`, `scripts/restore.sh:8`
**Issue:** The `.env` file is parsed with `export "$line"`. If any value in `.env` contains shell metacharacters (e.g., `DATABASE_URL=foo; rm -rf /`), the `export` builtin will execute it as a shell command. While `.env` is developer-controlled and gitignored, this is a bad pattern that can surprise future contributors or automated tooling that writes to `.env`.

**Fix:** Use `set -a` / `set +a` to source the file safely, or use `export` only on known-safe variable assignments.

```bash
# Safer alternative: source the .env file directly
if [ -z "${DATABASE_URL:-}" ] && [ -f ".env" ]; then
  set -a
  # shellcheck source=.env
  source .env
  set +a
fi
```

### WR-03: `scripts/get-sample-id.ts` does not close the DB connection on error

**File:** `scripts/get-sample-id.ts:3-7`
**Issue:** The script calls `sql.end()` only in the happy path. If the `SELECT` query throws, the process will hang with an open connection rather than exiting cleanly.

**Fix:** Use a try/finally block to guarantee the connection is closed.

```typescript
import { sql } from '../db/index';

(async () => {
  try {
    const result = await sql`SELECT id FROM resources LIMIT 1`;
    console.log(result[0].id);
  } finally {
    await sql.end();
  }
})();
```

### WR-04: `scripts/check-meilisearch.ts` silently swallows errors

**File:** `scripts/check-meilisearch.ts:8-10`
**Issue:** Errors are caught and logged via `console.error`, but the process exits with code 0. Scripts used in CI or chained with `&&` will not detect the failure.

**Fix:** Re-throw or call `process.exit(1)` in the catch block.

```typescript
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
```

### WR-05: `updated_at` field is never updated automatically

**File:** `db/schema.ts:19`
**Issue:** `updated_at` defaults to `now()` at insert time but there is no trigger or ORM hook to update it on subsequent writes. Any `UPDATE` on a resource row will leave `updated_at` stale, which makes it unreliable as an "last modified" signal for cache invalidation or Meilisearch sync.

**Fix:** Add a PostgreSQL trigger to keep `updated_at` current, or document that callers are responsible for setting it on every update. The trigger approach is more reliable.

```sql
-- Add to migration
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resources_set_updated_at
BEFORE UPDATE ON resources
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

## Info

### IN-01: `tailwind.config.ts` is a no-op with Tailwind v4

**File:** `tailwind.config.ts:1-11`
**Issue:** Tailwind CSS v4 uses CSS-first configuration via `@theme` in `globals.css` and does not read `tailwind.config.ts`. The file as written (`content`, `theme`, `plugins`) is ignored by the v4 build pipeline. Keeping it risks confusing developers who try to extend the theme there and see no effect.

**Fix:** Remove `tailwind.config.ts`. Move any future theme extensions to `globals.css` using `@theme { ... }`.

### IN-02: `lib/meilisearch.ts` uses `dotenv/config` import

**File:** `lib/meilisearch.ts:3`
**Issue:** `import 'dotenv/config'` is appropriate for standalone Node scripts but not for library modules imported by Next.js. Next.js has its own `.env` loading mechanism and this import is a no-op (at best) or confusing (at worst) in the App Router context. It implies the module should only be used in Node script contexts, but it is also imported by `db/seed.ts` and potentially future API routes.

**Fix:** Remove `import 'dotenv/config'` from `lib/meilisearch.ts`. Rely on Next.js's built-in env loading for app code, and keep `dotenv/config` only in pure Node scripts (`db/migrate.ts`, `db/seed.ts`, standalone scripts).

### IN-03: `type` and `technical_level` fields use unconstrained `text`

**File:** `db/schema.ts:10, 13`
**Issue:** `type` (Paper, BIP, Article, Research) and `technical_level` (Beginner, Intermediate, Advanced) are stored as free-form `text`. Without a database-level constraint, invalid values can be inserted and will break UI filtering silently.

**Fix:** Use PostgreSQL enums or add check constraints. With Drizzle this is straightforward.

```typescript
import { check } from 'drizzle-orm/pg-core';

// In table definition:
check('valid_type', sql`type IN ('Paper', 'BIP', 'Article', 'Research')`),
check('valid_technical_level', sql`technical_level IN ('Beginner', 'Intermediate', 'Advanced')`),
```

### IN-04: `restore.sh` references a `smoke-test.ts` script that does not exist

**File:** `scripts/restore.sh:64`
**Issue:** The restore script calls `npx tsx scripts/smoke-test.ts` as a post-restore validation step, but no `scripts/smoke-test.ts` file exists in the repository. The restore script will always fail at the validation step, printing a misleading error about the smoke test failing rather than it simply being missing.

**Fix:** Create `scripts/smoke-test.ts` with the 5 checks documented in `docs/BACKUP_RESTORE.md`, or update `restore.sh` to call `scripts/verify-tables.ts` as an interim check until the smoke test is implemented.

---

_Reviewed: 2026-04-17T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
