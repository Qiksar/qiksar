# Pull the latest qiktrak utility container
# This will enable us to create a database, seed it with data and track all the tables and relationships, with zero-touch
docker pull namsource/qiktrak:latest

# Tear down and rebuild the docker containers for the database and authentication
# then give the containers some time to settle
docker compose down
docker compose up db auth -d
sleep 15

# Initialise the keycloak environment
# This will create a realm for the app, and create an admin and none admin user
docker exec -u 0 -it q_auth bash -c "chmod a+x /docker-entrypoint-initdb.d/kc_init.sh; /docker-entrypoint-initdb.d/kc_init.sh"

# Start the graphql container
# then give it time to settle
docker compose up gql -d
sleep 5

# Start the qiktrak container which will configure Hasura GraphQL
# The configuration is done according to the contents of the docker/qiktrak folder 
docker compose up qiktrak 

# Start the hasura metadata console
# then give it time to settle
cd hasura/hasura-migrations
hasura console &
sleep 5

# Apply the metadata 
hasura metadata apply
