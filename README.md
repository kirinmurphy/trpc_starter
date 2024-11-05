# tRPC web app starter
Some general web things that are generally used for other web things.

- tRPC / Zod authentication api and UI shell
- JWT auth and refresh token sessions
- native Postgres DB migration flow
- cypress e2e harness with test DB
- security strategy w/ helmet headers/csp, csrf and cors enforcement     
- served with docker
- Tanstack client router implementation
- Tailwind yo 

### On Deck: 
- Dockerizing & remote build
- API Rate limiting


## Setup
### ENV Variables
```env 
# commented variables are optional

API_PROTOCOL=http
API_PORT=3000
VITE_PORT=5173
# API_HOST=0.0.0.0
# VITE_HOST=0.0.0.0
# CLIENT_URL=http://localhost:5137 - required for non-docker local environment

# DB
DB_NAME=your_db_name
TEST_DB_NAME=your_other_test_db_name
DB_USER=your_username
DB_PASSWORD=your_password
# DB_HOST=localhost - not needed with docker 
# DB_PORT=5432

# AUTH
AUTH_TOKEN_SECRET=your_JTW_token_secret
REFRESH_TOKEN_SECRET=your_refresh_JWT_token_secret
``` 


# Running App With Docker

### Available commands:
Application commands:
- **make app**                    - Start the application      
- **make build-app**              - Clean and build application container      
- **make build-app-no-cache**     - Clear image cache, then clean and build app container      
- **make logs-app**               - View application logs      
- **make app-all**                - Run build, start, and logs in sequence      

Testing commands:
- **make test**                   - Run cypress tests      
- **make build-cypress**          - Clean and build cypress container      
- **make build-cypress-no-cache** - Clear image cache, then clean and build cypress container      
- **make logs-cypress**           - View cypress logs      
- **make cypress-all**            - Clean, build, test, and logs in sequence      

Utility commands:
- **make clean**                  - Clean up containers and volumes

Notes: 
- DB Migration is run on every app start

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
