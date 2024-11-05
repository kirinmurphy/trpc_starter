
DC=docker compose
DCT=docker compose -f docker-compose.yml -f docker-compose.cypress.yml

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

## -- UTILITIES ------- ## 
.PHONY: clean
clean:
	docker compose down -v 
	$(DCT) down -v
	docker system prune -f
	docker volume prune -f

.PHONY: help
help:
	@echo "Application commands:"
	@echo "  make app                    - Start the application"
	@echo "  make build-app              - Clean and build application container"
	@echo "  make build-app-no-cache     - Clear image cache, then clean and build app container"
	@echo "  make logs-app               - View application logs"
	@echo "  make app-all                - Run build, start, and logs in sequence"
	@echo ""
	@echo "CI / Testing commands:"
	@echo "  make test                   - Run cypress tests"
	@echo "  make build-cypress          - Clean and build cypress container"
	@echo "  make build-cypress-no-cache - Clear image cache, then clean and build cypress container"
	@echo "  make logs-cypress           - View cypress logs"
	@echo "  make cypress-all            - Clean, build, test, and logs in sequence"
	@echo ""
	@echo "Utility commands:"
	@echo "  make clean                  - Clean up containers and volumes"
