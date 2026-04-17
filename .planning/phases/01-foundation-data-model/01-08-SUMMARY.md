---
phase: 01-foundation-data-model
plan: "08"
subsystem: scripts
tags: [backup, restore, dotenv, shell]
dependency_graph:
  requires: []
  provides: [backup-env-autoload, restore-env-autoload]
  affects: [ops]
tech_stack:
  added: []
  patterns: [while-read-export, env-autoload]
key_files:
  modified:
    - scripts/backup.sh
    - scripts/restore.sh
decisions:
  - "Used while-read-export loop instead of source .env because DATABASE_URL contains & characters that bash interprets as background operator when sourced"
metrics:
  duration: "8 min"
  completed: "2026-04-17"
  tasks: 1
  files_modified: 2
---

# Phase 01 Plan 08: Auto-load .env in backup/restore scripts Summary

**One-liner:** Fixed backup.sh and restore.sh to auto-load .env via a while-read-export loop, handling DATABASE_URL values with special characters (&) that `source .env` silently breaks.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add .env auto-load to backup.sh and restore.sh | 079c2eb | scripts/backup.sh, scripts/restore.sh |

## What Was Built

Both scripts previously required manual `export DATABASE_URL=...` before execution. The fix adds automatic .env loading at the top of each script.

**Bug discovered and fixed:** The plan specified `set -a; source .env; set +a`, but DATABASE_URL in .env contains `&` characters in PostgreSQL query parameters (e.g., `?sslmode=require&channel_binding=require`). Bash interprets unquoted `&` as a background operator when sourcing, silently discarding DATABASE_URL.

The fix uses a `while read` loop with `export "$line"` for each non-comment, non-empty line — this handles values with special characters without shell interpretation.

## Verification

- `unset DATABASE_URL && ./scripts/backup.sh` produced `backups/quantumthreatbtc_20260417_025127.dump`
- `pg_restore --list` printed non-empty dump content
- Without .env and without DATABASE_URL, the script fails with correct error message

## Deviations from Plan

The `source .env` approach was replaced with a `while read` loop due to special characters in DATABASE_URL. This is a bug fix within the task, not a scope deviation.

## Self-Check: PASSED

- scripts/backup.sh and scripts/restore.sh both auto-load .env
- Commit 079c2eb exists
- backup.sh produces a .dump file without manual env export
