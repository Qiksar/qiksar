The app can be deployed in this folder and will be served by NGINX at app.your_domain....

If required, for testing purposes, NGNIX should have a server block that points to the 'test' folder to serve a test HTML page.
NGNIX should have a server block that points to the 'spa' folder to serve the app.