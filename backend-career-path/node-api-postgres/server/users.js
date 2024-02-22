const express = require('express');
const { getUsers } = require('.././db/queries');
const apiUsers = express.Router();

apiUsers.get('/', getUsers);

module.exports = apiUsers;