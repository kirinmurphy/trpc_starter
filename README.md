# tRPC web app starter
App starter built with Bun, Typescript, tRPC and React 

[Github Project board](https://github.com/users/kirinmurphy/projects/2)

<table>
  <tr>
    <td style="vertical-align: top;">Identity & Access Control</td>
    <td>
      • <a href="./docs/auth.md">Account creation with email verification</a><br>
      • Authentication (& refresh) session management<br>
      • <a href="./docs/password_reset.md">Password reset workflow</a><br>
      • Dev and prod specific <a href="./docs/super_admin_setup.md">site owner admin creation</a> integrated into build process.
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
      • <a href="./cypress/e2e/auth_spec.cy.ts">e2e testing</a> with CI integration (Github Actions)<br>
      • <a href="#running-app-with-docker">Docker containers</a> for dev, testing, and production environments<br>
      • <a href="./docs/email.md">Email integration</a> for dev, testing and production environments<br>
      • CI integrated postgres migration flow
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Client</td>
    <td>
      • Simple form library w/ tRPC support<br>
      • Markdown file import tool<br>
      • Icon library
    </td>
  </tr>
</table>

# Stack
- **Runtime**: Bun, Vite
- **Server**: tRPC, Zod, Postgres, Nginx
- **Client**: React, React Query, Tanstack Router, Tailwind, React Icons
- **Devops**: Docker, Cypress, Mailhog, Github Actions 
- **Dev Tools**: Prettier


# Setup
## Evironment Variables
```env 
# -- REQUIRED
DB_NAME=posgtres_db_name
DB_USER=postgres_db_username
DB_PASSWORD=postgres_db_password

AUTH_TOKEN_SECRET=base64_encoded_32+_characters_string
REFRESH_TOKEN_SECRET=base64_encoded_32+_characters_string


# -- FOR PRODUCTION
WEBSITE_DOMAIN=yourdomain.com

EMAIL_SERVICE_HOST=smtp.some-provider.com
EMAIL_SERVICE_USER=email_service_user
EMAIL_SERVICE_PASS=email_service_password_or_api_key

# Set up super admin user on initial build
SUPER_ADMIN_EMAIL=adminemail@gmail.com
``` 
[full variable list](./.env.example) with additional overrides


## Running App With Docker

### Development commands:
- **make dev-up**                 - Run the application 
- **make dev-build**              - Clean and build application container
- **make dev-build-no-cache**     - Clear cache, clean and build dev container
- **make dev-logs**               - View application logs
- **make dev-all**                - Run build, start, and logs in sequence
- **make dev-clean**              - Clean dev containers and volumes
- **make reload-nginx**           - Update nginx config (no restart needed)

#### Dev URLs
- website: `http://localhost`     
- mock email server: `http://localhost:8025`


### CI / Testing commands:
- **make run-test**             - Run cypress tests
- **make build tests**          - Clean and build cypress container
- **make build tests-no-cache** - Clear cache, clean and build cypress container
- **make tests-logs**           - View cypress logs
- **make tests-all**            - Clean, build, test, and logs in sequence
- **make tests-clean**          - Clean tests containers and volumes

### Production commands:
- **make prod-up**                - Start the application in production
- **make prod-down**              - Start the application in production
- **make prod-build**             - Clean and build production container
- **make prod-build-no-cache**    - Clear cache and build production container
- **make prod-logs**              - View production logs
- **make prod-all**               - Run prod build, start, and logs in sequence
- **make prod-clean**             - Clean prod containers and volumes

### General 
- **make help**                   - Show all commands 

Notes: 
- DB Migration is run on every app/production start


## Deploying App on VPS
- [VPS setup](./docs/vps/vps_setup.md) with Digital Ocean
- [VPS Security Hardening](./docs/vps/vps_hardening.md)
