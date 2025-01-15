# tRPC web app starter
App starter built in Typescript, tRPC, Node and React 


<table>
  <tr>
    <td style="vertical-align: top;">Authentication</td>
    <td>
      • Account creation with email verification<br>
      • Authentication (& refresh) session management
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Security</td>
    <td>
      • Reverse-proxied api<br>
      • Helmet headers/csp, csrf and cors protections<br>
      • Rate limited mutation endpoints<br>
      • Form input sanitization
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Infra / Devops</td>
    <td>
      • e2e test framework with Github Actions integration<br>
      • Docker containers for dev, testing, and production environments<br>
      • Email integration for dev, test and production environments<br>
      • Postgres migration task
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Client</td>
    <td>
      • Simple form library w/ tRPC integration<br>
      • Icon library
    </td>
  </tr>
</table>

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
DB_USER=your_username
DB_PASSWORD=your_password
# DB_HOST=localhost 
# DB_PORT=5432

# AUTH
AUTH_TOKEN_SECRET=base64_encoded_32+_characters_string
REFRESH_TOKEN_SECRET=base64_encoded_32+_characters_string
``` 


## Running App With Docker

### Development commands:
- **make app**                    - Run the application 
- **make build-app**              - Clean and build application container
- **make build-app-no-cache**     - Clear cache, clean and build app container
- **make logs-app**               - View application logs
- **make app-all**                - Run build, start, and logs in sequence
- **make reload-nginx**           - Update nginx config (no restart needed)

#### Dev URLs
- website: `http://localhost`     
- email server: `http://localhost:8025`    


### CI / Testing commands:
- **make test**                   - Run cypress tests
- **make build tests**          - Clean and build cypress container
- **make build tests-no-cache** - Clear cache, clean and build cypress container
- **make logs-tests**           - View cypress logs
- **make tests-all**            - Clean, build, test, and logs in sequence

### Production commands:
- **make prod**                   - Start the application in production
- **make build-prod**             - Clean and build production container
- **make build-prod-no-cache**    - Clear cache and build production container
- **make logs-prod**              - View production logs
- **make prod-all**               - Run prod build, start, and logs in sequence

### General 
- **make help**                   - Show all commands 
- **make reload-nginx**           - Restart nginx container
- **make clean**                  - compose down containers and prune volumes/system

Notes: 
- DB Migration is run on every app/production  start
