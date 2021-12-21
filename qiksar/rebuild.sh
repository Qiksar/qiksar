#!/bin/bash
clear

# Setup all the environment variables in the env file
echo "Import environment variables from 'local.env'"
export $(cat local.env | xargs)
echo


# Create the config file for the Hasura
echo "Create Hasura console config"
cat hasura/hasura-migrations/config.template | sed "s|{{HASURA_GRAPHQL_CONSOLE}}|$HASURA_GRAPHQL_CONSOLE|" | sed "s|{{HASURA_GRAPHQL_ADMIN_SECRET}}|$HASURA_GRAPHQL_ADMIN_SECRET|" > hasura/hasura-migrations/config.yaml
echo


# Tear down and rebuild the docker containers for the database and authentication
# then give the containers some time to settle
echo "Stop containers"
docker compose down
echo


echo "Start database and authentication containers"
docker compose up db auth -d
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
docker compose up gql -d
echo


# Start the qiktrak container which will configure Hasura GraphQL
# The configuration is done according to the contents of the docker/qiktrak folder 
echo "Execute qiktrak..."
echo "Allow Hasura container to stabilise"
sleep 10
docker compose up qiktrak 
echo

echo
echo "Applying custom metadata to Hasura"
hasura --project "${PWD}/hasura/hasura-migrations" --endpoint ${HASURA_GRAPHQL_CONSOLE} metadata apply

echo
echo "Listing any metadata inconsistencies..."
hasura --project "${PWD}/hasura/hasura-migrations" --endpoint ${HASURA_GRAPHQL_CONSOLE} metadata ic list

echo
echo "Build process finished. Check the above output for warnings and errors"
