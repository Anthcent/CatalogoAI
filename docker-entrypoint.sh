#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

# This migration failed on early deployments that used a restricted PostgreSQL
# service without pgvector. Resolve only that known failed attempt, then retry
# the now PostgreSQL-compatible migration. Successful databases are unchanged.
npx prisma migrate resolve --rolled-back 20260810000000_initial >/dev/null 2>&1 || true
npx prisma migrate deploy
if [ -n "${SEED_ADMIN_EMAIL:-}" ] && [ -n "${SEED_ADMIN_PASSWORD:-}" ]; then
  npx tsx prisma/seed.ts
else
  echo "Administrator seed variables not set; first-run setup will be available."
fi
exec node server.js
