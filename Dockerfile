# syntax=docker/dockerfile:1.4
FROM oven/bun:1 AS base
WORKDIR /app
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y \
    unzip \
    curl \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*
COPY package.json bun.lockb ./


# DEVELOPMENT 
FROM base AS development    
RUN --mount=type=cache,target=/root/.bun \
    bun install
COPY . .
CMD ["bun", "run", "dev"]


# PRODUCTION - API BUILD STAGE
FROM base AS api_production 
RUN --mount=type=cache,target=/root/.bun \
    bun install --production --frozen-lockfile && \
    bun add mock-aws-s3 aws-sdk nock && \
    rm -rf ~/.bun/install/cache
COPY . .
RUN chmod +x /app/docker/*.sh

RUN NODE_ENV=production bun build src/server/server.ts --outdir=dist/server --target=node --minify
RUN NODE_ENV=production bun run ./docker/setup-production-build-helpers.ts 


# PRODUCTION - CLIENT BUILD STAGE
FROM base AS client_build
RUN --mount=type=cache,target=/root/.bun bun install 
COPY . . 
ARG VITE_API_URL 
ENV VITE_API_URL=$VITE_API_URL
RUN NODE_ENV=production bun run vite build --minify

# NGINX BASE STAGE
FROM nginx:1.27-alpine AS nginx_base
COPY nginx/includes /etc/nginx/includes
COPY nginx/templates /etc/nginx/templates

# PRODUCTION - FINAL NGINX IMAGE 
FROM nginx_base AS production_nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=client_build /app/dist /usr/share/nginx/html
COPY docker/init-nginx.sh /docker/init-nginx.sh
RUN chmod +x /docker/init-nginx.sh
CMD ["/docker/init-nginx.sh"]


# PRODUCTION - MIGRATION STAGE
FROM api_production AS app_initialization_stage
RUN apt-get update && apt-get install -y postgresql-client
WORKDIR /app
COPY --from=api_production /app/dist/docker /app/dist/docker
COPY --from=api_production /app/docker/init-prod.sh /app/docker/init-prod.sh
CMD ["/app/docker/init-prod.sh"]


# PRODUCTION - FINAL API IMAGE
FROM base AS final_production 
COPY --from=api_production /app/dist/server /app/dist/server
COPY --from=api_production /app/dist/docker /app/dist/docker
COPY --from=api_production /app/docker /app/docker
COPY --from=api_production /app/package.json /app/package.json
COPY --from=api_production /app/bun.lockb /app/bun.lockb
COPY --from=api_production /app/node_modules /app/node_modules

WORKDIR /app
EXPOSE 3000
RUN chmod +x /app/docker/prod-entrypoint.sh
ENTRYPOINT ["/bin/bash", "/app/docker/prod-entrypoint.sh"]
