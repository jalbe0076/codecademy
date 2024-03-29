const express = require('express');
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId } = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');
const ideasRouter = express.Router();

const modelIdeas = 'ideas';

ideasRouter.get('/', (req, res, next) => {
  const allIdeas = getAllFromDatabase(modelIdeas);
  res.send(allIdeas);
});

ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
  const newIdea = req.body;
  if(!newIdea) {
    res.status(400).send('Please send a complete idea');
  } else {
    const addNewIdea = addToDatabase(modelIdeas, newIdea);
    res.status(201).send(addNewIdea);
  }
});

ideasRouter.param('ideaId', (req, res, next, id) => {
  const ideaById = getFromDatabaseById(modelIdeas, id);
  if(!ideaById) {
    res.status(404).send('No Ideas have that ID');
  } else {
    req.ideaById = ideaById;
    next();
  }
});

ideasRouter.get('/:ideaId', (req, res, next) => {
  res.send(req.ideaById);
});

ideasRouter.put('/:ideaId', checkMillionDollarIdea, (req, res, next) => {
  if(!req.is('json')) {
    res.status(404).send();
  } else {
    const updatedIdea = updateInstanceInDatabase(modelIdeas, req.body);
    res.status(201).send(updatedIdea);
  }
});

ideasRouter.delete('/:ideaId', (req, res, next) => {
  deleteFromDatabasebyId(modelIdeas, req.ideaById.id);
  res.status(204).send();
});

module.exports = ideasRouter;