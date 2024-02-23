# Node API PostgreSQL

## Project Overview

The primary objective of this project was to acquire proficiency in connecting a database to a server. The implementation involved the creation of a RESTful API using Node.js and Express, with integration to a straightforward Postgres database. Noteworthy enhancements beyond the tutorial's scope include the incorporation of robust error handling and maintaining a clear separation of concerns.

The tutorial that guided the development of this project is titled "CRUD REST API with Node.js, Express, and PostgreSQL," authored by Tania Rascia. You can access the tutorial [here](https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/).

### Routes

- `/users`
  - GET /users to get an array of all users.
  - `/:id`
    - GET /users/:id to get a single user by id.
    - PUT /users/:id to update a single user by id.
    - DELETE /users/:id to delete a single user by id.

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

