const express = require('express');
const minionRouter = express.Router();
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase } = require('./db')

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

// validate ID
minionRouter.param('minionId', (req, res, next, id) => {
  const minionById = getFromDatabaseById(modelMinions, id);
  if(!minionById) {
    res.status(404).send('No Minions have that ID');
  } else {
    req.minionById = minionById;
    next();
  }
});

minionRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minionById);
});

minionRouter.put('/:minionId', (req, res, next) => {
  if(!req.is('json')) {
    res.status(400).send();
  } else {
    const updateMinion = updateInstanceInDatabase(modelMinions, req.body);
    res.status(201).send(updateMinion);
  }
});

module.exports = minionRouter;