# Traefik implementation 
Traefik implementation for a Digital Ocean Droplet 
https://gemini.google.com/app/9b19058c7b098bfd

## Firewall Configuration 
Create a Digital Ocean Firwall (UFW)
```
ssh USERNAME@IP
----------------------
sudo ufw allow OpenSSH
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

check firewall status
```
sudo ufw status verbose 
```

## Traefik Docker Network 
Create a docker network for traefik to run on 
```
docker network create web
```

Check for the presence of this new network with 
```
docker network ls
```

## Deploy Traefik
Create a directory for Traefik configuration
```
sudo mkdir -p /opt/traefik
cd /opt/traefik
```

- Create `docker-compose.yml` and `acme.json` in `/opt/traefik` 

- Update docker-compose.production.yml to connect to the web network 

- Remove any port mappings in the nginx service config  


