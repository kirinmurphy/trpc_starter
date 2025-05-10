# VPS Setup Instructions
Steps to deploy this app on a  Digital Ocean droplet

## App Install 

- create a [Digital Ocean](https://www.digitalocean.com/) account 
  - setup droplet (1GM RAM will work, 2G will better for performance)
  - create SSH key on your local machine and add to droplet account  

- setup droplet environment 
  - update: `apt update && apt upgrade -y`
  - install make: `apt install make -y` 

- install docker compose plugin if not already installed (currently not included in the ubuntu package)
  - `mkdir -p ~/.docker/cli-plugins/` 
  - `curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose` 
  - `chmod +x ~/.docker/cli-plugins/docker-compose` 

- clone repo
  - create SSH key in linux environment and paste SSH key in github account
  - create a directory for project files - `mkdir -p /opt`
  - `cd /opt` 
  - `git clone GITHUB_REPO_URL` 

- create `.env` file in repo
  - from the directory of the local env run 
    - `scp .env root@DROPLET_IP_ADDR:/opt/GITHUB_REPO_NAME`

- run the app
  - ssh into the droplet 
  - `cd opt/GITHUB_REPO_NAME` 
  - set to run docker in detached mode (optional): `sed -i 's/$(DCP) up/$(DCP) up -d/g' Makefile` 
  - `make prod-up` 
  
## Domain
- Setup your domain/subdomain to point to your Digital Ocean IP
- set env var `WEBSITE_DOMAIN=yourdomain.com` 

## Github Sync
in `/opt/trpc_starter` run `git pull origin main`

## Traefik Install 
- update env: `app update` 
