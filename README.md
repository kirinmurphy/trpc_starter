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


## Local Setup
### ENV Variables
``` 
CLIENT_URL=http://localhost:5173

DB_USER=some_user
DB_HOST=some_host
DB_NAME=some_db_name
DB_PASSWORD=some_password
TEST_DB_NAME=some_other_db_name

AUTH_TOKEN_SECRET=some_token_secret
REFRESH_TOKEN_SECRET=some_other_token_secret
``` 

### Install Bun
install bun - https://bun.sh/docs/installation    
then install packages 
``` 
bun install
```

### DB Setup 
create postgres databases for DB_NAME and TEST_DB_NAME
``` 
~ psql
CREATE DATABASE some_db_name;
CREATE DATABASE some_other_db_name;
``` 

then run migration
```
bun run migrate:all
```

### Run App
```
bun dev
``` 

### Run Tests
```
bun run test:dev
``` 
