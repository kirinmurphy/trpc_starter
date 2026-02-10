# VPS Security Hardening

## File Permissions
Sensitive files should have owner-only read/write (`600`):
```
chmod 600 /opt/trpc_starter/.env
chmod 600 /opt/traefik/.env
chmod 600 /opt/traefik/acme.json
```

## Unattended Security Upgrades
Automatic daily security updates are enabled via `unattended-upgrades`. See [vps_setup.md](./vps_setup.md#unattended-security-upgrades) for installation.

## Traefik Container Security
The Traefik container runs with hardened defaults. See [traefik.md](./traefik.md#traefik-security-configuration) for details.

## Traefik Middleware Security

Traefik middlewares are defined in `traefik/dynamic/middleware.yml` (local) and `/opt/traefik/traefik/dynamic/middleware.yml` (remote). Both should be kept in sync.

Middlewares are applied at the **entryPoint level** in `traefik.yml` on the `websecure` entryPoint, so they are automatically enforced on all HTTPS traffic — individual apps do not need to reference them via Docker labels.

```yaml
entryPoints:
  websecure:
    address: ":443"
    http:
      middlewares:
        - security-headers@file
        - rate-limit@file
        - compress@file
```

### security-headers
Adds HTTP response headers to protect against common web attacks:
- **Strict-Transport-Security** (`stsSeconds: 63072000`) — forces HTTPS-only for 2 years, including subdomains, with preload eligibility
- **X-Content-Type-Options: nosniff** — prevents browsers from MIME-type sniffing, forcing them to trust the declared Content-Type
- **X-Frame-Options: DENY** — blocks the site from being embedded in iframes (clickjacking protection)
- **Referrer-Policy: strict-origin-when-cross-origin** — only sends the origin (not full path) when navigating to external sites
- **X-XSS-Protection: "0"** — disables the legacy browser XSS auditor (deprecated, itself exploitable; modern protection comes from CSP)
- **Permissions-Policy** — blocks access to camera, microphone, and geolocation APIs

### rate-limit
Throttles incoming requests per client:
- 100 requests/second sustained, with bursts up to 150
- Exceeding the limit returns `429 Too Many Requests`
- Protects against brute-force and basic DoS attacks

### compress
Enables gzip/brotli compression on responses based on the client's `Accept-Encoding` header. Reduces bandwidth and improves load times.

## TODO
- [ ] Disable root SSH login (`PermitRootLogin no`)
- [ ] Disable password authentication (`PasswordAuthentication no`)
- [ ] Install and configure fail2ban for SSH brute-force protection
