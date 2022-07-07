
# News Database


## Overview

This is an API for accessing a database of articles, users, and comments, mimicking the backend api of a news or social media website, such as Reddit.
  
## Using the API

[Link to Hosted Service](https://joseph-craven-newsapp.herokuapp.com/)

Currently this API is a backend service only - that means the above link opened in a browser will only display the JSON objects that would normally be handled by the frontend service. You can still try out some of the endpoints using your regular browser, however it is recommended to use a API platform such as [Postman](https://www.postman.com/), or [Thunder Client](https://www.thunderclient.com/) 

[Copy/pase this link into your API Platform and send a GET request to see a list of available endpoints](https://joseph-craven-newsapp.herokuapp.com/api)

## Installing Locally


### NPM packages

Once forked/clone, open the file and enter `npm install` in the console to install all needed packages.This project was written using node v16.15.1 and functionality in older versions is not gauranteed.

To check your version of node, enter `node --version` in the terminal. If nvm is installed you can switch to a newer version with `nvm use 16`. 

### PostgreSQL

The databases are run on PostgreSQL, which must be installed before the databases can be hosted locally. Further information can be found [on the PostgreSQL website](https://www.postgresql.org/)

This project was written with PostgreSQL 10.21 and functionality in older versions is not guaranteed. To check your version of PostgreSQL enter the below into your terminal:

```
psql
SELECT version();
```

### Testing 

The database will automatically be seeded before each test, so a local install is not neccessary. Tests are run with jest, and can be filtered by adding .only to a desired describe block, or via the CLI with `npm test <text to filter>` or `npm t <text to filter>` e.g. `npm t app` to run only the tests in app.test.js. To run all tests, enter `npm test` in the terminal.

### Hosting the Database Locally

If you still wish to install the databases locally, there are scripts included in the package.json to make this simpler. 

to create the databases:
```
npm run setup-dbs
```
to seed the test database
```
npm run seed-test
```
to seed the dev database

```
npm run seed-dev
```

### ERROR: Cannot connect to database/server"

If you recieve the error "Cannot connect to database/server" you must spin up your psql server first with the below command

```
sudo service postgresql start
```

### Husky


This project uses Husky to automatically install git hooks. This will prevent any commits or pushes if any of the test suites fail.

### DOTENV

This project uses the dotenv package to set local environment variable programatically. This allows us to query a test database to improve the performance of the tests.

For the tests to run, you ___must___ create two .env files in the root folder, formatted as per the included .env-example in root

1  .env.development 
 
 - change *my_database_name* to nc_news

2  .env.test > nc_news_test

- change *my_database_name* to nc_news_test

If you are not using a mac, .env. files must also include the password to your node-postgresql server with format PGPASSWORD=my_secret_password.

