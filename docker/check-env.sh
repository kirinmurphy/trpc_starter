#!/bin/bash

required_vars=(
  "DB_NAME"
  "DB_USER"
  "DB_PASSWORD"
  "AUTH_TOKEN_SECRET"
  "REFRESH_TOKEN_SECRET"
)

if [ "$NODE_ENV" = "production" ]; then
  required_vars+=(
    "WEBSITE_DOMAIN"
    "EMAIL_SERVICE_PASS"
  )

  if [ -z "$CUSTOM_EMAIL_PROVIDER" ]; then 
    required_vars+=(
      "EMAIL_SERVICE_HOST"
      "EMAIL_SERVICE_USER"
    )
  fi 
fi

missing_vars=()
for var_name in "${required_vars[@]}"; do
  if [ -z "${!var_name}" ]; then
    missing_vars+=("$var_name")
  fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
  echo "Error: The following required environment variables are not set:" >&2
  for var in "${missing_vars[@]}"; do
    echo "  - $var" >&2
  done
  echo "Please seet them in your .env file or as Docker environment variables." >&2
  exit 1
fi

echo "All required environment variables are set. Proceeding with application startup."
