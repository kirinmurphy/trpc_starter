#!/bin/bash

required_vars=(
  "DB_NAME"
  "DB_USER"
  "DB_PASSWORD"
  "AUTH_TOKEN_SECRET"
  "REFRESH_TOKEN_SECRET"
  "VITE_EMAIL_ADDRESS_SUPPORT"
)

if [ "$NODE_ENV" = "production" ]; then
  required_vars+=(
    "WEBSITE_DOMAIN"
    "EMAIL_SERVICE_HOST"
    "EMAIL_SERVICE_USER"
    "EMAIL_SERVICE_PASS"
  )
fi

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: $var environment variables is not set"
    exit 1
  fi
done
