FROM node:24.6.0-bookworm-slim AS dependencies
WORKDIR /app/expert_hub_v2
COPY expert_hub_v2/package.json expert_hub_v2/package-lock.json ./
RUN npm ci

FROM node:24.6.0-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /app/expert_hub_v2/node_modules ./expert_hub_v2/node_modules
COPY expert_hub_v2 ./expert_hub_v2
COPY expert_catalog_mockup/assets/graphics ./expert_catalog_mockup/assets/graphics
WORKDIR /app/expert_hub_v2
RUN npm run db:generate
RUN npm run build

FROM node:24.6.0-bookworm-slim AS runner
WORKDIR /app/expert_hub_v2
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=8080
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 experthub \
    && useradd --system --uid 1001 --gid experthub experthub \
    && mkdir -p /app/expert_hub_v2/uploads \
    && chown -R experthub:experthub /app/expert_hub_v2/uploads
COPY --from=builder --chown=experthub:experthub /app/expert_hub_v2/.next/standalone /app
COPY --from=builder --chown=experthub:experthub /app/expert_hub_v2/.next/static ./.next/static
COPY --from=builder --chown=experthub:experthub /app/expert_catalog_mockup /app/expert_catalog_mockup
USER experthub
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD curl --fail --silent --show-error http://127.0.0.1:8080/ >/dev/null || exit 1
CMD ["node", "server.js"]
