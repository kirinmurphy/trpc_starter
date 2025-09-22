#!/bin/bash
set -e

source ./docker/check-env.sh

echo "Starting production server..."

echo "Verifying Email configuration..."
bun run ./dist/docker/verify-email.js
if [ $? -ne 0 ]; then 
  echo "Email verification failed"
  exit 1
fi


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

echo "Running database migrations..."
bun run migrate 

echo "Setting up prod super admin..." 
bun run ./dist/docker/admin-setup/admin-setup-production.js
if [ $? -ne 0 ]; then
  echo "❌ Super admin setup failed"
  exit 1
fi 

echo "Initialization complete!"
