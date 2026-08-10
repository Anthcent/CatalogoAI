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
npx tsx prisma/seed.ts
exec node server.js
