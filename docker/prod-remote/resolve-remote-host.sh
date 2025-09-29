#!/usr/bin/env sh
set -eu
if [ "${REMOTE_HOST:-}" != "" ]; then
  printf '%s\n' "$REMOTE_HOST"
  exit 0
fi
: "${WEBSITE_DOMAIN:?WEBSITE_DOMAIN is required}"
HOST_USER="${HOST_USER:-root}"
printf '%s\n' "${HOST_USER}@${WEBSITE_DOMAIN}"
