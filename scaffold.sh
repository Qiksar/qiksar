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

echo "Qiksar"
echo
echo "Quasar apps at lightspeed"
echo "-------------------------"

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
echo "Scaffold new application using source files in '"${SOURCE_LOCATION}"' to create a new app at '"${TARGET}"'"
echo
echo "Follow these simple steps:"
echo
echo "STEP ONE   - Begin by execute the build_services.sh script to automatically build all of the services used by the app"
echo "             If you have not done this yet, just terminate this script (CTRL-C), build the services, then start this script again"
echo
echo "STEP TWO   - Use this Qiksar scaffolding script, which will invoke Quasar CLI to create the base application."
echo "             This script will copy all of the demo source files into your new app directory."
echo
echo "STEP THREE - Start VSCODE and use the dev container, then in a terminal session, execute qiksar_install.sh to install tools and packages"
echo
echo "STEP FOUR  - Finally, serve your new app with: quasar dev"
echo
echo
echo "If you have not built the services, press CTRL-C to exit"
read -p "If you have built the services, press ENTER to continue..."


echo
echo
echo "Create target folder..."
mkdir -p ${TARGET}
cd ${TARGET}


echo
echo
echo "Import environment variables from 'services/.env'"
export $(cat ${SOURCE_LOCATION}/services/.env | xargs)


echo
echo
echo "Invoke the Quasar CLI"
echo
echo "IMPORTANT - When prompted, the only FEATURES you need to select are ESLINT and Typescript."
echo "Do not select any others as Qiksar takes care of everything else."
echo "Other than the features, you simply press ENTER to accept the Quasar defaults"
quasar create .

echo
echo
echo "Copy the Qiksar installer (qiksar_install.sh) to the app root"
cp ${SOURCE_LOCATION}/qiksar_install.sh ${TARGET}

echo
echo "Copy src folder"
cp -R  ${SOURCE_LOCATION}/app_template/src/*          ${TARGET}/src

echo
echo "Copy remote dev container config "
cp -Ra ${SOURCE_LOCATION}/app_template/.devcontainer  ${TARGET}

echo
echo "Rename quasar.conf.js -> quasar.conf.js.keep"
mv ${TARGET}/quasar.conf.js ${TARGET}/quasar.conf.js.keep

echo
echo "Installing sample config - quasar.conf.js.example -> quasar.conf.js"
cp ${SOURCE_LOCATION}/quasar.conf.js.example ${TARGET}/quasar.conf.js

echo
echo "Installing quasar.extensions.json"
cp ${SOURCE_LOCATION}/app_template/quasar.extensions.json ${TARGET}/quasar.extensions.json

echo
echo "Installing tsconfig.json"
cp ${SOURCE_LOCATION}/app_template/tsconfig.json ${TARGET}/tsconfig.json


echo "Cleanup obsolete files"
rm ${TARGET}/src/components/models.ts 
rm ${TARGET}/src/components/CompositionComponent.vue 
rm ${TARGET}/src/router/routes.ts 

echo
echo Installing app packages...
cd ${TARGET}
chmod u+x ./qiksar_install.sh
./qiksar_install.sh

echo
echo
echo "Qiksar scaffolding process complete!"
echo
echo "Thank you for exploring Qiksar!"
echo
echo "- Checkout our YouTube channel: https://www.youtube.com/channel/UCHZYiuLLj82asRqoj4tYe5A"
echo "- Refer to the readme file for further instructions, and check back frequently as this project is frequently being updated."
echo 
echo 
echo "Remember to become a member of the Quasar community, and add your support at https://donate.quasar.dev. You'll feel good about it :)"
echo 
echo 

read -p "Press CTRL-C to end the process, or ENTER to run the new app..."
quasar dev