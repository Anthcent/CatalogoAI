# Archivo Vivo

Private intelligent catalog and modular knowledge canvas for Expert Academy, Expert Design and Expert Code.

## Quick Start

Requirements: Node.js 22+, PostgreSQL 17 with `pgvector`, and npm.

1. Copy `.env.example` to `.env` and replace `AUTH_SECRET` and the seed password.
2. Start PostgreSQL with `docker compose up -d postgres`, or provide your own `DATABASE_URL`.
3. Run `npm install`.
4. Run `npm run db:generate`.
5. Run `npm run db:migrate -- --name initial`.
6. Run `npm run db:seed`.
7. Run `npm run dev` and open `http://localhost:3000`.

The administrator email and initial password come from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. The password must contain at least 12 characters and is never printed by the seed command.

## Included

| Area | Capability |
|---|---|
| Access | Password hashing, opaque server-side sessions, protected workspace |
| Catalog | Stable public codes, businesses, types, categories, statuses, tags and filters |
| Canvas | Modular blocks, reordering, duplication, deletion and debounced autosave |
| Recovery | Immutable snapshots, visual history and non-destructive restore |
| Search | Exact code, title, description and tag ranking with query history |
| Capture | Minimal quick capture and inbox organization flow |
| Templates | Seeded structures and custom builder, copied into independent items |
| Relations | Typed outgoing relations and reverse references between items |
| AI | Server-only Gemini organization endpoint with structured output |
| Files | Validated 10 MB local uploads behind a replaceable storage provider |
| Export | Markdown export with stable item identity |
| Responsive | Desktop-first canvas and mobile catalog/search/capture navigation |

## Configuration

Gemini remains disabled until `GEMINI_API_KEY` is set. The API key is only read in server code. Models are controlled by `GEMINI_MODEL` and `GEMINI_EMBEDDING_MODEL`.

Uploaded files are stored in `uploads/`. Production deployments should mount that path as persistent storage or implement another `StorageProvider`.

## Verification

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Backups

Back up both components. A database-only backup is incomplete.

```bash
pg_dump "$DATABASE_URL" --format=custom --file=catalogo.dump
```

Archive the mounted `uploads/` directory at the same time. Restore PostgreSQL with `pg_restore`, restore files to the same mount, then run `npm run db:generate`.

## Hexper Ops / Dokploy

Deploy the repository root with PostgreSQL enabled. The image executes every pending Prisma migration and the idempotent seed before accepting HTTP traffic.

| Runtime setting | Value |
|---|---|
| Internal port | `8080` |
| Listen address | `0.0.0.0` |
| Healthcheck | `http://127.0.0.1:8080/` |
| Container user | Unprivileged `catalogo` user |
| Persistent path | `/app/uploads` |

Configure these values only in the authorized runtime manager:

- `DATABASE_URL` (automatically injected when using managed PostgreSQL)
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `GEMINI_API_KEY` when AI features are enabled
- `GEMINI_MODEL` and `GEMINI_EMBEDDING_MODEL` when overriding defaults

No public host port is required. Every push to the configured branch can trigger a deployment, so only push commits that passed the quality gates.

## Architecture

The application is a modular monolith. Product domains live under `src/modules`; routes and composition live under `src/app`; Prisma owns the PostgreSQL contract; AI and storage are isolated behind server-side services. This keeps deployment simple without coupling the canvas to infrastructure providers.
