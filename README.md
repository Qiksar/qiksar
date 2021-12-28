# qiksar
Quick start for new Quasar apps with Hasura, PostgreSQL and Keycloak, using Pinia to support low-code data persistence based on Apollo.

# Pre-requisites

## Docker
Install docker and ensure that the docker engine runs when the user logs in

## VS Code
Install VS Code

### VS Code - Install useful extensions
#### GitHub
Work with code repositories

#### Docker
Manage the docker environment from within VS Code

#### Remote - Containers
Build your app in a development containers

#### Markdown All in One
Tools for building and reading markdown documentation

## Hasura CLI

Refer to: https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html

curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

# Build 

## Windows

The most efficient way to have a clean development environment is to use WSL2.

Start WSL2 and in your home folder create a dev folder in which your app repos can reside.

git clone your repo

Launch code from within WSL2. The benefit is that the source is located on the WSL2 filesystem and will work much faster.

Launch a terminal in VS Code whilst connected to WSL2, and execute the ```rebuild.sh``` command which will launch and configure
the relevant containers.

Once vs code is running, you can then launch the remote dev container. 
Execute the ```scaffold.sh``` command to create a new quasar app, and then overwrite the default files with template files from qiksar.

The app can be launched with ```quasar dev```

NOTE: .gitignore is configured to not commit the app folder, as this is not an asset of qiksar, rather a means of testing the
qiksar scaffold process.

