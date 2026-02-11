# tRPC web app starter
App starter built with Bun, Typescript, tRPC and React 

[Github Project board](https://github.com/users/kirinmurphy/projects/2)

<table>
  <tr>
    <td style="vertical-align: top;">Infra / Devops</td>
    <td>
      • <a href="#running-app-with-docker">Docker containers</a> for dev, testing, and production environments<br>
      • <a href="./cypress/e2e/base/auth_spec.cy.ts">e2e testing</a> with Github Action CI integration <br>
      • <a href="./docs/cypress_options.md">Dynamic test modes</a> to test unique app variations / feature flags<br>
      • <a href="./docs/email.md">Email integration</a> for dev, testing and production environments<br>
      • <a href="https://github.com/kirinmurphy/traefik_vps">External https proxy</a> for routing to multiple containers over shared network<br>
      • CI integrated postgres migration flow
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top;">Security</td>
    <td>
      • HTTPS/TLS encryption<br>
      • Proxied port mapping of enabled ports<br>
      • CSRF protection<br>
      • Helmet headers/csp and cors protections<br>
      • Rate limited mutation endpoints<br>
      • Form input sanitization
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top;">User and <br>Account Management</td>
    <td>
      • <a href="./docs/auth.md">Account creation with email verification</a><br>
      • Authentication session management<br>
      • <a href="./docs/password_reset.md">Password reset workflow</a><br>
      • <a href="./docs/super_admin_setup.md">Site owner admin creation</a> integrated into dev and production build process.
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
- **Remote Server**: Digital Ocean, Traefik External Network Integration
- **Dev Tools**: Prettier


# Setup
## 1. Environment Variables
```env 
# -- REQUIRED
DB_NAME=posgtres_db_name
DB_USER=postgres_db_username
DB_PASSWORD=postgres_db_password

AUTH_TOKEN_SECRET=base64_encoded_32+_characters_string
REFRESH_TOKEN_SECRET=base64_encoded_32+_characters_string

# -- FOR PRODUCTION
WEBSITE_DOMAIN=yourdomain.com (remote build only)

# EMAIL: SMPT SETUP
EMAIL_SERVICE_HOST=smtp.some-provider.com
EMAIL_SERVICE_USER=email_service_user
EMAIL_API_KEY=account_api_key

# EMAIL: API SETUP 
CUSTOM_EMAIL_PROVIDER=resend / sendgrid
EMAIL_API_KEY=account_api_key

# Set up site owner on initial build (then can be removed)
SUPER_ADMIN_EMAIL=adminemail@gmail.com
```
[full variable list](./.env.example) with additional overrides


## 2. SSL Setup
<a href="./docs/mkcert-setup.md">Create https certificate</a> for local development and production testing

## 3. <span id="running-app-with-docker">Running App With Docker</span>     
There are 4 container environments     
- **dev**: auto rebuilding / hot reloading app enviromentg
- **tests**: cypress tests suite running with dev instance, used in Github Actions CI.
- **prod-local**: static site generation with local traefik/https
- **prod-remote**: static site generation with remote traefik/https

Each ENV can run various ACTIONs in the format `make ENV-ACTION`.     
For example `make dev-up`, `make prod-local-build` and `make tests-clean`.

### Docker ACTIONS:
- `make ENV-up`                 - Start the container 
- `make ENV-down`               - Stop the container
- `make ENV-build`              - Build container
- `make ENV-build-no-cache`     - Rebuild full dockerfile image
- `make ENV-clean`              - Clean environment containers and volumes
- `make ENV-up-fresh`           - Clean, build and start container
- `make ENV-logs`               - View container logs

### Development 
#### URLs for `make dev-up` 
- website: `https://localhost`     
- mock email server: `http://localhost:8025`

#### Additional dev actions
- `make reload-nginx` - Restart nginx service

### Tests 
Test filters can be added to `make tests-up` - [instructions](./docs/cypress_options.md)    

### Production:
- `make prod-local-ACTION` executes a local production container action at `https://localhost`
- `make prod-remote-ACTION` executes a remote production container action for live deployment

### Utility commands:
- `make clean-all`              - Clean all containers, systems and volumes
- `make help`                   - Show all available commands

# VPS / Deployment
- [VPS Setup](./docs/vps/vps_setup.md) — initial server provisioning and configuration
- [Traefik](./docs/vps/traefik.md) — reverse proxy, TLS, access logging, and dynamic configuration
- [VPS Hardening](./docs/vps/vps_hardening.md) — security headers, rate limiting, and middleware details
