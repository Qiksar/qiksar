# Server Build

create droplet
add ssh key

setup dns
generate ssl certificate

## Update installer
apt-get update

# Upgrade packages
apt upgrade

## Install Docker
apt install docker.io
apt install docker-compose

## Install Hasura CLI
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

## Install Postgres Client
apt install postgresql-client
