![image](https://user-images.githubusercontent.com/45703746/147714202-b593e55e-7782-4dd2-9833-5823ef1bed07.png)

# WELCOME TO QIKSAR

**Quasar Apps powered by Postgres, Hasura GraphQL, Keycloak and Pinia**

Qiksar supports learning, helping you to build Quasar apps faster, securely connected to data through a moden GraphQL interface with minimal code.


## Getting Started Videos

Introduction - https://www.youtube.com/watch?v=ti72vq3aqZw 
Building a fully functioning prototype app with login, and data storage


Smart Data   - https://www.youtube.com/watch?v=GLBG6BNlRqc
How Qiksar dynamically builds the user interface, and even translates data to foreign languages



# Introduction

Qiksar is intended to help you get the most from Quasar (https://quasar.dev), by helping you get a functional app running in minutes, so then you can explore all the features of Quasar without having to worry about how to store data, handle users logging in etc. Something that always frustrates a learning journey is when the most important pieces are missing, such as authentication, security and data storage. Qiksar provides you with all the things you need to get up and running on your PC or Mac, and you don't have to sign up for ANY cloud services.


## Motivation

The motiviation for this project was to be able to rapidly create a Quasar development environment, with related data and authentication services. It was also highly desirable to have no external dependencies on Cloud based services, e.g. Firebase. Everything will run on your computer, and everything will run identically on Windows or Mac development platforms.


## Example of the Objective

Once the detailed instructions below have been followed to completion, you will be able to use your browser to use a Quasar App which manages an imaginary organisation which has a number of members, where the members are placed in specified groups. You can maintain the groups, assign members to groups and maintain the status of members. 

![image](https://user-images.githubusercontent.com/45703746/147625282-fe470734-7933-40ff-be9f-532b0811c7a7.png)


### Pre-requisites


#### Docker

Install docker and ensure that the docker engine runs when the user logs in.


#### VS Code

Install VS Code


# Build Process for Mac

The process is identical to the windows build process described below, simply ignore any references to the Windows Subsystem for Linux (WSL).

So for example, you can simply open the terminal, create a ```development``` folder, and clone the Qiksar git repository and be underway in minutes!


# Build Process for Windows

Open WSL2 and install the Hasura CLI...


## Install Hasura CLI

For further information, refer to: 
https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html

To install, execute the following command...

```
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
```


## Check the location where you will clone the Qiksar Repo

Ensure you are in your home folder:

```
cd ~
```

or...

If you prefer all of your projects to be in a dev folder:

```
cd ~
mkdir dev
cd dev
```


## Clone the Qiksar repository from github

```
git clone git@github.com:chrisnurse/qiksar.git 
```

As the source code is now in the WSL filesystem, VS Code will be extremely quick when using remote dev containers.


## Launch VS CODE in WSL

cd qiksar
code .

We are now in VS CODE with a remote connection to WSL filesystem where our code is located. 
This means, the entire project structure and build tools work the same on Mac and Windows. So you can also do cross-platform development on any computer you prefer.

The qiksar project is maintained directly whilst using VSCODE in WSL as this has access to the repo via SSH, as this is how the source code was cloned from GitHub.


## Build the supporting services for Data and Auth

In VS CODE, open a terminal and ensure you are in the root of the qiksar project and can see a folder called
services. Now build the services (Docker containers), which includes postgreSQL, Hasura GraphQL and Keycloak:

```
cd services
chmod u+x ./rebuild.sh
./rebuild.sh
```

Note: In the above commands, we use chmod to ensure that the shell script is executable.


### Windows DNS (hosts file)

On Windows it is possible to edit the hosts file in ```C:\Windows\System32\drivers\etc\hosts```
and add the following entries:

```
# app development
127.0.0.1 login.localhost
127.0.0.1 graphql.localhost
# end app development
```

 This step makes the app feel more like it is consuming services from remote locations, as we would typically use services in locations like, ```auth.awesome-app.com```.

 Changes need to be made to ** quasar.conf.js ** to point the user interface to the correct service locations.


## SCAFFOLD A NEW APP

Once the services are rebuilt, we now need to open the project as a remote container in VS CODE. Doing so, creates a docker image with Quasar and Cordova installed.
A number of useful VS Code plugins are also installed.

In the bottom left corner, we can click on the green container box which currently shows WSL, and opens the command palette.
Select "Reopen in Container (Remote-Containers)"

The first time this is done, the container will be built. 

If the ```devcontainer.json``` file is ever modified, or is out of sync with the current container image for any reason, VS CODE will offer you the option to rebuild the container. 

Note: Be cautious in case there are any unsaved changes to your source code which might be at risk. This shouldn't be the case, but better to be safe than sorry, and make sure you preserve any changes.


## Use the Qiksar Scaffold process to allow us to use our containerised services
Once the remote container has launched, in the VS Code Explorer, you will see the app_template folder and the scaffold.sh script.

Open a terminal and ensure you are in the root of the qiksar project and can see the script file:
scaffold.sh

It may also be necessary to ensure that there is no current "app" folder, which would be the case if you have execute the scaffold process previously. 
If you wish to re-scaffold a clean app, simply remove or rename the folder so you can use your preferred app name


## Ensure the SCAFFOLD script has execute permission, then run it
chmod u+x scaffold.sh
scaffold.sh

The QUASAR CLI will execute and require some inputs:

Note: Before proceeding, inside WSL, you may also prefer to configure your git options with your default name and email address:

```
git config --global user.name "My Name"
git config --global user.email "my.name@emailaddress.com"
```

Quasar CLI will require the following inputs...

**Project name** : enter your preferred project name
**Project product** : enter your preferred project name
**Project description** : enter a meaningful description of your project
**Author** : enter your email address, or accept the one recovered from your git configuration

**Pick your CSS preprocessor** : SCSS
**Check the features for your project** : ESLINT, TypeScript, Axios and vue-i18n - DO NOT SELECT Vuex because we use Pinia by default
**Select Comoposition API**
**Select Prettier**
**Select Yarn**

Quasar will now create the default APP template and the neccessary packages will be installed
You can safely ignore any warnings about dependencies and versions, for now.

When asked, Does your app have typescript support? input Y and press enter


## Vulnerability Scan
It is always a good idea to scan packages for vulnerabilities that might cause concern for your and your users.

After a few moments the scaffold script will conclude by automatically scanning for vulnerabilities in any of the packages used.

This is done by executing:

```
yarn audit
```

So you can do this at any time in the future.

Note any vulnerabilities, they do occur from time to time and you will have to determine your response to them.


## Prepare to run the new QUASAR APP

At this point the app folder contains a fully functioning Quasar App, and the services for the database, graphql and login are all running.


### Check the docker container services are running

To confirm, as we are currently in WSL, where we executed the services rebuild.sh script, you can enter:
docker ps

The status column for q_gql, q_auth and q_db will all show as "UP".


### Move the scaffolded app folder

At this point it is probably most wise to close VSCODE, and then just run WSL in Windows, because we now need to move the folder container the app code, out to its own isolated location.

In WSL change to the location of the folder where we cloned the github repo:
cd ~/qiksar

Check the app folder exists:
ls app

Return to the root folder in which the qiksar folder is located
cd ~

Move the app folder to the same level:
mv qiksar/app .


## Open the app code in a remote container

Launch VS CODE

```
cd app
code .
```

VS CODE will see the presence of the .devcontainer folder, and automatically ask if you wish to reopen the folder in a remote container:
Click "Reopen in Container"

If an error occurs, click MORE ACTIONS and select "Rebuild Container"

VSCODE is now running and is attached to a Docker image, which is now our source folder and development environment. VS Code has a number of useful extensions installed.


### Serve and test the app

Open a terminal which will now show the working folder as:
/workspaces/app

Start serving the Quasar App:
```
quasar dev
```


### Bypass SSL security warnings in development mode 

When the app launches, in Chrome, if you see "Your connection is not private", use the ADVANCED button and select "Proceed to localhost (unsafe)".
The error appears because of the need for valid SSL certificates, but we are in developer mode, so this is less important.

In your browser, the app is running and connected to the service containers:

```
https://localhost:8080/ 
```

Click the **LOGIN** BUTTON

Login with:

```
app_admin@localhost
Password: password
```

Use the follwing buttons on the home screen to maintain the different types of data:

* Maintain Tenants
* Maintain Members
* Maintain Groups
* Maintain Roles
* Maintain Status


# Deploy to Digital Ocean

## This is a work in progress

Currently documented for Digital Ocean

* Setup the template.env with the target environment settings and passwords
* Register a domain
* Setup DNS
* Create a Database Cluster
* Create a virtual machine
* Run the server preparation scripts
* Put the source on to the server
* Rebuild the services
  