// Consolidated error handling
const handleError = (res, statusCode, error) => {
    res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
};

const parseEnvelope = (envelope) => {
  envelope.budget = Number(envelope.budget);
  envelope.spent = Number(envelope.spent);
  envelope.balance = envelope.budget - envelope.spent
  return envelope;
};

module.exports = {
  handleError,
  parseEnvelope
}
