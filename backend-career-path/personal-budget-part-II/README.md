# Personal Budget - Part 2

## Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B.svg?style=for-the-badge&logo=Nodemon&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" />
  <img src="https://img.shields.io/badge/Postman-FF6C37.svg?style=for-the-badge&logo=Postman&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white" />
</div> 

## Context

Guided by Codecademy's project directives, the primary objective of this project was to strengthen database and server implementation skills. The original Personal Budget project underwent significant enhancements, with a particular focus on integrating a `PostgreSQL` database for persistent data storage.

## Project Overview

In the transition from Personal Budget - Part 1 to Part 2, the project underwent significant enhancements while retaining its core purpose of using `Node` and `Express` to develop a `RESTful API` for users to manage their budgets through **Envelope Budgeting principles**. The focus was put on using the existing endpoints and not creating new endpoints, for example, new users cannot be created at this point. Only users with an ID of 1 and 2 are available. The key modifications include:

**Database Design:**
- A database structure was devised using `PostgreSQL`, featuring distinct tables for users, budget_limits, and personal_budgets. This design enables multiple users to manage unique budgets independently. 
- Error handling mechanisms were introduced to help fortify the application against potential duplications. Functions and triggers were implemented to prevent the creation of duplicate users and enforce sensible budget limits.

**Query Refactoring:**
- The server-side logic was refactored to incorporate database queries for data retrieval and manipulation. This ensures that data persists across sessions, enhancing the overall user experience.

**User-Centric Approach:**
- The introduction of distinct tables for users and personalized budgets ensures a user-centric approach to budget management. This allows for a more tailored and individualized budgeting experience.

## How to Begin

- To start, fork and clone the repository to your local machine.
- cd into the directory
- Run `npm install` to install the dependencies of this project 
- Run `npm start` to begin your server. You'll see `Server listening on port 3000` in the terminal.
- Test the endpoints in Postman
- With the **server off** run `npm test` to run the tests

## Deployed site and server

The server and database has been deployed on Render with it's free service. The Database will be disconected after 60 days. Should the database be disconnected and you wish to access it. Please send me an email so that I can reconnect it. 

You can visit the [site here](https://personal-budget-ii-59v8.onrender.com)
  - add the endpoints or queries in the url to get data. For example `https://personal-budget-ii-59v8.onrender.com/api/envelopes/` will get all envelopes for user 1. 

## API Routes

**You can manually change the user ID using query paramaters, if it's omited user ID defaults to 1**

Example:
- `/api/envelopes?user_id=1` - Sets the user ID to 1.
- `/api/envelopes?user_id=2` - Sets the user ID to 2.

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
