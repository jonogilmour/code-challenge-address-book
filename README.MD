# Code Challenge

## Prerequisites

- Must run on Node v12 or higher.
- In order to use the local dev server, create a new MySQL database (root username, no password) called `jonogilmour_test`
- Otherwise, specify database information using the following environment variables:
  - `MYSQL_USER`
  - `MYSQL_PASSWORD`
  - `MYSQL_DATABASE`
  - `MYSQL_PORT`

## Starting the API server (Docker)

- `npm start` to build and run the server and database in `docker-compose` on port `4000`
- Go to http://localhost:4000/documentation to see the endpoint docs.

## Starting the API server (shell)

- `npm i` to install packages
- Start the dev server (for local development) with `npm run start-dev`
- Go to http://localhost:4000/documentation to see the endpoint docs.

## Running API tests

- Run `npm t` to run the tests using `ava`.

## Documentation

- Run `npm run doc` to build the JSdoc documentation, which is viewable via `/doc/index.html`
- Whilst the server is running, visit http://localhost:4000/documentation to see the endpoint documentation.
