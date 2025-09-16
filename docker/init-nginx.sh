#!/bin/sh

NODE_ENV=${NODE_ENV:-development}

set -e

echo "Generating Nginx configuration for '${NODE_ENV}' environment..."

if [ "$NODE_ENV" = "production" ]; then
  envsubst '$WEBSITE_DOMAIN' < /etc/nginx/templates/prod/server_header.conf.template > /etc/nginx/includes/server_header.conf
  envsubst '$WEBSITE_DOMAIN' < /etc/nginx/templates/prod/client_location.conf.template > /etc/nginx/includes/client_location.conf
else
  envsubst '$WEBSITE_DOMAIN $VITE_PORT' < /etc/nginx/templates/dev/server_header.conf.template > /etc/nginx/includes/server_header.conf
  envsubst '$VITE_PORT' < /etc/nginx/templates/dev/client_location.conf.template > /etc/nginx/includes/client_location.conf
fi
# // REMOVE THIS LINE AND GET RID OF TEMPLATE, the conf version is fine it has no variables 
cp /etc/nginx/templates/admin_route_maps.template /etc/nginx/includes/admin_route_maps.conf

envsubst '$ALLOWED_ORIGINS' < /etc/nginx/templates/cors_options.template > /etc/nginx/includes/cors_options.conf
envsubst '$AUTH_RATE $VERIFY_RATE' < /etc/nginx/templates/rate_limits.template > /etc/nginx/includes/rate_limits.conf 

echo "${ALLOWED_ORIGINS}" | tr ',' '\n' | sed 's/.*/"&" "&";/' > /etc/nginx/includes/cors_map.conf

exec nginx -c /etc/nginx/nginx.conf -g 'daemon off;'
