clear

# Setup all the environment variables in the env file
echo "Import environment variables from 'local.env'"
export $(cat local.env | xargs)
echo

# Create the config file for the Hasura
echo "Create Hasura console config"
cat hasura/hasura-migrations/config.template | sed "s|{{HASURA_GRAPHQL_CONSOLE}}|$HASURA_GRAPHQL_CONSOLE|" | sed "s|{{HASURA_GRAPHQL_ADMIN_SECRET}}|$HASURA_GRAPHQL_ADMIN_SECRET|" > hasura/hasura-migrations/config.yaml
echo

# Pull the latest qiktrak utility container
# This will enable us to create a database, seed it with data and track all the tables and relationships, with zero-touch
echo "Pull qiktrak docker image"
docker pull namsource/qiktrak:latest
echo

# Tear down and rebuild the docker containers for the database and authentication
# then give the containers some time to settle
echo "Stop containers"
docker compose down
echo

echo "Start database and authentication containers"
docker compose up db auth -d

echo "Wait for containers to stabilise"
sleep 15
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
sleep 5
echo

# Start the qiktrak container which will configure Hasura GraphQL
# The configuration is done according to the contents of the docker/qiktrak folder 
echo "Execute qiktrak..."
docker compose up qiktrak 
echo

echo "Applying metadata doesn't seem to work from this shell script"
echo "Execute the following commands to apply the Hasura metadata"
echo
echo "cd hasura/hasura-migrations"
echo "hasura metadata apply"
echo
echo "Build script complete"
echo