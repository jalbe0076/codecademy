const express = require('express');
const apiEnvelopes = express.Router();
const { envelopes, createEnvelope } = require('./db');

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

module.exports = apiEnvelopes;