#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ] && [ -f ".env" ]; then
  DATABASE_URL="$(awk -F= '/^[[:space:]]*(export[[:space:]]+)?DATABASE_URL=/{val=substr($0,index($0,"=")+1); gsub(/\r/,"",val); gsub(/^[[:space:]"'"'"']+|[[:space:]"'"'"']+$/,"",val); print val; exit}' .env)"
  [ -n "$DATABASE_URL" ] && export DATABASE_URL
fi

# Manual backup script for QuantumThreat BTC database
# Uses pg_dump with custom format for flexibility

# Check DATABASE_URL is set
if [ -z "${DATABASE_URL:-}" ]; then
  echo "Error: DATABASE_URL environment variable not set"
  echo "Load it from .env or export manually"
  exit 1
fi

# Create backups directory
mkdir -p backups

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/quantumthreatbtc_${TIMESTAMP}.dump"

echo "Starting backup..."
echo "Target: $BACKUP_FILE"

# Run pg_dump
pg_dump "$DATABASE_URL" \
  --format=custom \
  --compress=9 \
  --file="$BACKUP_FILE" \
  --verbose

# Get file size
FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo "✓ Backup complete"
echo "File: $BACKUP_FILE"
echo "Size: $FILE_SIZE"
echo ""
echo "To restore:"
echo "  ./scripts/restore.sh $BACKUP_FILE"
