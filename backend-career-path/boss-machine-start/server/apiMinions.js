const express = require('express');
const minionRouter = express.Router();
const { getAllFromDatabase } = require('./db')

const modelMinions = 'minions';

minionRouter.get('/', (req, res, next) => {
  const allMinions = getAllFromDatabase(modelMinions);
  res.send(allMinions);
})

module.exports = minionRouter;