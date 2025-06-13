#!/bin/bash
set -e

ACTION=$1
shift

declare -a ALL_COMPOSE_ARGS=("-f docker-compose.cypress.yml")

for OVERRIDE_FILE in $(ls -1 docker-compose.cypress.override.*.yml 2>/dev/null); do
  ALL_COMPOSE_ARGS+=("-f $OVERRIDE_FILE")
done

echo "==== Performing '$ACTION' across all Docker Compose configurations ===="

FULL_DCT_COMMAND="${DCT} ${ALL_COMPOSE_ARGS[*]}"

case "$ACTION" in
  down)
    echo "CMD: $FULL_DCT_COMMAND down $*"
    $FULL_DCT_COMMAND down "$@"
    ;;
  build)
    echo "CMD: $FULL_DCT_COMMAND build $*"
    $FULL_DCT_COMMAND build "$@"
    ;;
  logs)
    echo "CMD: $FULL_DCT_COMMAND logs $*"
    $FULL_DCT_COMMAND logs "$@"
    ;;
  clean)
    echo "CMD: $FULL_DCT_COMMAND down -v --remove-orphans --rmi local $*"
    $FULL_DCT_COMMAND down -v --remove-orphans --rmi local "$@"
    ;;
  *)
    echo "Error: Invalid action specified: '$ACTION'"
    echo "Usage: DCT='docker compose' ./docker/cypress-manage-all.sh [down|build|logs|clean] [additional_docker_compose_args]"
    exit 1
    ;;
esac

echo "==== Action '$ACTION' complete ===="
