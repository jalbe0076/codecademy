const express = require('express');
const { getAllFromDatabase, addToDatabase } = require('./db');
const { all } = require('./apiMinions');
const ideasRouter = express.Router();

const modelIdeas = 'ideas';

ideasRouter.get('/', (req, res, next) => {
  const allIdeas = getAllFromDatabase(modelIdeas);
  res.send(allIdeas);
});

ideasRouter.post('/', (req, res, next) => {
  const newIdea = req.body;
  if(!newIdea) {
    res.status(400).send('Please send a complete idea');
  } else {
    const addNewIdea = addToDatabase(modelIdeas, newIdea);
    res.send(addNewIdea);
  }
});

module.exports = ideasRouter;