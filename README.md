# tRPC web app starter
App starter built with Bun, Typescript, tRPC and React 

[Github Project board](https://github.com/users/kirinmurphy/projects/2)

<table>
  <tr>
    <td style="vertical-align: top;">User and Account Management</td>
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
      • HTTPS/TLS encryption<br>
      • Proxied port mapping of whitelisted ports<br>
      • Helmet headers/csp, csrf and cors protections<br>
      • Rate limited mutation endpoints<br>
      • Form input sanitization
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Infra / Devops</td>
    <td>
      • <a href="#running-app-with-docker">Docker containers</a> for dev, testing, and production environments<br>
      • <a href="https://github.com/kirinmurphy/traefik_vps">External Traefik edge router</a> for Docker apps over shared `web` network<br>
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
- **Remote Server**: Traefik VPS Integration
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

WEBSITE_DOMAIN=localhost (local dev and production)

# -- FOR PRODUCTION
WEBSITE_DOMAIN=yourdomain.com (remote prod environment)

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
There are 4 container environments 
- **dev**: auto rebuilding / hot reloading app enviroment
- **tests**: cypress tests suite running with dev instance, used in Github Actions CI.
- **prod-local**: static site generation with local traefik/https
- **prod-remote**: static site generation with remote traefik/https

Each of these containers can be interacted with using these commands (replacing `ENV`).

### Base Commands:
- `make ENV-up`                 - Start the container 
- `make ENV-down`               - Stop the container
- `make ENV-build`              - Build container
- `make ENV-build-no-cache`     - Rebuild full dockerfile image
- `make ENV-clean`              - Clean environment containers and volumes
- `make ENV-up-fresh`           - Clean, build and start container
- `make ENV-logs`               - View container logs

So for example `make dev-up-fresh`, `make prod-local-build`, `make tests-clean && make tests-build-no-cache`

### Development 
#### URLs for `make dev-up` 
- website: `http://localhost`     
- mock email server: `http://localhost:8025`

#### Additional dev actions
- `make reload-nginx`                     - Restart nginx service

### Tests 
Use the FILE or TEST_MODE argument to test specific files. [instructions](./docs/cypress_options.md)    
- FILE: `make tests-up FILE=base/auth_tests` 
- TEST_MODE: `make tests-up TEST_MODE=email_provider_override` 

### Production:
- `make prod-local-[command]` executes a local production container action for testing 
- `make prod-remote-[command]` executes a remote production container action for live deployment

### Utility commands:
- `make clean-all`              - Clean all containers, systems and volumes
- `make help`                   - Show all available commands


## Deploying App on VPS
- [VPS setup](./docs/vps/vps_setup.md) with Digital Ocean
- [VPS Security Hardening](./docs/vps/vps_hardening.md)
