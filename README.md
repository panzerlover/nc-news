This is an API for accessing application data programmatically, mimicking a backend service.

Trello: https://trello.com/b/IwBmgZEg

To run:

Must create two .env files in the root folder, formatted as per .env-example

1. .env.development > nc-news

2. .env.test > nc_news_test

If not using a mac, .env. files must also include the password to your node-postgresql server with format PGPASSWORD=my_secret_password.

If you recieve the error "Cannot connect to database/server" you must spin up your psql server with 
```
sudo service postgresql start
```