#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

npx prisma migrate deploy
npx tsx prisma/seed.ts
exec node server.js
