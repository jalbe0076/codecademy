const express = require('express');
const apiEnvelopes = express.Router();
const { queryDatabase, getAllEnvelopes, isValidUserId, postNewEnvelope, updatePersonalSpent, deleteEnvelope, replaceEnvelopeBudget, fetchEnvelopeById, adjustEnvelopeBudget } = require('../db/queries');
const { handleError, parseEnvelope, validateUrlId } = require('./utils');

// user auth is not properly implemented, this will allow anyone to check the database with different users
const validateUserId = (req, res, next) => {
  const userId = parseInt(req.query.user_id) || 1;
  isValidUserId(userId)
    .then(userId => {
      if (!userId) {
        res.status(400).json({ error: 'Invalid user ID' })
      } else {
        req.userId = userId.id;
        next();
      }
    })
    .catch(error => handleError(res, 500, error))
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
          res.status(400).send({ error: 'Exceeded budget limit'});
        } else {
          const parsedEnvelope = parseEnvelope(newEnvelope);
          res.status(201).json(parsedEnvelope);
        }
      })
      .catch(error => handleError(res, 500, error));
  } else {
    res.status(400).send({ error: 'Invalid request'});
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
    handleError(res, 500, error);
  }
});

apiEnvelopes.put('/:envId', async (req, res) => {
  const { spend, id } = req.body;
  const parsedSpend = Number(spend);

  if (!validateUrlId(req.envelopeId, id)) {
    res.status(400).send({ error: 'URL ID does not match the envelope ID.'});
    return;
  }

  if (isNaN(parsedSpend)) {
    res.status(400).send({ error: 'Please enter a number.' });
  } else {
    try {
      const envelope = await fetchEnvelopeById(req.userId, req.envelopeId, res);
      if (!envelope) return

      const { spent, budget } = envelope;
      const newSpent = spent + parsedSpend;

      if (newSpent > budget) {
        res.status(400).send({ error: `Insufficient balance.` });
      } else {
        const updatedEnvelope = await updatePersonalSpent(req.userId, req.envelopeId, newSpent);
        res.status(201).json(parseEnvelope(updatedEnvelope));
      }
    } catch (error) {
      handleError(res, 404, error);
    }
  }
});

apiEnvelopes.delete('/:envId', (req, res) => {
  const envId = req.envelopeId;

  deleteEnvelope(req.userId, envId)
    .then(results => {
      if (!results.length) {
        res.status(404).json({ error: `Envelope with ID ${envId} not found` });
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      handleError(res, 500, error);
    })
});

// change an envelopes budget by id
apiEnvelopes.put('/:envId/budget', async (req, res) => {
  const { newBudget, id } = req.body;

  if (!validateUrlId(req.envelopeId, id)) {
    res.status(400).send({ error: 'URL ID does not match the envelope ID.'});
    return;
  }

  if (isNaN(newBudget)) {
    res.status(400).send({ error: 'Please enter a number.' });
  } else {
    try {
      const envelope = await fetchEnvelopeById(req.userId, req.envelopeId, res); // confirm the envelope exists before updating it
      if (!envelope) return;

      const updatedEnvelopeBudget = await replaceEnvelopeBudget(req.userId, req.envelopeId, newBudget);
      const parsedUpdatedEnvelope = parseEnvelope(updatedEnvelopeBudget[0]);
      res.status(201).json(parsedUpdatedEnvelope);
    } catch (error) {
      const status = error.severity === 'ERROR' && 400;
      handleError(res, status || 500, error);
    }
  }
});

// Transfer set amount from one budget to the other
apiEnvelopes.post('/transfer/:from/:to', async (req, res) => {
  const {fromEnvId, toEnvId, amount} = req.body;
  const paramsFromId = parseInt(req.params.from);
  const paramsToId = parseInt(req.params.to);

  if(!validateUrlId(paramsFromId, fromEnvId) || !validateUrlId(paramsToId, toEnvId)) {
    res.status(400).send({ error: 'URL ID does not match the envelope ID.' });
    return;
  }

  try {
    await queryDatabase('BEGIN');

    const updatefromEnvelope = await adjustEnvelopeBudget(req.userId, paramsFromId, amount, '-');

    const updateToEnvelope = await adjustEnvelopeBudget(req.userId, paramsToId, amount)
    
    if (!updateToEnvelope.length) {
      throw { 
        error: 'Destination envelope not found.',
        status: 404
      }
    }

    await queryDatabase('COMMIT');
    res.status(201).send([ updatefromEnvelope[0], updateToEnvelope[0] ])
  } catch (error) {
    await queryDatabase('ROLLBACK');
    handleError(res, error.status || 500, error);
  }
});

apiEnvelopes.use((err, req, res, next) => {
  handleError(res, err.status || 500, err)
});

module.exports = apiEnvelopes;