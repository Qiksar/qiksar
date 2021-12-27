cd ..

# Setup all the environment variables in the env file
echo "Import environment variables from 'local.env'"
export $(cat services/.env | xargs)
echo

# create an empty app
quasar create app
cd app

# check for quasar upgrades then install default packages
yarn install

# Important for Quasar 2/Vue3
quasar ext add @quasar/apollo@next
quasar upgrade

# install dev dependencies
yarn add dotenv jest ts-jest @types/jest -D

# install package dependencies
yarn add apollo-link-ws subscriptions-transport-ws  flatted  keycloak-js pinia

#copy template files
cd ..
cp -R app_template/* app 
rm app/src/boot/apollo.ts

# Create the config file for Hasura
echo "Create Hasura console config"
cat app_template/.env.template \
    | sed "s|{{HASURA_METADATA_ENDPOINT}}|$HASURA_METADATA_ENDPOINT|" \
    | sed "s|{{KEYCLOAK_AUTH_ENDPOINT}}|$KEYCLOAK_AUTH_ENDPOINT|" \
    > app/.env
echo
