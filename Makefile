SHELL := /bin/bash

DC_BASE=docker compose -f docker-compose.base.yml 
DC=${DC_BASE} -f docker-compose.dev.yml 
DCT=${DC} -f docker-compose.cypress.yml
DCP=${DC_BASE} -f docker-compose.production.yml
PRUNE=docker system prune -f && docker volume prune -f

## -- DEV ------- ## 
.PHONY: run-dev
run-dev:
	$(DC) up

.PHONY: build-dev
build-dev: clean-dev
	$(DC) build app

.PHONY: build-dev-no-cache
build-dev-no-cache: clean-dev
	$(DC) build app --no-cache

.PHONY: logs-dev
logs-dev:
	$(DC) logs dev

.PHONY: dev-all
dev-all: build-dev run-dev logs-dev

.PHONY: clean-dev
clean-dev: 
	$(DC) down -v
	${PRUNE}

.PHONY: reload-nginx
reload-nginx:
	$(DC) restart nginx


## -- TESTING ------- ## 
.PHONY: run-tests
run-tests:
	@if [ -n "$(FILE)" ]; then \
		echo "Running test for: $(FILE)"; \
		set -o pipefail; $(DCT) up -d mailhog app db nginx && $(DCT) run --rm cypress npx cypress run --spec "cypress/e2e/$(FILE).cy.ts" | grep -v "nginx.*\|.*nginx"; \
	else \
		set -o pipefail; $(DCT) up --exit-code-from cypress --abort-on-container-exit | grep -v "nginx.*\|.*nginx"; \
	fi

.PHONY: build-tests
build-tests: clean-tests
	$(DCT) build cypress

.PHONY: build-tests-no-cache
build-tests-no-cache: clean-tests
	$(DCT) build cypress --no-cache

.PHONY: logs-tests
logs-tests:
	$(DCT) logs cypress

.PHONY: tests-all
tests-all: build-tests run-tests logs-tests

.PHONY: clean-tests
clean-tests: 
	$(DCT) down -v
	${PRUNE}


## -- PRODUCTION ------- ##
.PHONY: run-prod
run-prod:
	$(DCP) up

.PHONY: build-prod
build-prod: clean-prod
	$(DCP) build app

.PHONY: build-prod-no-cache
build-prod-no-cache: clean-prod
	$(DCP) build app --no-cache

.PHONY: logs-prod
logs-prod:
	$(DCP) logs app

.PHONY: prod-all
prod-all: build-prod run-prod logs-prod

.PHONY: clean-prod
clean-prod: 
	$(DCP) down -v
	${PRUNE}


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
	@echo "  make run-dev                - Start the application"
	@echo "  make build-dev              - Clean and build application container"
	@echo "  make build-dev-no-cache     - Clear cache and build dev container"
	@echo "  make logs-dev               - View dev application logs"
	@echo "  make dev-all                - Run app build, start, and logs in sequence"
	@echo "  make clean-dev              - Clean dev containers and volumes"
	@echo "  make reload-nginx           - Update nginx config (w/o restarting)"

	@echo ""
	@echo "CI / Testing commands:"
	@echo "  make run-tests              - Run cypress tests"
	@echo "  make build-tests            - Clean and build cypress container"
	@echo "  make build-tests-no-cache   - Clear cache and build cypress container"
	@echo "  make logs-tests             - View cypress logs"
	@echo "  make tests-all              - Run tests build, start, and logs in sequence"
	@echo "  make clean-tests            - Clean tests containers and volumes"

	@echo ""
	@echo "Production commands:"
	@echo "  make run-prod               - Start the application in production"
	@echo "  make build-prod             - Clean and build production container"
	@echo "  make build-prod-no-cache    - Clear cache and build production container"
	@echo "  make logs-prod              - View production logs"
	@echo "  make prod-all               - Run prod build, start, and logs in sequence"
	@echo "  make clean-prod             - Clean prod containers and volumes"
