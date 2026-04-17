#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ] && [ -f ".env" ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line// }" ]] && continue
    export "$line"
  done < .env
fi

# Manual restore script for QuantumThreat BTC database
# ⚠️ WARNING: This OVERWRITES the target database!
# Always restore to staging/local first, never production directly

BACKUP_FILE="${1:-}"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./scripts/restore.sh <backup_file>"
  echo "Example: ./scripts/restore.sh backups/quantumthreatbtc_20260415_120000.dump"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

# Check DATABASE_URL is set
if [ -z "${DATABASE_URL:-}" ]; then
  echo "Error: DATABASE_URL environment variable not set"
  echo "Load it from .env or export manually"
  exit 1
fi

# Safety check: Confirm this is not production
echo "⚠️  WARNING: This will OVERWRITE the database at:"
echo "   $DATABASE_URL"
echo ""
read -p "Are you sure you want to restore? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Restore cancelled"
  exit 0
fi

echo "Starting restore from: $BACKUP_FILE"

# Run pg_restore
pg_restore \
  --dbname="$DATABASE_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --verbose \
  "$BACKUP_FILE"

echo "✓ Restore complete"
echo ""
echo "Running smoke test to validate restore..."

# Run smoke test
if npx tsx scripts/smoke-test.ts; then
  echo ""
  echo "✅ Restore validated successfully"
else
  echo ""
  echo "❌ Smoke test failed — restore may be incomplete"
  exit 1
fi
