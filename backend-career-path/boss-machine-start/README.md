# Boss Machine
<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B.svg?style=for-the-badge&logo=Nodemon&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" />
  <img src="https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white" />
</div> 

## Context

Guided by Codecademy's project directives, this project marks a significant step in reinforcing my skills in building a `RESTful API`. Utilizing a provided front-end and testing suite, the primary goal was to enhance my expertise in building a robust server with `Node` and `Express`.

## Project Overview

In this project, I crafted a comprehensive API tailored to serve information for Boss Machine a distinctive management application designed for today's most accomplished (and perhaps a bit wicked) entrepreneurs. Throughout the development, I meticulously designed routes to efficiently manage 'minions,' house brilliant 'million-dollar ideas,' and seamlessly handle the incessant meetings that find their way their busy schedule.

## How to Begin

- Fork and clone the repository to your local machine and open the directory.  
- Run `npm install` to install the project dependenciesand build the front-end application. 
- Run `npm run start` to begin your server. You'll see `Server listening on port 4001` in the terminal. 
- Visit `http://localhost:4001/#/`in your browser to visit the front end once the server is running.
- In another terminal with the server running, run `npm run test` to see a list of tests

### API Routes

- Routes live inside the **server** folder. 
- The 'database' exists in **server/db.js** and is seeded every time the server is restarted.

#### Routes Required

- `/api/minions`
  - GET /api/minions to get an array of all minions.
  - POST /api/minions to create a new minion and save it to the database.
  - GET /api/minions/:minionId to get a single minion by id.
  - PUT /api/minions/:minionId to update a single minion by id.
  - DELETE /api/minions/:minionId to delete a single minion by id.
  - `/api/minions/work`
    - GET /api/minions/:minionId/work to get an array of all work for the specified minon.
    - POST /api/minions/:minionId/work to create a new work object and save it to the database.
    - PUT /api/minions/:minionId/work/:workId to update a single work by id.
    - DELETE /api/minions/:minionId/work/:workId to delete a single work by id.
- `/api/ideas`
  - GET /api/ideas to get an array of all ideas.
  - POST /api/ideas to create a new idea and save it to the database.
  - GET /api/ideas/:ideaId to get a single idea by id.
  - PUT /api/ideas/:ideaId to update a single idea by id.
  - DELETE /api/ideas/:ideaId to delete a single idea by id.
- `/api/meetings`
  - GET /api/meetings to get an array of all meetings.
  - POST /api/meetings to create a new meeting and save it to the database.
  - DELETE /api/meetings to delete _all_ meetings from the database.

#### Schemas

- Minion:
  - id: string
  - name: string
  - title: string
  - salary: number
- Idea
  - id: string
  - name: string
  - description: string
  - numWeeks: number
  - weeklyRevenue: number
- Meeting
  - time: string
  - date: JS `Date` object
  - day: string
  - note: string
- Work:
  - id: string
  - title: string
  - description: string
  - hours: number
  - minionId: string
