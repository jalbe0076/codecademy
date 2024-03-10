const express = require('express');
const apiEnvelopes = express.Router();
const { findInstanceById, deleteInstanceById, transferBudget, validateNumber } = require('./db');
const { getAllEnvelopes, isValidUserId, postNewEnvelope } = require('../db/queries');
const { handleError } = require('./utils');

// user auth is not properly implemented, this will allow anyone to check the database with different users
const validateUserId = (req, res, next) => {
  const userId = parseInt(req.query.user_id) || 1;

  isValidUserId(userId)
    .then(userId => {
      if (!userId) {
        res.status(400).json({ message: 'Invalid user ID' })
      } else {
        req.userId = userId.id;
        next();
      }
    })
    .catch(error => handleError(res, 500, error))
}

apiEnvelopes.use('/', validateUserId);

// Endpoints
apiEnvelopes.get('/', (req, res) => {
  getAllEnvelopes(req.userId)
    .then(envelopes => {
      if (!envelopes.length) {
        res.status(404).json({ error: 'Envelopes not found' });
      } else {
        res.status(200).json(envelopes);
      }
    })
    .catch((error) => handleError(res, 500, error));
});

apiEnvelopes.post('/', (req, res) => {
  const { title, budget, spent } = req.body;

  if (title && budget) {
    postNewEnvelope(req.userId, title, budget, spent)
      .then(newEnvelope => {
        if (newEnvelope.exceedLimit) {
          res.status(400).send('Exceeded budget limit');
        } else {
          res.status(201).json(newEnvelope)
        }
      })
      .catch(error => handleError(res, 500, error))
  } else {
    res.status(400).send('Invalid request');
  }
});

apiEnvelopes.param('envId', (req, res, next, id) => {
  const envById = findInstanceById(id);
  if (!envById) {
    res.status(400).send();
  } else {
    req.envById = envById;
    next();
  }
});

apiEnvelopes.get('/:envId', (req, res) => {
  res.send(req.envById);
});

apiEnvelopes.put('/:envId', (req, res) => {
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

apiEnvelopes.put('/:envId/budget', (req, res) => {
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

  if (!fromEnvelope || !toEnvelope) {
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

apiEnvelopes.use((err, req, res, next) => {
  handleError(res, err.status || 500, err)
});

module.exports = apiEnvelopes;