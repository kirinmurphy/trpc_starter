DC_BASE=docker compose -f docker-compose.base.yml 
DC=${DC_BASE} -f docker-compose.yml 
DCT=${DC} -f docker-compose.cypress.yml
DCP=${DC_BASE} -f docker-compose.production.yml
PRUNE=docker system prune -f && docker volume prune -f

## -- DEV ------- ## 
.PHONY: app
app:
	$(DC) up

.PHONY: build-app
build-app: clean-app
	$(DC) build app

.PHONY: build-app-no-cache
build-app-no-cache: clean-app
	$(DC) build app --no-cache

.PHONY: logs-app
logs-app:
	$(DC) logs app

.PHONY: app-all
app-all: build-app app logs-app

.PHONY: clean-app
clean-app: 
	$(DC) down -v
	${PRUNE}

.PHONY: reload-nginx
reload-nginx:
	$(DC) restart nginx


## -- TESTING ------- ## 
.PHONY: tests
tests:
	# $(DCT) up --exit-code-from cypress --abort-on-container-exit
	# Toggle to hide nginx logs in terminal
	$(DCT) up --exit-code-from cypress --abort-on-container-exit | grep -v "nginx.*\|.*nginx"

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
tests-all: build-tests tests logs-tests

.PHONY: clean-tests
clean-tests: 
	$(DCT) down -v
	${PRUNE}


## -- PRODUCTION ------- ##
.PHONY: prod
prod:
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
prod-all: build-prod prod logs-prod

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
	@echo "  make app                    - Start the application"
	@echo "  make build-app              - Clean and build application container"
	@echo "  make build-app-no-cache     - Clear cache and build app container"
	@echo "  make logs-app               - View application logs"
	@echo "  make app-all                - Run app build, start, and logs in sequence"
	@echo "  make clean-app              - Clean dev containers and volumes"
	@echo "  make reload-nginx           - Update nginx config (w/o restarting)"

	@echo ""
	@echo "CI / Testing commands:"
	@echo "  make tests                  - Run cypress tests"
	@echo "  make build-tests            - Clean and build cypress container"
	@echo "  make build-tests-no-cache   - Clear cache and build cypress container"
	@echo "  make logs-tests             - View cypress logs"
	@echo "  make tests-all              - Run tests build, start, and logs in sequence"
	@echo "  make clean-tests            - Clean tests containers and volumes"

	@echo ""
	@echo "Production commands:"
	@echo "  make prod                   - Start the application in production"
	@echo "  make build-prod             - Clean and build production container"
	@echo "  make build-prod-no-cache    - Clear cache and build production container"
	@echo "  make logs-prod              - View production logs"
	@echo "  make prod-all               - Run prod build, start, and logs in sequence"
	@echo "  make clean-prod             - Clean prod containers and volumes"
