#!/bin/bash
set -e

if [ -z "$TEST_DB_NAME" ]; then 
  echo "Error: TEST_DB_NAME environment variable is not set" 
  exit 1
fi

# Creating test DB in this script
# main DB automatically created in docker compose 
psql -v ON_ERROR_STOP=1 --username "$DB_USER" <<EOSQL
  CREATE DATABASE $TEST_DB_NAME;
EOSQL
echo "Test database created successfully"
