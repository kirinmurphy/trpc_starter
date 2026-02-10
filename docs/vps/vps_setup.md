# VPS Setup Instructions
Steps to deploy this app on a Digital Ocean droplet

## Droplet Creation

- Create a [Digital Ocean](https://www.digitalocean.com/) account
  - Setup droplet (1GB RAM will work, 2GB is better for performance)
  - Create SSH key on your local machine and add to droplet account

## Initial Server Setup

- SSH into the droplet as root: `ssh root@DROPLET_IP_ADDR`

- Update system packages:
  ```
  apt update && apt upgrade -y
  ```

- Install make:
  ```
  apt install make -y
  ```

- Create a non-root user with sudo privileges:
  ```
  adduser YOUR_USERNAME
  usermod -aG sudo YOUR_USERNAME
  ```

- Copy SSH authorized keys to the new user:
  ```
  mkdir -p /home/YOUR_USERNAME/.ssh
  cp ~/.ssh/authorized_keys /home/YOUR_USERNAME/.ssh/
  chown -R YOUR_USERNAME:YOUR_USERNAME /home/YOUR_USERNAME/.ssh
  ```

- Install shell (optional, zsh example):
  ```
  apt install zsh -y
  chsh -s $(which zsh) YOUR_USERNAME
  ```

- Log out and reconnect as the new user: `ssh YOUR_USERNAME@DROPLET_IP_ADDR`

## Swap Setup
Recommended for droplets with 2GB RAM or less.

```
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Verify with `swapon --show` and `free -h`.

## Unattended Security Upgrades

```
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

This enables automatic daily security updates.

## Docker Compose Plugin
Install docker compose plugin if not already included in the system packages:

```
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose
```

## Clone Repo

- Create SSH key on the droplet and add it to your GitHub account
- Clone the repo:
  ```
  cd /opt
  git clone GITHUB_REPO_URL
  ```

## Environment Variables

- Copy `.env` file from your local machine:
  ```
  scp .env YOUR_USERNAME@DROPLET_IP_ADDR:/opt/GITHUB_REPO_NAME
  ```

- Set restrictive permissions on the `.env` file:
  ```
  chmod 600 /opt/GITHUB_REPO_NAME/.env
  ```

## Domain
- Setup your domain/subdomain DNS to point to the droplet IP
- Set `WEBSITE_DOMAIN=yourdomain.com` in the `.env` file

## Run the App

```
cd /opt/GITHUB_REPO_NAME
make prod-remote-up
```

Other useful commands:
- `make prod-remote-build` — rebuild app and nginx containers
- `make prod-remote-build-no-cache` — full clean rebuild
- `make prod-remote-logs` — follow app logs
- `make prod-remote-up-fresh` — clean, build, and start from scratch

## GitHub Sync
Pull latest changes and restart:
```
cd /opt/GITHUB_REPO_NAME
git pull origin main
make prod-remote-up
```

## Traefik Install
See [traefik.md](./traefik.md) for Traefik reverse proxy setup.
