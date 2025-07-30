SHELL := /bin/bash

DC_BASE=docker compose -f docker-compose.base.yml 
PRUNE=docker system prune -f && docker volume prune -f

include Makefile.dev

include Makefile.cypress

include Makefile.production

## -- UTILITIES ------- ## 
.PHONY: clean-all
clean-all:
	$(DCD) down -v
	$(DCT) down -v
	$(DC_PROD_LOCAL) down -v
	docker system prune -f
	docker volume prune -f

.PHONY: help
help:
	@echo "Application commands:"
	@echo "  make dev-up                - Start the application"
	@echo "  make dev-build              - Clean and build application container"
	@echo "  make dev-build-no-cache     - Clear cache and build dev container"
	@echo "  make dev-logs               - View dev application logs"
	@echo "  make dev-all                - Run app build, start, and logs in sequence"
	@echo "  make dev-clean              - Clean dev containers and volumes"
	@echo "  make reload-nginx           - Update nginx config (w/o restarting)"

	@echo ""
	@echo "CI / Testing commands:"
	@echo "  make tests-up              - Run cypress tests"
	@echo "  make tests-build            - Clean and build cypress container"
	@echo "  make tests-build-no-cache   - Clear cache and build cypress container"
	@echo "  make tests-logs             - View cypress logs"
	@echo "  make tests-all              - Run tests build, start, and logs in sequence"
	@echo "  make tests-clean            - Clean tests containers and volumes"

	@echo ""
	@echo "Production commands (locally):"
	@echo "  make prod-local-up               - Start the application in production"
	@echo "  make prod-local-build             - Clean and build production container"
	@echo "  make prod-local-build-no-cache    - Clear cache and build production container"
	@echo "  make prod-local-logs              - View production logs"
	@echo "  make prod-local-all               - Run prod build, start, and logs in sequence"
	@echo "  make prod-local-clean             - Clean prod containers and volumes"

	@echo ""
	@echo "Production commands (remote):"
	@echo "  make prod-remote-up               - Start the application in production"
	@echo "  make prod-remote-build             - Clean and build production container"
	@echo "  make prod-remote-build-no-cache    - Clear cache and build production container"
	@echo "  make prod-remote-logs              - View production logs"
	@echo "  make prod-remote-all               - Run prod build, start, and logs in sequence"
	@echo "  make prod-remote-clean             - Clean prod containers and volumes"

	@echo "  make clean-all             - Clean all containers, systems and volumes"
