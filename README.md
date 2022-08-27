![image](https://user-images.githubusercontent.com/45703746/147714202-b593e55e-7782-4dd2-9833-5823ef1bed07.png)

# INTRODUCTION - WELCOME TO QIKSAR

In order to help you explore the Quasar framework more thoroughly, you typically need a good example to learn from, and one which helps you to explore all of the common concepts, such as data storage, data access and security. 

Qiksar is a learning environment, that will give you space to explore many Quasar capabilities. A demo app enables you to understand what Qiksar does:

* How do we build a Quasar app and add the usual services like data, authentication and internationalisation?
* How do we have a code base that can run locally and in the cloud?
* Most importantly, how can we rapidly prototype our apps.

Visit the demo app in the cloud and you can see how it is available as a web app, and a PWA that can be installed on you device.

Other concepts explored in Qiksar include howto create dynamic user interfaces, which are automatically built based on the types of data your are working with.

Subscribe to our YouTube channel to learn about Qiksar and Quasar

Visit: https://www.youtube.com/channel/UCHZYiuLLj82asRqoj4tYe5A

Qiksar is constantly evolving, and it is early days now, so these videos will evolve over time as we improve our code base, documentation and getting started process.

## Learn more about Quasar

You can learn all about Quasar through the amazing online documentation.

Visit : (https://quasar.dev)


# PREPARE TO BUILD THE DEMO APP

## Pre-requisites

You will need some important pre-requisites installed, including VSCODE and Docker.

### Important - use Node LTS

Use Node LTS version which is required by some NPM packages

Refer here for how to use nvm to manage multiple node versions installed side by side:
https://blog.logrocket.com/how-switch-node-js-versions-nvm/


### Host file

You need to make your host machine available as *devhost*

This step resolves some issues with docker networking when environment variables might use *localhost*, but we want that to mean the host machine not the docker container.

Add your machine's IP address like so...

**host file**
```
Windows path: C:\Windows\System32\drivers\etc\hosts
```

```
# Make local machine available with physical IP address
# Replace 10.1.1.50 with your own IP address

10.1.1.50 devhost
```

### Docker

Install docker and ensure that the docker engine runs when the user logs in.

### VS Code

Install VS Code on your computer for the best editing experience.

## Clone the Qiksar project

**Note for Windows Users: Use Windows Subsystem for Linux.**
Open your WSL instance, and simply follow the remainder of the instructions.

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

Use your preferred method to clone the Qiksar repository. In this example we use SSH access...

```
git clone git@github.com:chrisnurse/qiksar.git 
```

## Install Command Line Tools

In the Qiksar project directory, execute:

```./install_prereqs.sh```

This command will install yarn, Quasar CLI and Hasura CLI.

## Preparation complete

At this stage you are fully prepared to follow the simple steps to build the demonstration app, including its supporting services.

# BUILD THE DEMO APP

## Build the supporting services

```
chmod u+x ./build_services.sh
./build_services.sh
```

**Note**: In the above commands, we use chmod to ensure that the `build_services.sh` script is executable.

## Scaffold a new app

You are now in the Qiksar project folder, and can execute the scaffold command:

```
chmod u+x ./scaffold.sh
./scaffold.sh ../new_app
```

The scaffold process uses Quasar CLI, which will require the following inputs...

**Project name** : enter your preferred project name

**Project product** : enter your preferred project name

**Project description** : enter a meaningful description of your project

**Author** : enter your email address, or accept the one recovered from your git configuration

**Pick your CSS preprocessor** : SCSS

**Check the features for your project** : ESLINT, TypeScript

- DO NOT SELECT any other options, as Qiksar deals with everything else.

**Select Comoposition API**

**Select Prettier**

**Select Yarn**

The app code is placed in the new_app folder. We used the ```../``` in order to place the app code in its own folder outside of the Qiksar project folder.


## Install the packages required by the demo app

```
cd new_app
chmod u+x ./qiksar_install.sh
./qiksar_install.sh
```

All of the packages required for the demo app will be installed, and the app will be ready to run locally on your computer.

## Vulnerability Scan
It is always a good idea to scan packages for vulnerabilities that might cause concern for you and your users.

The scaffold script concludes by scanning for vulnerabilities in any of the packages used.

Behind the scenes, the scaffold script executes:

```
yarn audit
```

You can do this manually at any time in the future.

Note any vulnerabilities, they do occur from time to time and you will have to determine your response to them.

## Open the app code in a remote container

Launch VS CODE

```
code .
```

VS CODE will see the presence of the .devcontainer folder, and automatically ask if you wish to reopen the folder in a remote container:

**Click "Reopen in Container"**

If an error occurs, click MORE ACTIONS and select "Rebuild Container".

VSCODE is now running and is attached to a Docker image, which is our  development environment. 

VS Code has a number of useful extensions installed and ready to use.


## Serve and test the app

Open a terminal which will now show the working folder as:
```/workspaces/app```

### Start serving the Quasar App:

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

**username**: oz_app_admin
or
**username**: scot_app_admin

**Password**: password

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
  
# Credits and Recognition

This helped understand how to provide claims to Hasura within a Keycloak token...
https://github.com/janhapke/hasura-keycloak

## Quasar
For further information, refer to: https://quasar.dev

## Hasura CLI

For further information, refer to: https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html