# Cypress Dynamic Mode Test Orchestration
Cypress can test for different app variations via various Docker Compose configurations.   

Create various overrides driven from docker compose files to test in custom containers. 
- `docker-compose.cypress.SOME_OVERRIDE.yml` in project root, plus 
- `cypress/e2e/SOME_OVERRIDE/` directory for specific tests 

## 1. Project Directory Structure:

```
├── cypress/
│   └── e2e/
│       ├── base/
│       │   └── base_test_file.cy.ts      
│       ├── override1/
│       │   └── override1_test_file.cy.ts      
│       └── override2/
│           └── override2_test_file.cy.ts      
├── docker-compose.cypress.yml          
├── docker-compose.cypress.override1.yml 
└── docker-compose.cypress.override2.yml 
```
- base includes all the default app test files (uses `docker-compose.cypress.yml`)
- each `override/` directory must match to a namespaced docker override file


## 2. Example Docker Compose Override File:
Each override file extends the base cypress container, usually consisting of custom ENV variables.   

`docker-compose.cypress.override1.yml`
```yml
services:
  cypress:
    environment:
      - FEATURE_FLAG_OVERRIDE1=true 
    # could also add other override settings
    # build:
    #   context: .
    #   dockerfile: Dockerfile.cypress.override1
    # volumes:
    #   - ./cypress-config-override1:/app/cypress/config
```

## 3. Usage Examples for `make tests-up`:
Tests can be run with following commands: 

### 1. Run All Tests
```bash
make tests-up
```
If no specific `FILE` or `TEST_MODE` is provided, the script runs all test modes.  
Each mode will bring up (and tear down) its own Docker Compose container.

### 2. Run Tests for a Specific File:
```bash
make tests-up FILE="base/test_file_1"
make tests-up FILE="override1/test_file_2"
```
Find just a specific file within a namespaced directory.

### 3. Run All Tests for a Specific Mode:
```bash
make tests-up TEST_MODE="base"
make tests-up TEST_MODE="override2"
```
Run all tests within a specific namespaced directory. 

_Note: This argument is ignored if FILE is also provided._