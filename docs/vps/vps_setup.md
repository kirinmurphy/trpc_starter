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

## SSL
- update env: `app update` 

- nginx
  - install host nginx (different from nginx in docker): `apt install nginx -y` 
  - start nginx: `sudo systemctl start nginx`
  - enable to start on boot: `sudo systemctl enable nginx`
  - confirm nginx is running: `sudo systemctl status nginx` 
  - add these to your env file 
    - `NGINX_HTTP_PORT=8080` 
    - `NGINX_HTTPS_PORT=8443`
  - create the host nginx config file 
    - `nano /etc/nginx/sites-available/GITHUB_REPO_NAME` 
    - add contents of  [Host Nginx config](#host-nginx-config)
  - enable host nginx and setup ssl with [these commands](#enable-host-nginx) 



### Host Nginx config 
```
server {
  listen 80;
  server_name WEBSITE_DOMAIN;
  
  location / {
    proxy_pass http://localhost:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

### Enable host Nginx 
```
ln -s /etc/nginx/sites-available/GITHUB_REPO_NAME /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx 

// install certbot (SSL certificate creation)
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot

// get SSL cert
certbot --nginx -d WEBSITE_DOMAIN
```
