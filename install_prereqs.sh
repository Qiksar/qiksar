#!/bin/bash

# Install pre-requisites if you are not using a VSCODE remote container as your development environment

clear

echo "1. You must have NODE installed"
echo
echo "2. You must have DOCKER installed"
echo
echo "Using npm to install yarn, quasar CLI, icon genie, and cordova, your password may be required for sudo..."
sudo npm i -g yarn @quasar/cli @quasar/icongenie cordova
