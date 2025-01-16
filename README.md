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
      • CI integrated postgres migration action
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Client</td>
    <td>
      • Simple form library w/ tRPC integration<br>
      • Markdown file import
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

# -- PRODUCTION
CLIENT_DOMAIN=your-webdomain.com

# -- DB
DB_NAME=db_for_your_app
DB_USER=your_username
DB_PASSWORD=your_password

# -- AUTH
AUTH_TOKEN_SECRET=base64_encoded_32+_characters_string
REFRESH_TOKEN_SECRET=base64_encoded_32+_characters_string

<<<<<<< HEAD
# -- EMAIL
EMAIL_SERVICE_HOST=smtp.some-provider.com
EMAIL_SERVICE_USER=email_service_user
EMAIL_SERVICE_PASS=email_service_password_or_api_key
EMAIL_SERVICE_SYSTEM_EMAIL_ADDRESS=support@yourdomain.com
EMAIL_SERVICE_SYSTEM_EMAIL_SENDER=yourdomain.com
# EMAIL_SERViCE_PORT=not_587
# EMAIL_SERVICE_SECURE=not_false
=======
# EMAIL
EMAIL_SERVICE_HOST=smtp.some-provider.com # ex: smtp.sendgrid.net
EMAIL_SERVICE_API_KEY=email_service_api_key
EMAIL_SERVICE_SYSTEM_EMAIL_ADDRESS=noreply@yourdomain.com
EMAIL_SERVICE_SYSTEM_EMAIL_NAME=yourdomain.com

>>>>>>> 3e7cbb5 (added email integration)
``` 


## Running App With Docker

### Development commands:
- **make run-dev**                    - Run the application 
- **make build-dev**              - Clean and build application container
- **make build-dev-no-cache**     - Clear cache, clean and build dev container
- **make logs-dev**               - View application logs
- **make dev-all**                - Run build, start, and logs in sequence
- **make clean-dev**              - Clean dev containers and volumes
- **make reload-nginx**           - Update nginx config (no restart needed)

#### Dev URLs
- website: `http://localhost`     
- email server: `http://localhost:8025`    


### CI / Testing commands:
- **make run-test**                   - Run cypress tests
- **make build tests**          - Clean and build cypress container
- **make build tests-no-cache** - Clear cache, clean and build cypress container
- **make logs-tests**           - View cypress logs
- **make tests-all**            - Clean, build, test, and logs in sequence
- **make clean-tests**          - Clean tests containers and volumes

### Production commands:
- **make run-prod**                   - Start the application in production
- **make build-prod**             - Clean and build production container
- **make build-prod-no-cache**    - Clear cache and build production container
- **make logs-prod**              - View production logs
- **make prod-all**               - Run prod build, start, and logs in sequence
- **make clean-prod**             - Clean prod containers and volumes

### General 
- **make help**                   - Show all commands 

Notes: 
- DB Migration is run on every app/production start
