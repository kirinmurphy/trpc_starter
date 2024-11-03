DCT=docker compose -f docker-compose.yml -f docker-compose.cypress.yml

.PHONY: test
test:
	$(DCT) up --exit-code-from cypress --abort-on-container-exit

.PHONY: build-cypress
build-cypress:
	$(DCT) build cypress

.PHONY: build-cypress-no-cache
build-cypress-no-cache:
	$(DCT) build cypress --no-cache

.PHONY: logs-cypress
logs-cypress:
	$(DCT) logs cypress

.PHONY: cypress-all
cypress-all: build-cypress test logs-cypress

.PHONY: clean
clean:
	docker compose down -v 
	$(DCT) down -v
	docker system prune -f
	docker volume prune -f

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make test          					- Run cypress tests"
	@echo "  make build-cypress 					- Build cypress container"
	@echo "  make logs-cypress  					- View cypress logs"
	@echo "  make cypress-all   					- Run build, test, and logs in sequence"
	@echo "  make clean         					- Clean up containers and volumes"
	@echo "  make build-cypress-no-cache 	- clear cache and build cypress container"
	