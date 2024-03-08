# Orders

## Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Swagger-85EA2D.svg?style=for-the-badge&logo=Swagger&logoColor=black" />
  <img src="https://img.shields.io/badge/OpenAPI%20Initiative-6BA539.svg?style=for-the-badge&logo=OpenAPI-Initiative&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B.svg?style=for-the-badge&logo=Nodemon&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" />
  <img src="https://img.shields.io/badge/GitHub-181717.svg?style=for-the-badge&logo=GitHub&logoColor=white" />
</div> 

## Context

Guided by Codecademy's project directives, the purpose of this project was to build an API from scratch using the Design-First API development approach and open-source Swagger tooling. The starter code was provided, enabeling me to focus on the learning objectives of utilising `Swagger Editor` and the `OpenAPI specification`. 

## Project Overview
 
In this project, `Swagger` was used to create an API contract in `.yaml`format. This helped facilitate the structured definition of paths and operations and integration of the `OpenAPI specification`. Using a Design-First philosophy, I conceptualized the API's structure before moving into the code implementation. Using the API contract as a guide, I implemented GET, POST, PUT and DELETE operations in `Node`using `Express`.

## How to Begin

- Fork and clone the repository to your local machine and open the directory.  
- The API contract can be viewed in `openapi.yaml`
- Run `npm install` to install the project dependencies. 
- Run `npm start` to begin your server. You'll see `Express server started at port 3000` in the terminal. 
- Test the endpoints using `postman`or other similar tools

## API

### Routes

- `/orders`
  - GET /orders to get all of the orders.
- `/neworder`
  - POST /neworder to add a new order.
- `/update`
  - PUT /update/:id to update the state of an order.
- `/delete`
  - PUT /delete/:id to delete an order.
 
### Schemas

  - Order:
    - type: object
    - properties:
      - name:
        - type: string
      - id:
        - type: string
      - state:
        - type: string
    - xml:
      - name: Order