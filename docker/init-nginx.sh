#!/bin/sh

# Generate entries 
echo "${ALLOWED_ORIGINS}" | tr ',' '\n' | sed 's/.*/"&" "$http_origin";/' > /etc/nginx/includes/cors_map.conf

envsubst '$ALLOWED_ORIGINS' < /etc/nginx/templates/cors_options.template > /etc/nginx/includes/cors_options.conf
envsubst '$AUTH_RATE $VERIFY_RATE' < /etc/nginx/templates/rate_limits.template > /etc/nginx/includes/rate_limits.conf 

nginx -g 'daemon off;'
