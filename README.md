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
CLIENT_URL=http://localhost:5173

# For Docker, DB_HOST will be set in 'docker compose'
# For local development, use 'localhost'
DB_HOST=localhost
DB_USER=your_username
DB_NAME=your_db_name
DB_PASSWORD=your_password
TEST_DB_NAME=your_other_test_db_name

AUTH_TOKEN_SECRET=your_JTW_token_secret
REFRESH_TOKEN_SECRET=your_refresh_JWT_token_secret
``` 


# Running App With Docker
### First Time Setup
```bash
docker compose up -d

# Run migrations (only needed first time, or after container deleted)
docker compose exec app bun run migrate:docker
``` 

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
# interactive test interface 
docker compose exec app bun run test:dev

# headless testing
docker compose exec app bun run test

# Run specific test
docker compose exec app bun run cypress run --spec "cypress/e2e/your-test.cy.ts"
```

### Docker Reset 
Fully reset the DB
```bash
docker compose down -v 
docker compose up -d
docker compose exec app bun run migrate:docker 
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
