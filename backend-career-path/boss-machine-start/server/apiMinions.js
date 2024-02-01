const express = require('express');
const minionRouter = express.Router();
const { getAllFromDatabase, addToDatabase } = require('./db')

const modelMinions = 'minions';

minionRouter.get('/', (req, res, next) => {
  const allMinions = getAllFromDatabase(modelMinions);
  res.send(allMinions);
});

minionRouter.post('/', (req, res, next) => {
  const newMinion = req.body;
  if(!newMinion) {
    res.status(400).send();
  } else {
    const createdMinion = addToDatabase(modelMinions, newMinion);
    res.status(201).send(createdMinion);
  }
});

module.exports = minionRouter;