const express = require('express');
const apiEnvelopes = express.Router();
const { envelopes, createEnvelope, findInstanceById } = require('./db');

apiEnvelopes.get('/', (req, res) => {
  res.send(envelopes);
});

apiEnvelopes.post('/', (req, res) => {
  const { title, budget, spent} = req.body;
  if(title && budget) {
    if(spent) {
      const newEnvelope = createEnvelope(title, budget, spent);
      envelopes.push(newEnvelope);
      res.status(201).send(newEnvelope);
    } else {
      const newEnvelope = createEnvelope(title, budget);
      envelopes.push(newEnvelope);
      res.status(201).send(newEnvelope);
    }
  } else {
    res.status(400).send();
  }
});

apiEnvelopes.param('envId', (req, res, next, id) => {
  const envById = findInstanceById(parseInt(id));
  if(!envById) {
    res.status(400).send();
  } else {
    req.envById = envById;
    next();
  }
});

apiEnvelopes.get('/:envId', (req, res) => {
  res.send(req.envById);
})

module.exports = apiEnvelopes;