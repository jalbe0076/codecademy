// Consolidated error handling
const handleError = (res, statusCode, error) => {
    res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
};

module.exports = {
  handleError
}
