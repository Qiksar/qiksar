#!/bin/bash
clear

# Create the prive_data folder in which Keycloak configuration can store sensitive data.
# private_data folders are not committed to the repo.
[ ! -d "initkc/kc_data/private_data" ] && mkdir -p initkc/kc_data/private_data
[ -f "initkc/kc_data/private_data/token.env" ] && rm -f initkc/kc_data/private_data/token.env

echo "" > initkc/kc_data/private_data/token.env


echo "Build environment started"
date +"%T"
echo


# Setup all the environment variables in the env file
echo "Transform environment variables from './template.env'"
bash -c 'export $(cat template.env | xargs) && (echo "cat << EOF" ; cat template.env ; echo EOF ) | sh > .env'
cat ./initkc/kc_data/private_data/realm_public_key.env >> .env


echo "Import environment variables from './.env'"
export $(cat .env | xargs)
echo


# Tear down and rebuild the docker containers for the database and authentication
# then give the containers some time to settle
echo "Stop containers"
docker-compose down
echo


#
# PRE-BUILD SCRIPT - THIS WILL LIKELY ONLY HAVE COMMANDS IN IT THAT ARE TO DO WITH PROVISIONG CLOUD BASED RESOURCES
#
echo "Execute the pre-build script"
chmod u+x ./pre-build.sh
bash -c ./pre-build.sh
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
    | sed "s|{{HASURA_CLI_ENDPOINT}}|$HASURA_CLI_ENDPOINT|" \
    | sed "s|{{HASURA_GRAPHQL_ADMIN_SECRET}}|$HASURA_GRAPHQL_ADMIN_SECRET|" \
    > hasura/hasura-migrations/config.yaml
echo

echo "Start database and authentication containers"
docker-compose up -d --quiet-pull --build db auth 
echo


# Initialise the keycloak environment
# This will create a realm for the app, and create an admin and none admin user
echo "Configure Keycloak"
docker exec -u 0 q_auth bash -c "chmod a+x /kc_init.sh; bash -c /kc_init.sh"
echo


# Start the graphql container
# then give it time to settle
echo "Start Hasura GraphQL container"
docker-compose up -d --quiet-pull --build proxy gql
echo "Allow Hasura container to stabilise"
sleep 15
echo
echo


echo "Applying database migrations"
hasura --project "${PWD}/hasura/hasura-migrations" --endpoint ${HASURA_CLI_ENDPOINT} migrate apply



# If hasura metadata has not been initialised then run qiktrak to create the initial setup, then export metadata that qiktrak creates
[ ! -f "hasura/hasura-migrations/metadata/databases/default/tables/tables.yaml" ] && echo "Execute qiktrak..." && docker-compose up --quiet-pull qiktrak && echo "Removing qiktrak container" && docker container rm qiktrak && echo "Exporting base metadata" && export_gql_metadata.sh

echo
echo
echo "Applying GraphQL metadata"
hasura --project "${PWD}/hasura/hasura-migrations" --endpoint ${HASURA_CLI_ENDPOINT} metadata apply

echo
echo "Listing any metadata inconsistencies..."
hasura --project "${PWD}/hasura/hasura-migrations" --endpoint ${HASURA_CLI_ENDPOINT} metadata ic list


echo 
echo "Build environment finished."
date +"%T"
echo 
echo "Check the above output for warnings and errors"
