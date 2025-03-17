#!/bin/bash
set -e

source ./docker/check-env.sh

echo "Starting production server..."
echo "Waiting for database..."

timeout=30
elapsed=0
until nc -z db 5432 || [ $elapsed -gt $timeout ]; do
  sleep 1
  elapsed=$((elapsed+1))
done

if [ $elapsed -gt $timeout ]; then
  echo "Database connection timeout"
  exit 1
fi

echo "Database is ready!"

echo "Setting up super admin..." 
bun run ./docker/admin-setup-prod.ts
if [ $? -ne 0 ]; then
  echo "Super admin setup failed"
  exit 1
fi 
echo "Super admin setup email sent" 

echo "Building application..."
bun run build

echo "Running database migrations..."
bun run migrate 

echo "Starting application..."
exec bun run start
