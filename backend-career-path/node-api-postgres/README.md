# Node API PostgreSQL

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white" />
  <img src="https://img.shields.io/badge/Postman-FF6C37.svg?style=for-the-badge&logo=Postman&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white" />
</div> 

## Context

Guided by Codecademy's project directives, the primary objective of this project was to acquire proficiency in connecting a database to a server. The implementation involved the creation of a RESTful API using `Node.js` and `Express`, with integration to a straightforward `Postgres` database.

The tutorial that guided the development of this project is titled "CRUD REST API with Node.js, Express, and PostgreSQL," authored by Tania Rascia. You can access the tutorial [here](https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/).

## Project Overview

In this project, I implemented noteworthy enhancements beyond the tutorial's scope to include the incorporation of robust error handling and maintaining a clear separation of concerns. The core implementation includes setting up a `PostgreSQL` database to store user data and establishing a server with `Node.js` and `Express`. This enables the execution of `GET`, `POST`, `PUT`, and `DELETE` `CRUD` operations on the `API`.

## How to Begin

** To run and test code a simple database with a table called users will need to be created on your end to test, ensure the table follows the schema **
- To start, fork and clone the repository to your local machine.
- cd into the directory
- Run `npm install` to install the dependencies of this project 
- Run `node index.js` to begin your server. You'll see `Server listening on port 3000` in the terminal.
- Test the endpoints in Postman or similar tool

## API Routes

### Routes

- `/`
  - GET / display homepage message.
- `/users`
  - GET /users to get an array of all users.
  - GET /users/:id to get a single user by id.
  - POST /users to create a user.
  - PUT /users/:id to update a single user by id.
  - DELETE /users/:id to delete a single user by id.

### Schemas

- users:
  - id: serial
  - name: varchar(30)
  - email: varchar(30)


