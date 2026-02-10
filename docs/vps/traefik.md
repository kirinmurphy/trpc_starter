# Traefik Implementation
Traefik reverse proxy setup for a Digital Ocean Droplet

## Architecture
Traefik runs as a standalone Docker container at `/opt/traefik`, separate from the app. It serves as the external HTTPS entry point, while nginx handles internal proxying within the app stack. They communicate over a shared Docker network (`web`).

```
Internet → Traefik (:80/:443) → [web network] → nginx (:80) → [internal_network] → app (:3000)
```

## Firewall Configuration
Setup UFW to allow only SSH, HTTP, and HTTPS:
```
sudo ufw allow OpenSSH
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Verify with:
```
sudo ufw status verbose
```

## Docker Network
Create the shared network for Traefik to communicate with app containers:
```
docker network create web
```

Verify with:
```
docker network ls
```

## Deploy Traefik

Clone the traefik repo:
```
cd /opt
git clone TRAEFIK_REPO_URL traefik
```

Create the `.env` file with `SSL_CERTIFICATION_EMAIL` and set permissions:
```
scp .env YOUR_USERNAME@DROPLET_IP_ADDR:/opt/traefik
chmod 600 /opt/traefik/.env
```

Create `acme.json` for Let's Encrypt certificate storage:
```
touch /opt/traefik/acme.json
chmod 600 /opt/traefik/acme.json
```

Start Traefik:
```
cd /opt/traefik
make up
```

## Traefik Security Configuration
The Traefik container runs with these security options (defined in `docker-compose.base.yml`):
- **`no-new-privileges: true`** — prevents privilege escalation inside the container
- **`read_only: true`** — container filesystem is read-only
- **Resource limits** — 256MB RAM, 0.25 CPU max
- **Docker socket mounted read-only** — Traefik can discover containers but can't modify Docker

## Dynamic Configuration
Traefik loads dynamic config files from `traefik/dynamic/` (watched for changes):

- **`tls.yml`** — TLS certificate paths and cipher suite configuration
- **`middleware.yml`** — security headers, rate limiting, and compression (see [vps_hardening.md](./vps_hardening.md))
- **`timeouts.yml`** — forwarding timeout settings for the nginx backend

## Connecting the App
In the app's `docker-compose.production-remote.yml`, the `web` network is declared as external:
```yaml
networks:
  web:
    external: true
```

The nginx service in `docker-compose.production.yml` uses Traefik Docker labels to register itself as a backend — no direct host port mappings needed.
