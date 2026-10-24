#!/bin/bash
set -e

# Creating test DB in this script
# main DB automatically created in docker compose 
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -v test_db="$TEST_DB_NAME" <<'EOSQL'
  CREATE DATABASE :"test_db";
EOSQL
echo "Test database created successfully"
