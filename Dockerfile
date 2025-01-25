# syntax=docker/dockerfile:1.4
FROM oven/bun:latest as base 
WORKDIR /app

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y \
    unzip \
    curl \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

COPY nginx/includes /etc/nginx/includes
COPY nginx/templates /etc/nginx/templates


# DEVELOPMENT 
FROM base AS development    
COPY package.json bun.lockb ./
RUN --mount=type=cache,target=/root/.bun \
    bun install
COPY . .
CMD ["bun", "run", "dev"]


# PRODUCTION 
FROM base as production 
ENV NODE_OPTIONS="--max-old-space-size=384"
ENV BUN_JS_HEAP_SIZE_MB=384

COPY package.json bun.lockb ./
RUN --mount=type=cache,target=/root/.bun \
    bun install --production --frozen-lockfile && \
    bun add mock-aws-s3 aws-sdk nock && \
    rm -rf ~/.bun/install/cache


COPY . .
RUN chmod +x /app/docker/*.sh

RUN rm -rf node_modules/.cache
RUN NODE_ENV=production bun build src/server/server.ts --outdir=dist/server --target=node --minify
RUN NODE_ENV=production bun run vite build --minify
CMD ["/app/docker/init-prod.sh"]
