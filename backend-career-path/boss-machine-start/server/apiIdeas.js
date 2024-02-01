const express = require('express');
const { getAllFromDatabase } = require('./db');
const { all } = require('./apiMinions');
const ideasRouter = express.Router();

const modelIdeas = 'ideas';

ideasRouter.get('/', (req, res, next) => {
  const allIdeas = getAllFromDatabase(modelIdeas);
  res.send(allIdeas);
})

module.exports = ideasRouter;