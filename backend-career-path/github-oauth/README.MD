# GitHub OAuth 2.0

## Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" />
  <img src="https://img.shields.io/badge/Passport-34E27A.svg?style=for-the-badge&logo=Passport&logoColor=white" />
</div> 

## Context

Guided by Codecademy's project directives, the primary objective of this project was to create an application that can be authenticated by a GitHub account. Utilizing a provided starter code, the primary goal was to create an OAuth flow that connects to a GitHub account.

## Project Overview

Utilizing `Node` and `Express`, I implemented OAuth using the `express-session` module to manage user sessions authenticated using the `passport` module. `Passport` was configured using the credentials from `GitHub` and I implemented the URL routes for authentication. Finally, I implemented a middleware function to protect the route.

## How to Begin

- To start, fork and clone the repository to your local machine.
- cd into the directory
- Run `npm install` to install the dependencies of this project 
- Run `node app.js` to begin your server. You'll see `Server listening on port 3000` in the terminal.
- In a browser, visit `http://localhost:3000`
- When you are logged in, you can go to the `/account` page and see details from your GitHub account displayed.
