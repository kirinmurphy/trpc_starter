#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

TEST_MODE_VAR="${TEST_MODE:-default}" 
FILE_VAR="${FILE}"

CYPRESS_CLI_ARGS=(
  "run"
  "--config-file" "cypress.config.ts"
  "--browser" "electron"
  "--headless"
  "--env" "TEST_MODE=$TEST_MODE_VAR"
)

SPEC_TO_ADD=""

echo "==== Starting Cypress, Mode: $TEST_MODE_VAR, Spec: $FILE_VAR"

if [ -n "$FILE_VAR" ]; then
  POTENTIAL_SPEC_PATH="cypress/e2e/${FILE_VAR}.cy.ts"
  if [ -f "$POTENTIAL_SPEC_PATH" ]; then
    SPEC_TO_ADD="$POTENTIAL_SPEC_PATH"
    echo "Running specific spec from FILE_VAR (user override): $SPEC_TO_ADD" 
  else 
    echo "Error: Test file specified by FILE_VAR ('cypress/e2e/${FILE_VAR}.cy.ts)') not found."
    exit 1;
  fi
else 
  SPEC_TO_ADD="cypress/e2e/${TEST_MODE_VAR}/**/*.cy.ts"
fi

if [ -n "$SPEC_TO_ADD" ]; then 
  echo "Cypress spec(s): $SPEC_TO_ADD"
  CYPRESS_CLI_ARGS+=( "--spec" "$SPEC_TO_ADD" )
fi

exec npx cypress "${CYPRESS_CLI_ARGS[@]}"
