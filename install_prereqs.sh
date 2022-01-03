#!/bin/bash
clear

echo "1. You must have NODE installed"
echo
echo "2. You must have DOCKER installed"
echo
echo "installing yarn, quasar and cordova..."
sudo npm install --global yarn 
yarn global add @quasar/cli cordova
