# Backup and Restore Procedures

Last updated: 2026-04-16
Database: Neon Postgres 18.3
Environment: Production + Staging

## Overview

QuantumThreat BTC uses a dual-strategy backup approach:

1. **Primary: Neon PITR (Point-in-Time Recovery)** — Automated continuous backup with 7-30 day retention
2. **Secondary: Manual pg_dump** — On-demand snapshots for long-term archival or pre-deployment safety

Both procedures are tested and validated with smoke tests.

## Strategy 1: Neon PITR (Primary)

### What is PITR?

Neon provides automatic continuous backups using Write-Ahead Log (WAL) archiving. You can restore to any point in time within the retention window (7-30 days depending on plan tier).

**Retention periods by plan:**
- Free tier: 7 days
- Launch ($19/mo): 7 days
- Scale ($69/mo): 14 days
- Business ($700/mo): 30 days

### When to use PITR

- Database corruption or data loss within last 7-30 days
- Rollback after failed migration or deployment
- Recovery from accidental DELETE/UPDATE

### How to restore via PITR

**Step 1: Access Neon Console**

1. Go to https://console.neon.tech
2. Navigate to project "quantumthreatbtc"
3. Click "Restore" tab (or "Backups" depending on UI version)

**Step 2: Select restore point**

1. Choose restore method:
   - "Latest" (most recent state)
   - "Timestamp" (specific date/time in UTC)
2. If using timestamp, enter exact time (format: YYYY-MM-DD HH:MM:SS UTC)
3. Preview: Neon shows LSN (Log Sequence Number) for verification

**Step 3: Create restore branch**

⚠️ IMPORTANT: Neon restores to a NEW branch, not the original database. This is non-destructive.

1. Enter branch name (e.g., "restore-2026-04-15")
2. Click "Restore"
3. Wait for branch creation (~30-60 seconds)

**Step 4: Get new DATABASE_URL**

1. In restored branch, go to "Connection Details"
2. Copy new connection string
3. Test connection: `psql "NEW_DATABASE_URL" -c "SELECT version();"`

**Step 5: Run smoke test**

```bash
# Temporarily use restored database
export DATABASE_URL="NEW_DATABASE_URL_FROM_STEP_4"
npx tsx scripts/smoke-test.ts
```

Expected: All checks pass (✓ Database connection, ✓ Resources table, etc.)

**Step 6: Switch production traffic (if restore is good)**

If smoke test passes and data looks correct:

1. Update production .env with new DATABASE_URL
2. Redeploy application
3. Delete old broken branch after confirming production works

If restore is not what you expected:
- Delete restore branch
- Try different timestamp
- Repeat from Step 2

### PITR Limitations

- Cannot restore beyond retention window (7-30 days)
- Restore creates new branch (requires connection string update)
- No cross-region restore (restore happens in same region as original)

---

## Strategy 2: Manual pg_dump (Secondary)

### When to use manual backups

- Pre-deployment snapshots (before risky migrations)
- Long-term archival beyond PITR retention
- Offsite backups (save to S3, local disk, etc.) — not implemented in v1 per D-09
- Testing restore procedures in staging

### Backup procedure

**Automated script:** Use `scripts/backup.sh`

```bash
# Creates timestamped backup in backups/ directory
./scripts/backup.sh
```

**Manual command:**

```bash
# Create backups directory
mkdir -p backups

# Generate backup with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump "$DATABASE_URL" \
  --format=custom \
  --compress=9 \
  --file="backups/quantumthreatbtc_${TIMESTAMP}.dump"

echo "Backup saved: backups/quantumthreatbtc_${TIMESTAMP}.dump"
```

**Backup format:** Custom format (`--format=custom`) for flexibility. Supports:
- Parallel restore
- Selective table restore
- Compressed (~70% smaller than SQL format)

### Restore procedure

**Automated script:** Use `scripts/restore.sh`

```bash
# Restore from most recent backup
./scripts/restore.sh backups/quantumthreatbtc_YYYYMMDD_HHMMSS.dump
```

⚠️ WARNING: This OVERWRITES the target database. Always restore to staging/local first!

**Manual command:**

```bash
# Restore to staging database (DO NOT use production DATABASE_URL)
pg_restore \
  --dbname="$STAGING_DATABASE_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --verbose \
  backups/quantumthreatbtc_YYYYMMDD_HHMMSS.dump

# Run smoke test
export DATABASE_URL="$STAGING_DATABASE_URL"
npx tsx scripts/smoke-test.ts
```

**Flags explained:**
- `--clean`: Drop existing objects before restoring
- `--if-exists`: Don't error if objects don't exist
- `--no-owner`: Don't restore ownership (use current user)
- `--no-privileges`: Don't restore permissions (use defaults)

### Smoke test validation

After ANY restore (PITR or pg_dump), ALWAYS run the smoke test:

```bash
npx tsx scripts/smoke-test.ts
```

**What the smoke test checks:**

1. ✓ Database connection successful
2. ✓ Resources table accessible with data
3. ✓ Tags table accessible
4. ✓ Sample resource exists (known UUID)
5. ✓ Indexes present (including GIN indexes)

**Pass criteria:** All 5 checks pass, exit code 0

**Fail criteria:** Any check fails, exit code 1 — investigate before using restored database

---

## Testing Schedule

Per D-08, backup restore procedures should be tested regularly:

**Recommended schedule:**
- Monthly: Restore latest Neon PITR backup to staging, run smoke test
- Quarterly: Create manual pg_dump backup, restore to local, run smoke test
- Before major deployments: Create pre-deployment snapshot

**Test restore procedure (monthly):**

```bash
# 1. Restore via Neon PITR to new branch
# 2. Get new DATABASE_URL
# 3. Test locally
export DATABASE_URL="RESTORED_BRANCH_URL"
npx tsx scripts/smoke-test.ts

# 4. Document results
echo "$(date): PITR restore successful" >> docs/restore_test_log.txt

# 5. Delete test branch
```

---

## Disaster Recovery Checklist

If production database is lost or corrupted:

- [ ] **Step 1:** Stop all traffic to application (prevent further data loss)
- [ ] **Step 2:** Identify last known good timestamp
- [ ] **Step 3:** Restore via Neon PITR to that timestamp (creates new branch)
- [ ] **Step 4:** Run smoke test on restored branch
- [ ] **Step 5:** If smoke test passes, update production DATABASE_URL
- [ ] **Step 6:** Redeploy application with new connection string
- [ ] **Step 7:** Monitor for 24 hours, verify data integrity
- [ ] **Step 8:** Delete broken original branch after confirmation
- [ ] **Step 9:** Document incident (what happened, recovery time, lessons learned)

**Recovery Time Objective (RTO):** ~15-30 minutes (time to restore + smoke test + redeploy)
**Recovery Point Objective (RPO):** ~5 minutes (Neon WAL archiving interval)

---

## Backup Storage

**Neon PITR backups:**
- Stored by Neon in S3-compatible object storage
- Encrypted at rest
- Geographically redundant within region
- No user action required

**Manual pg_dump backups (v1):**
- Stored in `backups/` directory (gitignored)
- Developer responsibility to archive offsite if needed
- No automated S3/Backblaze uploads per D-09 (deferred to v2)

---

## Troubleshooting

**Problem: PITR restore fails with "retention window exceeded"**
- Cause: Trying to restore beyond 7-30 day retention
- Solution: Use manual pg_dump backups if available, or accept data loss

**Problem: pg_restore fails with "relation already exists"**
- Cause: Target database not cleaned before restore
- Solution: Add `--clean --if-exists` flags to pg_restore

**Problem: Smoke test fails after restore**
- Cause: Backup is incomplete or corrupted
- Solution: Try different backup/timestamp, investigate which check failed

**Problem: Connection timeout during restore**
- Cause: Large database, slow network
- Solution: Increase connect_timeout, use pg_restore --jobs=4 for parallel restore

---

## References

- Neon PITR docs: https://neon.tech/docs/manage/backups
- PostgreSQL pg_dump: https://www.postgresql.org/docs/18/app-pgdump.html
- PostgreSQL pg_restore: https://www.postgresql.org/docs/18/app-pgrestore.html
