#!/bin/bash
echo "Starting backend server..."
exec bun run --silent dist/server/server.js