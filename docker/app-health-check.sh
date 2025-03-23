#!/bin/sh

set -e

if [ $# -eq 0 ]; then 
  echo "No URLs provided" 
  exit 1 
fi 

for url in "$@"; do
  response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  
  if [ "$response" -lt 200 ] || [ "$response" -ge 400 ]; then
    echo "Health check failed for $url: HTTP $response"
    exit 1
  fi

  echo "$url: HTTP $response OK"
done

exit 0