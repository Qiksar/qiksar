#!/bin/bash
clear

echo "you must have NODE installed"
echo "you must have DOCKER installed"
echo
echo "installing yarn..."
npm install --global yarn
echo

echo "installing Quasar CLI"
yarn add global @quasar/cli
echo

echo "installing cordova for cross platform development"
yarn add global cordova
