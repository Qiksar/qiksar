#!/bin/bash
function Usage() {
    echo ""
    echo ""
    echo "Usage: scaffold PATH_TO_TARGET_DIRECTORY"
    echo ""
    echo "where:"
    echo "     PATH_TO_TARGET_DIRECTORY is a location that must not already exist"
}

clear
echo
echo
echo QIKSAR - Quasar apps at lightspeed

: ${1?"$(Usage)"}

SOURCE=${BASH_SOURCE[0]}
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )
  SOURCE=$(readlink "$SOURCE")
  [[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done

SOURCE_LOCATION=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )
TARGET=$1

[ -d $TARGET ] && echo "A folder already exists named: " $TARGET && exit 1
[ -f $TARGET ] && echo "There is an existing file named: " $TARGET && exit 1


echo
echo
echo "Scaffold new application using source files in '"${SOURCE_LOCATION}"' to create app at '"${TARGET}"'"
echo

read -p "Press enter to continue..."

echo "Create target folder..."
mkdir -p ${TARGET}
cd ${TARGET}

# Setup all the environment variables in the env file
echo "Import environment variables from 'services/.env'"
export $(cat ${SOURCE_LOCATION}/services/.env | xargs)
echo

# create an empty app
quasar create .

# run initial installation
echo
echo
echo "Install base packages"
yarn install --silent

# install dependencies
echo
echo
echo "Install dev dependencies"
yarn add --silent dotenv jest ts-jest @types/jest -D

echo
echo
echo "Install qiksar dependencies"
yarn add --silent vue-i18n@next
yarn add --silent @apollo/client 
yarn add --silent apollo@next 
yarn add --silent apollo-link-ws 
yarn add --silent subscriptions-transport-ws 
yarn add --silent flatted 
yarn add --silent keycloak-js 
yarn add --silent pinia
yarn add --silent date-fns
yarn add --silent axios

# copy template files
echo
echo
echo "copy in src folder and .devcontainer"
cp -R  ${SOURCE_LOCATION}/app_template/src/*          ${TARGET}/src
cp -Ra ${SOURCE_LOCATION}/app_template/.devcontainer  ${TARGET}

# Create the config file for Hasura
echo
echo
echo "Create Hasura console config"
cat ${SOURCE_LOCATION}/app_template/.env.template \
    | sed "s|{{PUBLIC_GRAPHQL_ENDPOINT}}|$PUBLIC_GRAPHQL_ENDPOINT|" \
    | sed "s|{{PUBLIC_AUTH_ENDPOINT}}|$PUBLIC_AUTH_ENDPOINT|" \
    > ${TARGET}/.env
echo

echo "Scan packages for vulnerabilities"
cd ${TARGET}
yarn audit

echo
echo

echo "Rename quasar.conf.js -> quasar.conf.js.keep"
mv ${TARGET}/quasar.conf.js ${TARGET}/quasar.conf.js.keep

echo "Installing the qiksar quasar.conf.js.example -> quasar.conf.js"
cp ${SOURCE_LOCATION}/quasar.conf.js.example ${TARGET}/quasar.conf.js
echo

echo "You may wish to modify the quasar config according to your 'quasar create' process."
echo
echo
echo "Qiksar scaffolding process complete!"
echo
echo "Next Steps"
echo "----------"
echo
echo "Thank you for exploring Qiksar!"
echo "Refer to the readme file for further instructions, and check back frequently as this project is frequently being updated."
echo 
echo "Checkout our YouTube channel: https://www.youtube.com/channel/UCHZYiuLLj82asRqoj4tYe5A"
echo 
echo "Remember to become a member of the Quasar community, and add your support at https://donate.quasar.dev. You'll feel good about it :)"
echo 
echo 
