const express = require('express');
const apiEnvelopes = express.Router();
const { findInstanceById, transferBudget } = require('./db');
const { getAllEnvelopes, isValidUserId, postNewEnvelope, updatePersonalSpent, deleteEnvelope, updatePersonalBudget, fetchEnvelopeById } = require('../db/queries');
const { handleError, parseEnvelope, validateUrlId } = require('./utils');

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
    .catch(error => handleError(res, 500, error.message))
}

apiEnvelopes.use('/', validateUserId);

// ENDPOINTS FOR /api/envelopes

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
    .catch((error) => handleError(res, 500, error.message));
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
      .catch(error => handleError(res, 500, error.message));
  } else {
    res.status(400).send('Invalid request');
  }
});

// ENDPOINTS FOR /api/envelopes/:envId

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
    envelope && res.json(envelope);
  } catch (error) {
    handleError(res, 500, error.message);
  }
});

apiEnvelopes.put('/:envId', async (req, res) => {
  const { spend, id } = req.body;
  const parsedSpend = Number(spend);

  if (!validateUrlId(req.envelopeId, id)) {
    res.status(400).send('URL ID does not match the envelope ID.');
    return;
  }

  if (isNaN(parsedSpend)) {
    res.status(400).send('Please enter a number.');
  } else {
    try {
      const envelope = await fetchEnvelopeById(req.userId, req.envelopeId, res);
      if (!envelope) return

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
  const envId = req.envelopeId;

  deleteEnvelope(req.userId, envId)
    .then(results => {
      if (!results.length) {
        res.status(404).json({ message: `Envelope with ID ${envId} not found` });
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      handleError(res, 500, error.message);
    })
});

// change an envelopes budget by id
apiEnvelopes.put('/:envId/budget', async (req, res) => {
  const { newBudget, id } = req.body;

  if (!validateUrlId(req.envelopeId, id)) {
    res.status(400).send('URL ID does not match the envelope ID.');
    return;
  }

  if (isNaN(newBudget)) {
    res.status(400).send('Please enter a number.');
  } else {
    try {
      const envelope = await fetchEnvelopeById(req.userId, req.envelopeId, res);
      if (!envelope) return;

      const updatedEnvelopeBudget = await updatePersonalBudget(req.userId, req.envelopeId, newBudget);
      const parsedUpdatedEnvelope = parseEnvelope(updatedEnvelopeBudget[0]);
      res.status(201).json(parsedUpdatedEnvelope);
    } catch (error) {
      handleError(res, 500, error.message);
    }
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