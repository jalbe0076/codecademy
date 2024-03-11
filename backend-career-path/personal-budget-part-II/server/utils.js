const { getEnvelopeById } = require('../db/queries');

// Consolidated error handling
const handleError = (res, statusCode, error) => {
    res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
};

// parse database type numeric into a number in JS since the numeric type may contain values that are too large to "fit" in JavaScript's Number
const parseEnvelope = (envelope) => {
  envelope.budget = Number(envelope.budget);
  envelope.spent = Number(envelope.spent);
  envelope.balance = envelope.budget - envelope.spent
  return envelope;
};

// Query handler functions
const fetchEnvelopeById = async (userId, envById, res) => {
  try {
    const envelopeById = await getEnvelopeById(userId, envById);
    if (!envelopeById.length) {
      res.status(404).json({ message: `Envelope with ID ${envById} not found` });
      return null;  
    }

    const parsedEnvelope = parseEnvelope(envelopeById[0]);
    return parsedEnvelope;
  } catch (error) {
    handleError(res, 500, error);
    return null;
  }
}

module.exports = {
  handleError,
  parseEnvelope,
  fetchEnvelopeById
}
