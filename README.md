# tRPC web app starter
Some general web things that are generally used for other web things.

- tRPC / Zod authentication api and UI shell
- JWT auth and refresh token sessions
- native Postgres DB migration flow
- cypress e2e harness with test DB
- security strategy w/ helmet headers/csp, csrf and cors enforcement     
- Dockerized app and test CI versions
- Tanstack client router implementation
- Tailwind yo 

### On Deck: 
- Production build
- nginx proxy
- api rate limiting


## Setup
### ENV Variables
```env 
# commented variables available for overrides

API_PROTOCOL=http
API_PORT=3000
VITE_PORT=5173
# API_HOST=0.0.0.0
# VITE_HOST=0.0.0.0

# DB
DB_NAME=your_db_name
TEST_DB_NAME=your_other_test_db_name
DB_USER=your_username
DB_PASSWORD=your_password
# DB_HOST=localhost 
# DB_PORT=5432

# AUTH
AUTH_TOKEN_SECRET=your_JTW_token_secret
REFRESH_TOKEN_SECRET=your_refresh_JWT_token_secret

# Reqiuired for non-docker local dev
CLIENT_URL=http://localhost:5137 
``` 


# Running App With Docker

### Development commands:
- **make app**                    - Run the application
- **make build-app**              - Clean and build application container
- **make build-app-no-cache**     - Clear cache, clean and build app container
- **make logs-app**               - View application logs
- **make app-all**                - Run build, start, and logs in sequence

### CI / Testing commands:
- **make test**                   - Run cypress tests
- **make build-cypress**          - Clean and build cypress container
- **make build-cypress-no-cache** - Clear cache, clean and build cypress container
- **make logs-cypress**           - View cypress logs
- **make cypress-all**            - Clean, build, test, and logs in sequence

### Production commands:
- **make prod**                   - Start the application in production
- **make build-prod**             - Clean and build production container
- **make build-prod-no-cache**    - Clear cache and build production container
- **make logs-prod**              - View production logs
- **make prod-all**               - Run prod build, start, and logs in sequence

Notes: 
- DB Migration is run on every app/production  start

# Running app locally (no Docker)
### Prerequisites
- PostgreSQL installed and running locally
- Bun installed (https://bun.sh/docs/installation)

### Install Dependencies
```bash 
bun install
```

### DB Setup 
create postgres databases for DB_NAME and TEST_DB_NAME

```bash
# Create databases
psql -U postgres
CREATE DATABASE your_db_name;
CREATE DATABASE your_other_test_db_name;
\q

# Run migrations
bun run migrate:local
```

### Run App
```bash
bun dev
``` 

### Run Tests
```bash
# first terminal window
bun dev
# secood terminal window
bun run test:dev
``` 
