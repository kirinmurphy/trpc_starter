#!/bin/bash
set -e

echo "Starting production server..."

if [[ -n "$DB_HOST" ]]; then
  echo "Waiting for database..."
  timeout=30
  elapsed=0
  until nc -z $DB_HOST 5432 || [ $elapsed -gt $timeout ]; do
    sleep 1
    elapsed=$((elapsed+1))
  done

  if [ $elapsed -gt $timeout ]; then
    echo "Database connection timeout"
    exit 1
  fi
  echo "Database is ready!"
fi

echo "Building application..."
bun run build

echo "Running database migrations..."
bun run migrate 

echo "Starting application..."
exec bun run start
