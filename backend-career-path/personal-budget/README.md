# Personal Budget - Part 1

## Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B.svg?style=for-the-badge&logo=Nodemon&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" />
  <img src="https://img.shields.io/badge/Postman-FF6C37.svg?style=for-the-badge&logo=Postman&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white" />
</div> 

## Context

Guided by Codecademy's project directives, the primary objective of this project was to acquire proficiency in building a CRUD RESTful API with `Node` and `Express`. Additionally, the project involved testing the endpoints with `Postman`.

## Project Overview

Utilizing `Node` and `Express`, I implemented a `RESTful API` designed for managing a personal budget through the principles of `Envelope Budgeting`. The API allows users to create and handle budget envelopes, tracking the balance of each envelope. The server defaults to two envelopes upon initialization, each representing a specific budget category.

## How to Begin

- To start, fork and clone the repository to your local machine.
- cd into the directory
- Run `npm install` to install the dependencies of this project 
- Run `npm start` to begin your server. You'll see `Server listening on port 3000` in the terminal.
- Test the endpoints in Postman

## API Routes

### Routes

- `/api/envelopes`
  - GET /api/envelpes to get an array of all envelopes.
  - POST /api/envelpes to create a new envelope and save it to the database.
  - `/:envId`
    - GET /api/envelpes/:envId to get a single envelope by id.
    - PUT /api/envelpes/:envId to update a single envelope by id.
    - DELETE /api/envelpes/:envId to delete a single envelope by id.
    - `/:envId/budget`
      - PUT /api/envelpes/:envId/budget to update a single envelope budget by id.
  - `/transfer/:from/:to`
    - POST /api/envelpes/transfer/:from/:to to transfer one envelope budget to another

### Schemas

- Envelopes:
  - id: string
  - title: string
  - budget: number
  - spent: number
  - balance: number

### Default Data

Groceries:
- id = 1
- title = groceries
- budget = 500
- spent = 0
- balance = 500

Dining Out:
- id = 2
- title = dining out
- budget = 300
- spent = 0
- balance = 300
