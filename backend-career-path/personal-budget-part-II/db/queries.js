const pool = require('./db-config');

// Function to execute a database query asynchnously using Promises
const queryDatabase = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, results) => {
      return err ? reject(err) : resolve(results.rows);
    });
  });
};

const getAllEnvelopes = (userId) => {
  return queryDatabase('SELECT * FROM personal_budget WHERE user_id = $1', [userId]);
}

const isValidUserId = (userId) => {
  return queryDatabase('SELECT * FROM users WHERE id = $1', [userId])
    .then((results) => results.length > 0 ? results[0] : null);
}

module.exports = {
  getAllEnvelopes,
  isValidUserId
}