# CRITICAL - Setup the .env file

In order to run the API you must create a .env file

The best way to do this is after building the services, link the .env file from the services folder to the api folder like so:

```
ln ~/qiksar/services/.env ./.env
```

This approach ensures that the API uses the same configuration as the services to which it connects.
