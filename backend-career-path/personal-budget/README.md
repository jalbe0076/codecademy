# Personal Budget

## Project Overview

Used node and express to implement a Rest-API with multiple endpoints allowing clients to create and manage a personal budget using Envelope Budgeting principles. The API allows users to manage budget envelopes and track the balance of each envelope. Two envelopes are created when the server is started, see below for more info on the default envelopes. Use postman or another tool to test the endpoints.

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

## How to Begin

- To start, fork and clone the repository to your local machine.
- cd into the directory
- Run `npm install` to install the dependencies of this project 
- Run `npm start` to begin your server. You'll see `Server listening on port 3000` in the terminal.
- Test the endpoints in postman

