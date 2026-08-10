FROM node:24.6.0-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24.6.0-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run db:generate && npm run build

FROM node:24.6.0-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=8080
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 catalogo \
    && useradd --system --uid 1001 --gid catalogo catalogo
COPY --from=dependencies --chown=catalogo:catalogo /app/node_modules ./node_modules
COPY --from=builder --chown=catalogo:catalogo /app/.next/standalone ./
COPY --from=builder --chown=catalogo:catalogo /app/.next/static ./.next/static
COPY --from=builder --chown=catalogo:catalogo /app/public ./public
COPY --from=builder --chown=catalogo:catalogo /app/prisma ./prisma
COPY --from=builder --chown=catalogo:catalogo /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=catalogo:catalogo /app/src/generated ./src/generated
COPY --from=builder --chown=catalogo:catalogo /app/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=builder --chown=catalogo:catalogo /app/package.json ./package.json
RUN mkdir -p /app/uploads && chown catalogo:catalogo /app/uploads && chmod +x /app/docker-entrypoint.sh
USER catalogo
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 CMD curl --fail --silent --show-error http://127.0.0.1:8080/ >/dev/null || exit 1
ENTRYPOINT ["./docker-entrypoint.sh"]
