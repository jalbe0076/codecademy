const express = require('express');
const apiEnvelopes = express.Router();
const { findInstanceById, deleteInstanceById, transferBudget, validateNumber, envelopes } = require('./db');
const { getAllEnvelopes, isValidUserId, postNewEnvelope, getEnvelopeById, updatePersonalSpent } = require('../db/queries');
const { handleError, parseEnvelope, fetchEnvelopeById, validateUrlId } = require('./utils');

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
        envelopes.forEach(envelope => {
          envelope = parseEnvelope(envelope)
        })
        res.status(200).json(envelopes);
      }
    })
    .catch((error) => handleError(res, 500, error));
});

apiEnvelopes.post('/', (req, res) => {
  const { title, budget, spent } = req.body;

  if (title && budget) {
    const parsedBudget = Number(budget);
    const parsedSpent = spent === 'undefined' ? Number(spent) : spent;

    postNewEnvelope(req.userId, title, parsedBudget, parsedSpent)
      .then(newEnvelope => {
        if (newEnvelope.exceedLimit) {
          res.status(400).send('Exceeded budget limit');
        } else {
          const parsedEnvelope = parseEnvelope(newEnvelope);
          res.status(201).json(parsedEnvelope);
        }
      })
      .catch(error => handleError(res, 500, error));
  } else {
    res.status(400).send('Invalid request');
  }
});

apiEnvelopes.param('envId', (req, res, next, id) => {
  const envelopeId = parseInt(id);
  if (isNaN(envelopeId)) {
    res.status(400).json({ error: 'Invalid envelope ID' });
  } else {
    req.envelopeId = envelopeId;
    next();
  }
});

apiEnvelopes.get('/:envId', async (req, res) => {
  try {
  const envelope = await fetchEnvelopeById(req.userId, req.envelopeId, res);
  res.json(envelope);
  } catch (error) {
    handleError(res, 404, error.message);
  }
});

apiEnvelopes.put('/:envId', async (req, res) => {
  const { spend, id }= req.body;
  const parsedSpend = Number(spend);

  if(!validateUrlId(req.envelopeId, id)) {
    res.status(400).send('URL ID does not match the envelope ID.');
    return;
  }

  if (isNaN(parsedSpend)) {
    res.status(400).send('Please enter a number.');
  } else {
    try {
      const envelope = await fetchEnvelopeById(req.userId, req.envelopeId, res);
      const { spent, budget } = envelope;
      const newSpent = spent + parsedSpend;

      if (newSpent > budget) {
        res.status(400).send(`Insufficient balance.`);
      } else {
        const updatedEnvelope = await updatePersonalSpent(req.userId, req.envelopeId, newSpent);
        res.status(201).json(parseEnvelope(updatedEnvelope));
      }
    } catch (error) {
      handleError(res, 404, error.message);
    }
  }
});

apiEnvelopes.delete('/:envId', (req, res) => {
  const envId = req.envelopeId.id;
  deleteInstanceById(envId);
  res.status(204).send();
});

apiEnvelopes.put('/:envId/budget', (req, res) => {
  const amount = req.body.increase;

  if (!validateNumber(amount)) {
    res.status(400).send('Please enter a number.');
  } else {
    req.envelopeId.updateBudget(amount);
    res.status(201).send(req.envelopeId);
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