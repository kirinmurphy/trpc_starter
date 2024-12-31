
DC=docker compose

## -- APP ------- ## 
.PHONY: app
app:
	$(DC) up

.PHONY: build-app
build-app: clean
	$(DC) build app

.PHONY: build-app-no-cache
build-app-no-cache: clean
	$(DC) build app --no-cache

.PHONY: logs-app
logs-app:
	$(DC) logs app

.PHONY: app-all
app-all: build-app app logs-app


## -- TESTING ------- ## 
DCT=docker compose -f docker-compose.yml -f docker-compose.cypress.yml

.PHONY: test
test:
	$(DCT) up --exit-code-from cypress --abort-on-container-exit

.PHONY: build-cypress
build-cypress: clean
	$(DCT) build cypress

.PHONY: build-cypress-no-cache
build-cypress-no-cache: clean
	$(DCT) build cypress --no-cache

.PHONY: logs-cypress
logs-cypress:
	$(DCT) logs cypress

.PHONY: cypress-all
cypress-all: clean build-cypress test logs-cypress


## -- PRODUCTION ------- ##
DCP=docker compose -f docker-compose.production.yml

.PHONY: prod
prod:
	$(DCP) up

.PHONY: build-prod
build-prod: clean
	$(DCP) build app

.PHONY: build-prod-no-cache
build-prod-no-cache: clean
	$(DCP) build app --no-cache

.PHONY: logs-prod
logs-prod:
	$(DCP) logs app

.PHONY: prod-all
prod-all: build-prod prod logs-prod


## -- UTILITIES ------- ## 
.PHONY: reload-nginx
reload-nginx:
	$(DC) exec nginx nginx -s reload

.PHONY: clean
clean:
	docker compose down -v 
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
	@echo "  make app-all                - Run build, start, and logs in sequence"
	@echo ""
	@echo "CI / Testing commands:"
	@echo "  make test                   - Run cypress tests"
	@echo "  make build-cypress          - Clean and build cypress container"
	@echo "  make build-cypress-no-cache - Clear cache and build cypress container"
	@echo "  make logs-cypress           - View cypress logs"
	@echo "  make cypress-all            - Clean, build, test, and logs in sequence"

	@echo ""
	@echo "Production commands:"
	@echo "  make prod                   - Start the application in production"
	@echo "  make build-prod             - Clean and build production container"
	@echo "  make build-prod-no-cache    - Clear cache and build production container"
	@echo "  make logs-prod              - View production logs"
	@echo "  make prod-all               - Run prod build, start, and logs in sequence"

	@echo ""
	@echo "Utility commands:"
	@echo "  make reload-nginx           - Update nginx config (w/o restarting)"
	@echo "  make clean                  - Clean up containers and volumes"
