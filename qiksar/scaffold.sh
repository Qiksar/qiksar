# create an empty app
quasar create app

#copy template files
cp -R ./app_template ../app 
cd app

# check for quasar upgrades then install default packages
yarn install

# Important for Quasar 2/Vue3
quasar ext add @quasar/apollo@next


quasar upgrade

# install dev dependencies
yarn add jest
yarn add ts-jest
yarn add @types/jest

# install package dependencies
yarn add apollo-link-ws
yarn add subscriptions-transport-ws
yarn add flatted
yarn add keycloak-js
yarn add pinia