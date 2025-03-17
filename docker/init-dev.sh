#!/bin/bash

source ./docker/check-env.sh

timeout=30
elapsed=0

echo "Waiting for the database"
until nc -z db 5432 || [ $elapsed -gt $timeout ]; do
  sleep 1
  elapsed=$((elapsed+1))
done

if [ $elapsed -gt $timeout ]; then
  echo "Database connection timeout"
  exit 1
fi
echo "Database is ready"

echo "Running migrations..."
bun run migrate 
if [ $? -ne 0 ]; then
  echo "Migration failed" 
  exit 1
fi 
echo "Migrations completed successfully" 

echo "Setting up dev super admin..."
bun run ./docker/admin-setup-dev.ts
if [ $? -ne 0 ]; then
  echo "Development setup failed"
  exit 1
fi
echo "Development setup completed"

echo "Starting API server..." 
bun run server:dev & API_PID=$!
echo "API server PID: $API_PID"

echo "Starting Vite dev server..." 
bun vite --host & VITE_PID=$!
echo "Vite dev server PID: $VITE_PID"

trap 'kill $API_PID $VITE_PID' INT TERM

wait $API_PID $VITE_PID
