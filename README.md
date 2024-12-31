# tRPC web app starter
App starter built in Typescript, tRPC, Node and React 

#### Authentication
- account creation with email verification
- authentication (& refresh) session management 

#### Security
- helmet headers/csp, csrf and cors protections 
- rate limited mutation endpoints
- form input sanitization

#### Infra / Devops
- e2e test support with Cypress
- Dockerized dev, test and production actions 
- Email service support for dev, test and production environments
- Postgres migration workflow 

#### Client
- Simple form library w/ tRPC integration 
- Icon library 


# Stack
- **Runtime**: Node.js, Bun, Vite
- **Server**: tRPC, Zod, Postgres, Nginx
- **Client**: React, React Query, Tanstack Router, Tailwind, React Icons
- **Devops**: Docker, Cypress, Mailhog, Github Actions 


# Setup
## ENV Variables
```env 
# commented variables available for overrides

API_PORT=3000
VITE_PORT=5173
# API_HOST=0.0.0.0
# VITE_HOST=0.0.0.0

# DB
DB_NAME=db_for_your_app
TEST_DB_NAME=db_for_cypress_tests
DB_USER=your_username
DB_PASSWORD=your_password
# DB_HOST=localhost 
# DB_PORT=5432

# AUTH
AUTH_TOKEN_SECRET=base64_encoded_32+_characters_string
REFRESH_TOKEN_SECRET=base64_encoded_32+_characters_string
``` 


## Running App With Docker

#### Development commands:
- **make app**                    - Run the application (loads at http://localhost)
- **make build-app**              - Clean and build application container
- **make build-app-no-cache**     - Clear cache, clean and build app container
- **make logs-app**               - View application logs
- **make app-all**                - Run build, start, and logs in sequence

#### CI / Testing commands:
- **make test**                   - Run cypress tests
- **make build-cypress**          - Clean and build cypress container
- **make build-cypress-no-cache** - Clear cache, clean and build cypress container
- **make logs-cypress**           - View cypress logs
- **make cypress-all**            - Clean, build, test, and logs in sequence

#### Production commands:
- **make prod**                   - Start the application in production
- **make build-prod**             - Clean and build production container
- **make build-prod-no-cache**    - Clear cache and build production container
- **make logs-prod**              - View production logs
- **make prod-all**               - Run prod build, start, and logs in sequence

Notes: 
- DB Migration is run on every app/production  start
