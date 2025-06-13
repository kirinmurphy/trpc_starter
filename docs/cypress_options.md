# Cypress Dynamic Mode Test Orchestration
Cypress can test for different app variations via various Docker Compose configurations.   

Create various `docker-compose.cypress.[OVERRIDE_NAME].yml` files and corresponding `cypress/e2e/OVERRIDE_NAME` directory to provide customized containers for specific tests. 

## 1. Project Directory Structure:


```
├── cypress/
│   └── e2e/
│       ├── base/
│       │   └── test_file_1.cy.ts      
│       ├── override1/
│       │   └── test_file_2.cy.ts      
│       └── override2/
│           └── test_file_3.cy.ts      
├── docker-compose.cypress.yml          
├── docker-compose.cypress.override1.yml 
└── docker-compose.cypress.override2.yml 
```
- base represents the default config (uses just `docker-compose.cypress.yml`)
- each `override/` directory must match to a namespaced docker override file


## 2. Example Docker Compose Override File:
Each `docker-compose.cypress.override.[OVERRIDE_NAME].yml` file extends or modifies the base cypress container, often with a custom ENV variable.   

docker-compose.cypress.override1.yml
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
You can run the tests with follow args: 

### 1. Run All Tests
```bash
make tests-up
```
If no specific `FILE` or `TEST_MODE` is provided, the script runs all test modes.  
Each mode will bring up its own Docker Compose configuration.

### 2. Run Tests for a Specific File:
```bash
make tests-up FILE="base/test_file_1"
make tests-up FILE="override1/test_file_2"
```
Find just a specific file within a namespaced directory.

_Note: If FILE is provided, the TEST_MODE argument will be ignored._

### 3. Run All Tests for a Specific Mode:
```bash
make tests-up TEST_MODE="base"
make tests-up TEST_MODE="override2"
```
Run all tests within a specific namespaced directory. 

_Note: This argument is ignored if FILE is also provided._