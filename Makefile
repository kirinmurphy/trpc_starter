SHELL := /bin/bash

DC_BASE=docker compose -f docker-compose.base.yml 
DC=${DC_BASE} -f docker-compose.dev.yml 
DCT=${DC} -f docker-compose.cypress.yml
DCP=${DC_BASE} -f docker-compose.production.yml
PRUNE=docker system prune -f && docker volume prune -f

## -- DEV ------- ## 
.PHONY: dev-up
dev-up:
	$(DC) up -d

.PHONY: dev-down
dev-down: 
	$(DC) down -v

.PHONY: dev-build
dev-build: 
	$(DC) build app

.PHONY: dev-build-no-cache
dev-build-no-cache: dev-clean
	$(DC) build app --no-cache

.PHONY: dev-logs
dev-logs:
	$(DC) logs app --follow app

.PHONY: dev-all
dev-all: dev-build dev-up dev-logs

.PHONY: dev-clean
dev-clean: 
	$(DC) down -v --remove-orphans --rmi local

.PHONY: reload-nginx
reload-nginx:
	$(DC) restart nginx


## -- TESTING ------- ## 
.PHONY: tests-up
tests-up:
	$(DCT) up -d mailhog app db nginx && \
	$(DCT) run -e FILE=$(FILE) cypress | grep -v "nginx.*\|.*nginx" || exit 1;

.PHONY: tests-down
tests-down:
	$(DCT) down -v

.PHONY: tests-build
tests-build: 
	$(DCT) build cypress

.PHONY: tests-build-no-cache
tests-build-no-cache: tests-clean
	$(DCT) build cypress --no-cache

.PHONY: tests-logs
tests-logs:
	$(DCT) logs app cypress --follow

.PHONY: tests-all
tests-all: tests-build tests-up tests-logs

.PHONY: tests-clean
tests-clean: 
	$(DCT) down -v --remove-orphans --rmi local


## -- PRODUCTION ------- ##
.PHONY: prod-up
prod-up:
	$(DCP) up -d

.PHONY: prod-down
prod-down:
	$(DCP) down -v

.PHONY: prod-build
prod-build: 
	$(DCP) build app

.PHONY: prod-build-no-cache
prod-build-no-cache: prod-clean
	$(DCP) build app --no-cache

.PHONY: prod-logs
prod-logs:
	$(DCP) logs app --follow app

.PHONY: prod-all
prod-all: prod-build prod-up prod-logs

.PHONY: prod-clean
prod-clean: 
	$(DCP) down -v --remove-orphans --rmi local


## -- UTILITIES ------- ## 
.PHONY: clean-all
clean-all:
	$(DC) down -v
	$(DCT) down -v
	$(DCP) down -v
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
	@echo "Production commands:"
	@echo "  make prod-up               - Start the application in production"
	@echo "  make prod-build             - Clean and build production container"
	@echo "  make prod-build-no-cache    - Clear cache and build production container"
	@echo "  make prod-logs              - View production logs"
	@echo "  make prod-all               - Run prod build, start, and logs in sequence"
	@echo "  make prod-clean             - Clean prod containers and volumes"

	@echo "  make clean-all             - Clean all containers, systems and volumes"
