# Quote API

## Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B.svg?style=for-the-badge&logo=Nodemon&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" />
  <img src="https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white" />
</div> 

## Context

Guided by Codecademy's project directives, the primary objective of this project was to acquire proficiency in building a CRUD RESTful API with `Node` and `Express`. 

## Project Overview

Using some starter code in the form of a front-end site and some `Express.js` boilerplate. I implemented a `RESTful API` designed to serve up quotes. The API allows for full CRUD functionality allowing users to get all quotes, a random quote or ot create, update or delete quotes.

## How to Begin

- Fork and clone the repository to your local machine and open the directory.  
- Run `npm install` to install the project dependencies and build the front-end application. 
- Run `node server.js` to begin your server. You'll see `Listening on PORT: 4001` in the terminal. 
- Visit `http://localhost:4001/` in Postma to test endpoints

## API Endpoints

### Routes

- `/api/quotes`
  - GET /api/quotes to get all quotes.
  - POST /api/quotes to post a new quote.
  - PUT /api/quotes to update an existing quote using the body id.
  - DELETE /api/quotes to delete an existing quote using the body id.
- `/api/quotes/random`
  - GET /api/quotes/random to get a random quote.

  ### Schema

  - type: object
    - id: number
    - quote: string
    - person: string
    