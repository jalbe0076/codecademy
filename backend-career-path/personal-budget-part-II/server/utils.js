// Consolidated error handling
const handleError = (res, statusCode, error) => {
    res.status(statusCode).json({ error: error.message || error.error || 'Internal Server Error' });
};

// parse database type numeric into a number in JS since the numeric type may contain values that are too large to "fit" in JavaScript's Number
const parseEnvelope = (envelope) => {
  envelope.budget = Number(envelope.budget);
  envelope.spent = Number(envelope.spent);
  envelope.balance = envelope.budget - envelope.spent
  return envelope;
};

const validateUrlId = (urlId, bodyId) => {
  return urlId === bodyId;
};

module.exports = {
  handleError,
  parseEnvelope,
  validateUrlId
}
