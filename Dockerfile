# syntax=docker/dockerfile:1.4
FROM oven/bun:latest

WORKDIR /app

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y \
    unzip \
    curl \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lockb ./

RUN --mount=type=cache,target=/root/.bun \
    bun install

COPY . .

RUN bun run build

CMD ["bun", "run", "server"]
