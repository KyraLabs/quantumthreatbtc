---
phase: 01-foundation-data-model
plan: "06"
subsystem: tooling
tags: [biome, lint, dx, gap-closure]
dependency_graph:
  requires: []
  provides: [clean-lint-baseline]
  affects: [biome.json, db/index.ts, db/migrate.ts, drizzle.config.ts, lib/meilisearch.ts, scripts/verify-tables.ts]
tech_stack:
  added: []
  patterns: [env-guard-throw, biome-includes-exclude]
key_files:
  created: []
  modified:
    - biome.json
    - db/index.ts
    - db/migrate.ts
    - drizzle.config.ts
    - lib/meilisearch.ts
    - scripts/verify-tables.ts
    - db/schema.ts
    - db/seed.ts
    - scripts/check-meilisearch.ts
    - scripts/get-sample-id.ts
decisions:
  - "Use files.includes with !drizzle/meta exclusion pattern (Biome 2.2+ syntax, replaces legacy ignore key)"
  - "Manually remove unused Resource import from lib/meilisearch.ts (Biome marks removal as unsafe fix)"
metrics:
  duration: "~8 min"
  completed: "2026-04-17"
  tasks_completed: 3
  tasks_total: 3
  files_modified: 10
---

# Phase 01 Plan 06: Biome Lint Cleanup Summary

**One-liner:** Eliminated all 10 Biome errors and 4 warnings from UAT test 4 by excluding drizzle/meta from checks, applying guard throws for DATABASE_URL, and fixing forEach callback syntax.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add drizzle/meta to Biome ignore and run auto-fix | c8f227c | biome.json, db/schema.ts, db/seed.ts, lib/meilisearch.ts, scripts/check-meilisearch.ts, scripts/get-sample-id.ts, scripts/verify-tables.ts |
| 2 | Replace non-null assertions with guard throws | e4fa986 | db/index.ts, db/migrate.ts, drizzle.config.ts |
| 3 | Fix forEach implicit return and remove unused import | 343a655 | scripts/verify-tables.ts, lib/meilisearch.ts |

## Verification

```
npm run lint   -> Checked 22 files. No fixes applied. (exit 0)
npm run format -> Formatted 22 files. No fixes applied. (exit 0)
```

Zero errors. Zero warnings.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Biome 2.4 uses `includes` instead of `ignore` in files config**
- **Found during:** Task 1
- **Issue:** Plan specified `"files.ignore": ["drizzle/meta/**"]` but Biome 2.4.12 removed the `ignore` key; valid keys are `maxSize`, `ignoreUnknown`, `includes`, `experimentalScannerIgnores`
- **Fix:** Used `"files.includes": ["**", "!drizzle/meta"]` — Biome then auto-fixed the trailing `/**` to just `!drizzle/meta` (Biome 2.2+ syntax)
- **Files modified:** biome.json
- **Commit:** c8f227c

**2. [Rule 1 - Bug] Unused Resource import required manual removal**
- **Found during:** Task 3
- **Issue:** `biome check --write` skipped the `import type { Resource }` removal because Biome classified it as an "unsafe fix" (requires `--unsafe` flag); plan expected auto-fix to handle it
- **Fix:** Manually removed the unused import line from lib/meilisearch.ts
- **Files modified:** lib/meilisearch.ts
- **Commit:** 343a655

## Known Stubs

None — this plan is tooling/DX only, no data or UI stubs introduced.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced.

## Self-Check: PASSED

- biome.json: FOUND (contains files.includes with !drizzle/meta)
- db/index.ts: FOUND (guard throw pattern)
- db/migrate.ts: FOUND (guard throw pattern)
- drizzle.config.ts: FOUND (guard throw pattern)
- scripts/verify-tables.ts: FOUND (forEach with block braces)
- Commits: c8f227c, e4fa986, 343a655 — all present in git log
