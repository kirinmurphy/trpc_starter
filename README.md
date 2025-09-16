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
      • <a href="#running-app-with-docker">Docker containers</a> for dev, testing, and production environments<br>
      • SSL https implementation locally and in production.<br>
      • <a href="./cypress/e2e/base/auth_spec.cy.ts">e2e testing</a> with Github Action CI integration <br>
      • <a href="./docs/cypress_options.md">Dynamic test modes</a> to test unique app variations / feature flags. <br>
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
- **Server**: tRPC, Zod, Postgres, Nginx, Traefik
- **Client**: React, React Query, Tanstack Router, Tailwind, React Icons
- **Devops**: Docker, Cypress, Mailhog, Github Actions 
- **Dev Tools**: Prettier


# Setup
## Environment Variables
```env 
# -- REQUIRED
DB_NAME=posgtres_db_name
DB_USER=postgres_db_username
DB_PASSWORD=postgres_db_password

AUTH_TOKEN_SECRET=base64_encoded_32+_characters_string
REFRESH_TOKEN_SECRET=base64_encoded_32+_characters_string

WEBSITE_DOMAIN=yourdomain.com
WEBSITE_DOMAIN=localhost # for development, local prod

# -- FOR PRODUCTION

EMAIL_SERVICE_HOST=smtp.some-provider.com
EMAIL_SERVICE_USER=email_service_user
EMAIL_API_KEY=EMAIL_API_KEYword_or_api_key

# Set up super admin user on initial build
SUPER_ADMIN_EMAIL=adminemail@gmail.com
``` 
[full variable list](./.env.example) with additional overrides


## SSL Setup
<a href="./docs/mkcert-setup.md">Create https certificate</a> for local development

## Running App With Docker
### Development commands:
- **make dev-up**                 - Start the application 
- **make dev-down**               - Stop the application
- **make dev-build**              - Build application container
- **make dev-build-no-cache**     - Clear cache and build dev container
- **make dev-logs**               - View application logs
- **make dev-all**                - Run build, start, and logs in sequence
- **make dev-clean**              - Clean dev containers and volumes
- **make reload-nginx**           - Restart nginx service

#### Dev URLs
- website: `http://localhost`     
- mock email server: `http://localhost:8025`


### CI / Testing commands:
- **make tests-up**               - Run cypress tests (use FILE=filename to run specific test)
- **make tests-down**             - Stop test containers
- **make tests-build**            - Build cypress container
- **make tests-build-no-cache**   - Clear cache and build cypress container
- **make tests-logs**             - View cypress logs
- **make tests-all**              - Run tests build, start, and logs in sequence
- **make tests-clean**            - Clean tests containers and volumes

### Production commands:
- **make prod-up**                - Start the application in production
- **make prod-down**              - Stop the production application
- **make prod-build**             - Build production container
- **make prod-build-no-cache**    - Clear cache and build production container
- **make prod-logs**              - View production logs
- **make prod-all**               - Run prod build, start, and logs in sequence
- **make prod-clean**             - Clean prod containers and volumes

### Utility commands:
- **make clean-all**              - Clean all containers, systems and volumes
- **make help**                   - Show all available commands

Notes: 
- DB Migration is run on every app/production start


## Deploying App on VPS
- [VPS setup](./docs/vps/vps_setup.md) with Digital Ocean
- [VPS Security Hardening](./docs/vps/vps_hardening.md)
