#!/bin/bash
clear

# Setup all the environment variables in the env file
echo "Import environment variables from 'services/.env'"
export $(cat services/.env | xargs)
echo

# create an empty app
quasar create app

# check for quasar upgrades then install default packages
cd app
yarn install

# Important for Quasar 2/Vue3
quasar ext add @quasar/apollo@next

# install dependencies
yarn add dotenv jest ts-jest @types/jest -D
yarn add apollo-link-ws subscriptions-transport-ws flatted keycloak-js pinia date-fns

# copy template files
cd ..
cp -R app_template/* app 
cp -Ra app_template/.quasar app 
cp -Ra app_template/.devcontainer app 
rm app/src/boot/apollo.ts

# Create the config file for Hasura
echo "Create Hasura console config"
cat app_template/.env.template \
    | sed "s|{{PUBLIC_GRAPHQL_ENDPOINT}}|$PUBLIC_GRAPHQL_ENDPOINT|" \
    | sed "s|{{PUBLIC_AUTH_ENDPOINT}}|$PUBLIC_AUTH_ENDPOINT|" \
    > app/.env
echo

echo "Scan packages for vulnerabilities"
cd app
yarn audit
cd ..

echo
echo "Scaffolding complete, move the app folder to a new location outside of the qiksar folder"
echo
echo "Refer to quasar.conf.js.example for further configuration settings"
echo