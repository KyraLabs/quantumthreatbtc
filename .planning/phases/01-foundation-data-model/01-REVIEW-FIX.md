---
phase: 01-foundation-data-model
fixed_at: 2026-04-17T00:00:00Z
review_path: .planning/phases/01-foundation-data-model/01-REVIEW.md
iteration: 1
findings_in_scope: 6
fixed: 6
skipped: 0
status: all_fixed
---

# Phase 01: Code Review Fix Report

**Fixed at:** 2026-04-17T00:00:00Z
**Source review:** .planning/phases/01-foundation-data-model/01-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 6
- Fixed: 6
- Skipped: 0

## Fixed Issues

### CR-01: Meilisearch master key used in application client

**Files modified:** `lib/meilisearch.ts`, `lib/env.ts`, `.env.example`
**Commit:** a56ab49
**Applied fix:** Replaced `MEILISEARCH_MASTER_KEY` with `MEILISEARCH_API_KEY` in `lib/meilisearch.ts` (both the guard check and the `MeiliSearch` constructor). Removed the `import 'dotenv/config'` that was only appropriate for standalone scripts. Updated `lib/env.ts` to require `MEILISEARCH_API_KEY` as a required field and demote `MEILISEARCH_MASTER_KEY` to optional (kept for admin scripts). Added `MEILISEARCH_API_KEY=your_scoped_api_key_here` to `.env.example`.

### WR-01: `process.exit(0)` in `.finally()` swallows seed errors

**Files modified:** `db/seed.ts`
**Commit:** 478c2ac
**Applied fix:** Replaced the `.catch().finally()` chain with explicit `.then()/.catch()` branches. The `.then()` branch logs "Seed complete" and exits with code 0; the `.catch()` branch logs the error and exits with code 1. The duplicate `console.log('Seed complete')` that existed inside the `seed()` function body was left intact — the new one in `.then()` is the canonical exit-path log. The `.finally(() => process.exit(0))` that masked failures is removed.

### WR-02: Shell `.env` parser vulnerable to injection via `export "$line"`

**Files modified:** `scripts/backup.sh`, `scripts/restore.sh`
**Commit:** a293365
**Applied fix:** Replaced the manual `while read` loop that called `export "$line"` with the safe `set -a` / `source .env` / `set +a` pattern in both scripts. Added a `# shellcheck source=.env` directive for static analysis tooling.

### WR-03: `scripts/get-sample-id.ts` does not close DB connection on error

**Files modified:** `scripts/get-sample-id.ts`
**Commit:** 471744f
**Applied fix:** Wrapped the query and `console.log` in a `try` block and moved `sql.end()` into a `finally` block, guaranteeing the connection is closed regardless of whether the query throws.

### WR-04: `scripts/check-meilisearch.ts` silently swallows errors

**Files modified:** `scripts/check-meilisearch.ts`
**Commit:** ef47cbe
**Applied fix:** Added `process.exit(1)` after `console.error('Error:', error)` in the catch block so that CI pipelines and chained scripts correctly detect Meilisearch check failures.

### WR-05: `updated_at` field is never updated automatically

**Files modified:** `drizzle/0001_updated_at_trigger.sql` (new file), `drizzle/meta/_journal.json`
**Commit:** 1093bdc
**Applied fix:** Created a new Drizzle-compatible raw SQL migration `drizzle/0001_updated_at_trigger.sql` containing a `set_updated_at()` PL/pgSQL function and a `BEFORE UPDATE` trigger on the `resources` table. Registered the migration in `drizzle/meta/_journal.json` as entry `idx: 1`. The migration must be applied to the database by running `npx drizzle-kit migrate` (or the project's equivalent migrate command).

---

_Fixed: 2026-04-17T00:00:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
