# tRPC web app starter
Some general web things that are generally used for other web things.

- tRPC / Zod authentication api and UI shell
- JWT auth and refresh token sessions
- native Postgres DB migration workflow
- cypress e2e harness with test DB integration 
- security strategy including helmet headers/csp, csrf and cors enforcement
- tanstack client router implementation
- tailwind yo

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

### Docker Development 
```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f
``` 

### Running Tests in Docker 
```bash
# TODO: ADD MAKE COMMANDS 
# interactive test interface 
docker compose exec app bun run test:dev

# headless testing
docker compose exec app bun run test

# Run specific test
docker compose exec app bun run cypress run --spec "cypress/e2e/your-test.cy.ts"
```


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
bun run test:dev
``` 
