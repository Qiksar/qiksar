#!/bin/bash
clear

# Create the prive_data folder in which Keycloak configuration can store sensitive data.
# private_data folders are not committed to the repo.
[ ! -d "initkc/private_data" ] && mkdir -p initkc/private_data
[ -f "initkc/private_data/token.env" ] && rm -f initkc/private_data/token.env

echo "" > initkc/private_data/token.env

echo "Build environment started"
date +"%T"
echo

# Setup all the environment variables in the env file
echo "Import environment variables from './.env'"
export $(cat .env | xargs)
echo

# Create the config file for the Hasura
echo "Create nginx config"
cat initnginx/app.conf.template \
    | sed "s|{{DOMAIN}}|$DOMAIN|" \
    | sed "s|{{AUTH_CONTAINER}}|$AUTH_CONTAINER|" \
    | sed "s|{{AUTH_SERVER}}|$AUTH_SERVER|" \
    | sed "s|{{AUTH_PORT}}|$AUTH_PORT|" \
    | sed "s|{{AUTH_PORT_PUBLIC}}|$AUTH_PORT_PUBLIC|" \
    | sed "s|{{APP_CONTAINER}}|$APP_CONTAINER|" \
    | sed "s|{{APP_SERVER}}|$APP_SERVER|" \
    | sed "s|{{APP_PORT}}|$APP_PORT|" \
    | sed "s|{{APP_PORT_PUBLIC}}|$APP_PORT_PUBLIC|" \
    | sed "s|{{GQL_CONTAINER}}|$GQL_CONTAINER|"\
    | sed "s|{{GQL_SERVER}}|$GQL_SERVER|"\
    | sed "s|{{GQL_PORT}}|$GQL_PORT|" \
    | sed "s|{{GQL_PORT_PUBLIC}}|$GQL_PORT_PUBLIC|" \
    > initnginx/conf.d/app.conf
echo

# Create the config file for Hasura
echo "Create Hasura console config"
cat hasura/hasura-migrations/config.template \
    | sed "s|{{HASURA_METADATA_ENDPOINT}}|$HASURA_METADATA_ENDPOINT|" \
    | sed "s|{{HASURA_GRAPHQL_ADMIN_SECRET}}|$HASURA_GRAPHQL_ADMIN_SECRET|" \
    > hasura/hasura-migrations/config.yaml
echo


# Tear down and rebuild the docker containers for the database and authentication
# then give the containers some time to settle
echo "Stop containers"
docker compose down
echo


echo "Start database and authentication containers"
docker compose up proxy db auth -d --build
echo


# Pull the latest qiktrak utility container
# This will enable us to create a database, seed it with data and track all the tables and relationships, with zero-touch
echo "Pull qiktrak docker image"
docker pull namsource/qiktrak:latest
echo


# Initialise the keycloak environment
# This will create a realm for the app, and create an admin and none admin user
echo "Configure Keycloak"
docker exec -u 0 -it q_auth bash -c "chmod a+x /docker-entrypoint-initdb.d/kc_init.sh; /docker-entrypoint-initdb.d/kc_init.sh"
echo


# Start the graphql container
# then give it time to settle
echo "Start Hasura GraphQL container"
docker compose up gql -d --build
echo


# Start the qiktrak container which will configure Hasura GraphQL
# The configuration is done according to the contents of the docker/qiktrak folder 
echo "Execute qiktrak..."
echo "Allow Hasura container to stabilise"
sleep 10
docker compose up qiktrak 
echo

echo "Removing qiktrak container"
docker container rm qiktrak


echo
echo "Applying database migrations"
hasura --project "${PWD}/hasura/hasura-migrations" --endpoint ${HASURA_METADATA_ENDPOINT} migrate apply

echo
echo "Applying custom metadata to Hasura"
hasura --project "${PWD}/hasura/hasura-migrations" --endpoint ${HASURA_METADATA_ENDPOINT} metadata apply

echo
echo "Listing any metadata inconsistencies..."
hasura --project "${PWD}/hasura/hasura-migrations" --endpoint ${HASURA_METADATA_ENDPOINT} metadata ic list


echo 
echo "Build environment finished."
date +"%T"
echo 
echo "Check the above output for warnings and errors"
