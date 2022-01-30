#!/bin/sh
# run initial installation
clear
echo "Qiksar installer - runs yarn to install the base tools and packages"
echo
echo "Run base installation..."
yarn install --silent
echo 
echo "Base installation done"
echo

# install dependencies
echo
echo
echo "Install dev dependencies..."
yarn add --silent dotenv jest ts-jest @types/jest -D

echo
echo
echo "Install qiksar dependencies..."
yarn add --silent vue-i18n@next @apollo/client apollo@next apollo-link-ws subscriptions-transport-ws flatted keycloak-js pinia date-fns axios
yarn add --silent compressorjs 
yarn add --silent -D @quasar/quasar-app-extension-qmarkdown@^2.0.0-beta.2
yarn add --silent @datatraccorporation/markdown-it-mermaid
yarn add --silent apexcharts vue3-apexcharts 
yarn add --silent @quasar/extras
echo
echo

echo "Scan packages for vulnerabilities..."
yarn audit
