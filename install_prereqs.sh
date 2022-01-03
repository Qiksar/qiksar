#!/bin/bash
clear

echo "1. You must have NODE installed"
echo
echo "2. You must have DOCKER installed"
echo
echo "installing yarn, you may need to provide your password for the sudo command"
sudo npm install --global yarn 

echo
echo "installing quasar and cordova..."
yarn global add @quasar/cli cordova
