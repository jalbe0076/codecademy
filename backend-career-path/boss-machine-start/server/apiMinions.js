const express = require('express');
const minionRouter = express.Router();
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId } = require('./db')

const modelMinions = 'minions';
const modelWork = 'work';

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

minionRouter.delete('/:minionId', (req, res, next) => {
  deleteFromDatabasebyId(modelMinions, req.minionById.id);
  res.status(204).send();
});

// work endpoints
minionRouter.get('/:minionId/work', (req, res, next) => {
  const minionWork = getAllFromDatabase(modelWork).filter(work => work.minionId === req.minionById.id);
  res.send(minionWork);
});

minionRouter.post('/:minionId/work', (req, res, next) => {
  const newWork = addToDatabase(modelWork, req.body);
  res.status(201).send(newWork);
});

minionRouter.param('workId', (req, res, next, id) => {
  const selectedWork = getFromDatabaseById(modelWork, id);
  if(!selectedWork) {
    res.status(400).send();
  } else {
    req.selectedWork = selectedWork;
    next();
  }
})

minionRouter.put('/:minionId/work/:workId', (req, res, next) => {
  if(req.selectedWork.minionId !== req.body.minionId) {
    res.status(400).send();
  } else {
    const updateWork = updateInstanceInDatabase(modelWork, req.body);
    res.status(201).send(updateWork)
  }
});

module.exports = minionRouter;