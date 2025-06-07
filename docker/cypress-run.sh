#!/bin/bash
set -e

if [ -n "$FILE" ]; then
  if [ -f "cypress/e2e/${FILE}.cy.ts" ]; then
    echo "Running test for: $FILE"
    npx cypress run --config-file cypress.config.ts --spec "cypress/e2e/${FILE}.cy.ts"  --browser electron --headless
  else
    echo "Error: Test file 'cypress/e2e/${FILE}.cy.ts' not found"
    exit 1
  fi
else
  echo "Running all tests"
  npx cypress run --config-file cypress.config.ts  --browser electron --headless
fi
