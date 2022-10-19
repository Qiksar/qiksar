#!/bin/bash

# This script is to help you undersand the pre-requisites for running the Qiksar demo app
# It requires NODE and DOCKER, which provide the technical environment
#
# The reason node is required, is that the scaffold process uses, Quasar, which requires NODE.
# Docker provides the "virtual machines" that deliver the services used by the demo app, including the database and authentication capabilities.

clear

echo "1. You must have NODE installed"
[ ! "node -v" ] && echo "Node was not detected, exiting." && exit 1
[ "node -v" ] && echo "Node detected"

echo
echo
echo "2. You must have DOCKER installed"
[ ! "docker ps" ] && echo "Docker was not detected, exiting." && exit 1
[ "docker ps" ] && echo "Docker detected."

echo
echo

echo "MacOS USERS NOTE: You may have to execute this command using sudo."
echo "This is necessary to install some components globally."
echo "Press CTL-C to terminate this script and run using sudo if necessary."
echo ""
echo
read -p "Press ENTER to continue..."
echo
echo

echo "Install yarn, Quasar and Hasura CLI..."
npm i -g yarn @quasar/cli
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
