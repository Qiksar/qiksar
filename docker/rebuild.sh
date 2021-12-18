# Move to docker registry
docker pull registry.digitalocean.com/sndk8/qiktrak:latest

docker compose down --rmi all
docker compose up db auth -d

timeout 15

docker exec -u 0 -it auth bash -c "chmod a+x /docker-entrypoint-initdb.d/kc_init.sh; /docker-entrypoint-initdb.d/kc_init.sh"
docker compose up gql -d

timeout 5

docker compose up sndk8_qt 

cd ../hasura-migrations
hasura metadata apply
