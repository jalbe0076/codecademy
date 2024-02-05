const express = require('express');
const apiEnvelopes = express.Router();
const { envelopes, createEnvelope, findInstanceById, deleteInstanceById, transferBudget, validateNumber } = require('./db');

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
  const envById = findInstanceById(id);
  if(!envById) {
    res.status(400).send();
  } else {
    req.envById = envById;
    next();
  }
});

apiEnvelopes.get('/:envId', (req, res) => {
  res.send(req.envById);
});

apiEnvelopes.put('/:envId', (req, res) => {
  const amount = req.body.spend;
  
  if (!validateNumber(amount)) {
    res.status(400).send('Please enter a number.');
  } else if (amount > req.envById.balance) {
    res.status(400).send(`Insufficient balance.`);
  } else {
    req.envById.updateSpend(amount);
    res.status(201).send(req.envById);
  }
});

apiEnvelopes.delete('/:envId', (req, res) => {
  const envId = req.envById.id;
  deleteInstanceById(envId);
  res.status(204).send();
});

apiEnvelopes.put('/:envId/budget', (req, res) => {
  const amount = req.body.increase;
  
  if (!validateNumber(amount)) {
    res.status(400).send('Please enter a number.');
  } else {
    req.envById.updateBudget(amount);
    res.status(201).send(req.envById);
  }
});

apiEnvelopes.post('/transfer/:from/:to', (req, res) => {
  const fromEnvelope = findInstanceById(req.params.from);
  const toEnvelope = findInstanceById(req.params.to);
  const amount = req.body.amount;

  if(!fromEnvelope || !toEnvelope) {
    res.status(404).send('Envelopes not found');
    return;
  }

  const transfer = transferBudget(fromEnvelope, toEnvelope, amount);

  if (transfer) {
    res.status(201).send(transfer);
  } else {
    res.status(400).send('Insuficient transfer amount.');
  }
});

module.exports = apiEnvelopes;