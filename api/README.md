# CRITICAL - Setup the .env file

In order to run the API you must:

1. Create a .env file - The best way to do this is, after building the services copy the services/.env file to the api directory 
2. Using AUTH on localhost fails because localhost in the API doesn't translate to the docker host. The best workaround is to
   point the API at the cloud deployed auth server. An env variable has already been setup for this purpose... PROD_KEYCLOAK_ENDPOINT
3. Login to keycloak (same URL as PROD_KEYCLOAK_ENDPOINT)
4. Copy the public key from the rsa-generated RS256 key and use the Public Key value to set KEYCLOAK_REALM_KEY
5. Open the app-api client, and under the Credentials tab, copy the Secret value (regenerate the secret if it is blank) then use this value to set KEYCLOAK_APICLIENT_SECRET

Use the Postman test suite to authenticate with the cloud based server, then call an API method which required the role associated with the auth token.