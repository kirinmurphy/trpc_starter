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

## Middleware Architecture
Global security middlewares (security-headers, rate-limit, compress, in-flight-req) are applied at the `websecure` entryPoint in `traefik.yml`, so all HTTPS traffic is automatically protected.

Per-project middlewares (like `cross-origin-isolation`) are applied at the router level via Docker labels, allowing each app to control policies that depend on its specific needs:
```yaml
labels:
  - 'traefik.http.routers.app.middlewares=cross-origin-isolation@file'
```

See [vps_hardening.md](./vps_hardening.md#traefik-middleware-security) for details on each middleware.

## Access Logging
Traefik writes JSON-formatted access logs to a file at `/var/log/traefik/access.log` (volume-mounted from the host for fail2ban integration).

**What's logged:** All standard request fields are kept — client IP, method, path, status code, duration, TLS version, etc.

**What's dropped:** Request headers are dropped by default to avoid logging cookies and auth tokens. Only `User-Agent`, `Content-Type`, `X-Forwarded-For`, and `X-Real-Ip` are selectively kept.

**Viewing logs:**
```bash
# Recent access logs
docker exec traefik-proxy tail -20 /var/log/traefik/access.log

# Filter for errors (4xx/5xx)
docker exec traefik-proxy cat /var/log/traefik/access.log | jq 'select(.DownstreamStatus >= 400)'

# Filter by path
docker exec traefik-proxy cat /var/log/traefik/access.log | jq 'select(.RequestPath | startswith("/api"))'
```

## Dynamic Configuration
Traefik loads dynamic config files from `traefik/dynamic/` (watched for changes):

- **`tls.yml`** — TLS options with minimum version and cipher suite configuration (named `default` so it auto-applies to all routers)
- **`middleware.yml`** — security headers, rate limiting, compression, and in-flight request limiting (see [vps_hardening.md](./vps_hardening.md))
- **`timeouts.yml`** — forwarding timeout settings for the nginx backend

## Connecting the App
In the app's `docker-compose.production-remote.yml`, the `web` network is declared as external:
```yaml
networks:
  web:
    external: true
```

The nginx service in `docker-compose.production.yml` uses Traefik Docker labels to register itself as a routing backend. Global middlewares are inherited from the entryPoint; per-project middlewares (e.g., `cross-origin-isolation@file`) are added via router labels.
