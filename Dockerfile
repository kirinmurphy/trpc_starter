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


# DEVELOPMENT 
FROM base AS development    
COPY package.json bun.lockb ./
RUN --mount=type=cache,target=/root/.bun \
    bun install
COPY . .
CMD ["bun", "run", "dev"]


# PRODUCTION 
FROM base AS production
COPY package.json bun.lockb ./
RUN --mount=type=cache,target=/root/.bun \
    bun install --production && \
    bun add mock-aws-s3 aws-sdk nock
COPY . .
CMD ["./docker/init-prod.sh"]
