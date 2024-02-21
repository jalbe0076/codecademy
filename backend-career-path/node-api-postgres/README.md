# Node API PostgreSQL

## Project Overview

This project was built with the main purpose to learn how to connect a Database to a Server. Created a RESTful API using node and express and connected to a simple Postgres database. The tutorial used for this was named `CRUD REST API with Node.js, Express, and PostgreSQL` by `Tania Rascia` and can be found [here](https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/).

### Routes

- `/api/envelopes`
  - GET /api/envelpes to get an array of all envelopes.
  - POST /api/envelpes to create a new envelope and save it to the database.
  - `/:envId`
    - GET /api/envelpes/:envId to get a single envelopes by id.
    - PUT /api/envelpes/:envId to update a single envelopes by id.
    - DELETE /api/envelpes/:envId to delete a single envelopes by id.
    - `/:envId/budget`
      - PUT /api/envelpes/:envId/budget to update a single envelopes budget by id.
  - `/transfer/:from/:to`
    - POST /api/envelpes/transfer/:from/:to to transfer one envelopes budget to another

### Schemas

- users:
  - id: serial
  - name: varchar(30)
  - email: varchar(30)

## How to Begin

- To start, fork and clone the repository to your local machine.
- cd into the directory
- Run `npm install` to install the dependencies of this project 
- Run `node index.js` to begin your server. You'll see `Server listening on port 3000` in the terminal.
- Test the endpoints in postman

