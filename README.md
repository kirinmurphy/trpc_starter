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
      • e2e test framework with CI integration (Github Actions)<br>
      • Docker containers for dev, testing, and production environments<br>
      • Email integration for dev, testing and production environments<br>
      • CI integrated postgres migration flow
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Client</td>
    <td>
      • Simple form library w/ tRPC integration<br>
      • Markdown file import<br>
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
# -- DB
DB_NAME=app_db_name
DB_USER=app_db_username
DB_PASSWORD=app_db_password

# -- AUTH
AUTH_TOKEN_SECRET=base64_encoded_32+_characters_string
REFRESH_TOKEN_SECRET=base64_encoded_32+_characters_string

# -- MISC
VITE_EMAIL_ADDRESS_SUPPORT=support@yourdomain.com

# -- PRODUCTION
CLIENT_DOMAIN=yourdomain.com

EMAIL_SERVICE_HOST=smtp.some-provider.com
EMAIL_SERVICE_USER=email_service_user
EMAIL_SERVICE_PASS=email_service_password_or_api_key
EMAIL_SERVICE_SYSTEM_EMAIL_ADDRESS=support@yourdomain.com
EMAIL_SERVICE_SYSTEM_EMAIL_SENDER=yourdomain.com
``` 
additional optional override variables available [here](./.env.example)


## Running App With Docker

### Development commands:
- **make run-dev**                - Run the application 
- **make build-dev**              - Clean and build application container
- **make build-dev-no-cache**     - Clear cache, clean and build dev container
- **make logs-dev**               - View application logs
- **make dev-all**                - Run build, start, and logs in sequence
- **make clean-dev**              - Clean dev containers and volumes
- **make reload-nginx**           - Update nginx config (no restart needed)

#### Dev URLs
- website: `http://localhost`     
- mock email server: `http://localhost:8025`


### CI / Testing commands:
- **make run-test**             - Run cypress tests
- **make build tests**          - Clean and build cypress container
- **make build tests-no-cache** - Clear cache, clean and build cypress container
- **make logs-tests**           - View cypress logs
- **make tests-all**            - Clean, build, test, and logs in sequence
- **make clean-tests**          - Clean tests containers and volumes

### Production commands:
- **make run-prod**               - Start the application in production
- **make build-prod**             - Clean and build production container
- **make build-prod-no-cache**    - Clear cache and build production container
- **make logs-prod**              - View production logs
- **make prod-all**               - Run prod build, start, and logs in sequence
- **make clean-prod**             - Clean prod containers and volumes

### General 
- **make help**                   - Show all commands 

Notes: 
- DB Migration is run on every app/production start
