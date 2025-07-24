#!/bin/bash
set -e

echo "==== Starting Dynamic Cypress Test Orchestration ===="

declare -a TEST_SUITE_COLLECTION

TEST_SUITE_COLLECTION+=("base:")

# ==== GET ALL TEST SUITES ====
for ENV_OVERRIDE_FILE in $(ls -1 docker-compose.cypress.override.*.yml 2>/dev/null); do
  MODE_NAME=$(basename "$ENV_OVERRIDE_FILE" .yml | sed 's/^docker-compose\.cypress\.override\.//');
  TEST_SUITE_COLLECTION+=("$MODE_NAME:-f $ENV_OVERRIDE_FILE")
done

# set selected tests to all the test suites by default
declare -a SELECTED_TEST_COLLECTION=("${TEST_SUITE_COLLECTION[@]}")

# ==== FILTER TEST SUITES ON OPTONAL FILE OR TEST_MODE ARGS =====
# provide filters to set SELECTED_TEST_COLLECTION to filtered set 
# FILE='directory/test_spec' will set SELECTED_TEST_COLLECTION to "directory"
# TEST_MODE will set SELECTED_TEST_COLLECTION to TEST_MODE 
FILTER_BY_MODE=""
FILTER_SOURCE=""

if [[ -n "$FILE" ]]; then 
  if [[ -n "$TEST_MODE" ]]; then
    echo "Warning: TEST_MODE not used when FILE is provided."
  fi
  FILTER_BY_MODE="${FILE%%/*}"
  FILTER_SOURCE="FILE"
elif [[ -n "$TEST_MODE" ]]; then 
  FILTER_BY_MODE="$TEST_MODE"
  FILTER_SOURCE="TEST_MODE"
fi

if [[ -n "$FILTER_BY_MODE" ]]; then 
  FOUND_MATCH="false"
  MATCHING_SUITE_CONFIG=""

  for SUITE_CONFIG_ENTRY in "${TEST_SUITE_COLLECTION[@]}"; do
    IFS=':' read -r CURRENT_MODE_NAME_CHECK _ <<< "$SUITE_CONFIG_ENTRY"

    if [[ "$CURRENT_MODE_NAME_CHECK" == "$FILTER_BY_MODE" ]]; then
      MATCHING_SUITE_CONFIG="$SUITE_CONFIG_ENTRY"
      FOUND_MATCH="true"
      break
    fi
  done

  if [[ "$FOUND_MATCH" == "true" ]]; then 
    echo "Info: Specific test file '$FILE' provided.  Narrowing execution to mode '$PARENT_DIRECTORY_OVERRIDE'."
    SELECTED_TEST_COLLECTION=("$MATCHING_SUITE_CONFIG") 
  else 
    echo "Warning: Specific filter ('$FILTER_BY_MODE' from $FILTER_SOURCE) provided, but no matching test mode found in the test suites."
    exit 1;
  fi
fi

# ==== RUN container for each filtered test suite ====
for SUITE_CONFIG in "${SELECTED_TEST_COLLECTION[@]}"; do 
  IFS=':' read -r CURRENT_MODE_NAME COMPOSE_FILE_ARG <<< "$SUITE_CONFIG"

  COMPOSE_TEST_CONFIG="$DCT $COMPOSE_FILE_ARG";
  CYPRESS_SERVICES_UP='up -d mailhog app db nginx'
  echo "CMD: $COMPOSE_TEST_CONFIG $CYPRESS_SERVICES_UP"
  $COMPOSE_TEST_CONFIG $CYPRESS_SERVICES_UP

  RUN_TEST_CMD="$COMPOSE_TEST_CONFIG run --rm -e FILE=\"$FILE\" -e TEST_MODE=\"$CURRENT_MODE_NAME\" cypress | grep -v \"nginx.*\|.*nginx\""
  echo "CMD: $RUN_TEST_CMD"
  eval "$RUN_TEST_CMD";

  $COMPOSE_TEST_CONFIG $down -v
done
