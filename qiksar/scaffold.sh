# create an empty app
cd ..

quasar create app
cd app

# check for quasar upgrades then install default packages
yarn install

# Important for Quasar 2/Vue3
quasar ext add @quasar/apollo@next
quasar upgrade

# install dev dependencies
yarn add jest ts-jest @types/jest -D

# install package dependencies
yarn add apollo-link-ws subscriptions-transport-ws  flatted  keycloak-js pinia

#copy template files
cd ..
cp -R app_template/* app 