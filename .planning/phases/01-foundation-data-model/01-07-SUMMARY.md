---
phase: 01-foundation-data-model
plan: "07"
subsystem: seed
tags: [meilisearch, seed, async, fix]
dependency_graph:
  requires: []
  provides: [meilisearch-index-persists]
  affects: [search]
tech_stack:
  added: []
  patterns: [waitForTasks, collect-task-uids]
key_files:
  modified:
    - db/seed.ts
decisions:
  - "Collect all task UIDs from syncResourceToMeilisearch calls then await waitForTasks in batch — avoids N serial polls"
metrics:
  duration: "8 min"
  completed: "2026-04-17"
  tasks: 1
  files_modified: 1
---

# Phase 01 Plan 07: Await Meilisearch Task Completion in Seed Summary

**One-liner:** Fixed db/seed.ts to collect Meilisearch task UIDs and call waitForTasks before process.exit, ensuring 18 indexed documents persist across container restarts.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Collect EnqueuedTask UIDs and await completion before exit | 797a4aa | db/seed.ts |

## What Was Built

The seed script previously called `syncResourceToMeilisearch()` in a loop and discarded the returned `EnqueuedTask`. Because `process.exit(0)` fired via `.finally()` before Meilisearch finished processing the async indexing tasks, the documents were never written to disk. After a container restart, the index was empty.

The fix:
1. Added `meilisearchClient` to the import from `../lib/meilisearch`
2. Stored the returned `EnqueuedTask` from each `syncResourceToMeilisearch` call
3. Collected all `taskUid` values into a `taskUids: number[]` array
4. Called `await meilisearchClient.waitForTasks(taskUids)` before the `console.log('Synced resources to Meilisearch')` line

Seed output now includes:
```
Waiting for 18 Meilisearch indexing tasks...
Synced resources to Meilisearch
```

## Verification

- `db/seed.ts` imports `meilisearchClient` and calls `waitForTasks(taskUids)`
- Seed output printed "Waiting for 18 Meilisearch indexing tasks..." before exit
- After `docker compose restart meilisearch`, `check-meilisearch.ts` confirmed `numberOfDocuments: 18`
- `check-meilisearch.ts` exited 0

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- [x] `db/seed.ts` exists and contains `waitForTasks`
- [x] Commit 797a4aa exists
- [x] Meilisearch index has 18 documents after container restart
