# Cypress Testing Environment
Using Cypress:  
- Repeatable cypress commands available in the `/cypress/support` folder
- Test files of default behavior should be written in `/cypress/e2e/base`
- Additional test modes can be created with different app configurations.

## Dynamic Test Modes
Cypress can test for different app configurations via various Docker Compose configurations.   

Create various `docker-compose.override.OVERRIDE_NAME.yml` files and corresponding `cypress/e2e/OVERRIDE_NAME` directory to provide customized containers for specific tests. 

### 1. Project Directory Structure:
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
├── docker-compose.override.override1.yml 
└── docker-compose.override.override2.yml 
```
- base represents the default config (uses just `docker-compose.cypress.yml`)
- each `override/` directory must match to a namespaced docker override file


### 2. Example Docker Compose Override File:
Each `docker-compose.override.OVERRIDE_NAME.yml` file extends or modifies the base cypress container, often with a custom ENV variable.   

docker-compose.override1.yml
```yml
services:
  cypress:
    environment:
      - FEATURE_FLAG_OVERRIDE1=true 
    # could also add other override settings
    # build:
    #   context: .
    #   dockerfile: Dockerfile.override1
    # volumes:
    #   - ./cypress-config-override1:/app/cypress/config
```

## Running The Tests:
The tests can be run with the following options: 

### 1. Run All Tests
```bash
make tests-up
```
Runs the default and all override test modes.  Each mode will build its own test container with override configs.

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
Run all tests within a specific test mode directory. 

_Note: This argument is ignored if FILE is also provided._
