# ACME Bank

## Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" />
</div> 

## Context

Guided by Codecademy's project directives, the primary objective of this project was to protect a fictional banking application from SQL Injection and Cross-Site Scripting (XSS) attacks, as well as insecure JavaScript utilizing a provided starter code.

## Project Overview

Utilizing `Node` and `Express`, I refactored the code to protect against `Cross-Site Scripting (XXS)` attacks by using `helmet`, securing cookies, validating and normalizing data with `express-validator` and implementing alternative methods to prevent DOM-Based XSS attacks. I also helped prevent SQL injection attacks by using prepared statements as well as validating inputs.

## How to Begin

- To start, fork and clone the repository to your local machine.
- cd into the directory
- Run `npm install` to install the dependencies of this project 
- Run `node app.js` to begin your server. You'll see `Server listening on port 3000` in the terminal.
- In a browser, visit `http://localhost:3000`
- Open the database `bank_sample.db` in `DB Browser` to see users and passwords so that you can login. For example user `admin` has `C0deC@demy_Rocks!` as a password.
