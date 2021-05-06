# Code Challenge

## Prerequisites

- Must run on Node v12 or higher.
- In order to use the local dev server, create a new MySQL database (root username, no password) called `jonogilmour_test`
- Otherwise if using a specific database, ensure the following environment variables are set for your setup:
  - `MYSQL_USER`
  - `MYSQL_PASSWORD`
  - `MYSQL_DATABASE`
  - `MYSQL_PORT`

## Starting the API server (Docker)

- `npm start` to build and run the server and database in `docker-compose` on port `4000`
- Go to http://localhost:4000/documentation to see the endpoint docs.

## Starting the API server (local)

- `npm i` to install packages
- Start the dev server (for local development) with `npm run start-dev`
- Go to http://localhost:4000/documentation to see the endpoint docs.

## Running API tests (Docker)

- Run `npm t` to run the tests using `ava` in a container.

## Running API tests (local)

- Ensure database is setup as per Prerequisites above
- `npm i` to install packages
- Run `npm run test-local` to run the tests using `ava` in the local env.
- Run `npm run testw` to run the tests in watch mode.
- Run `npm run testwfor -- 'pattern/to/testfiles'` to run only specific tests in watch mode.

## Documentation

- Run `npm run doc` to build the JSdoc documentation, which is viewable via `/doc/index.html`.
- You can also run `npm run open-doc` to open the docs in the default browser.
- Whilst the server is running, visit http://localhost:4000/documentation to see the endpoint documentation.
