#!/bin/sh

echo "Waiting for the database"
until nc -z db 5432; do
  sleep 1
done
echo "Database is ready"

echo "Running migrations..."
bun run migrate:docker 
if [ $? -ne 0 ]; then
  echo "Migration failed" 
  exit 1
fi 
echo "Migrations completed successfully" 

echo "Starting API server..." 
bun run server:dev & 
API_PID=$!
echo "API server PID: $API_PID"

echo "Starting Vite dev server..." 
bun vite --host & 
VITE_PID=$!
echo "Vite dev server PID: $VITE_PID"

trap 'kill $API_PID $VITE_PID' INT TERM

wait $API_PID $VITE_PID
