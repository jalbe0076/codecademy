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
};

const isValidUserId = (userId) => {
  return queryDatabase('SELECT * FROM users WHERE id = $1', [userId])
    .then((results) => results.length > 0 ? results[0] : null);
};

const postNewEnvelope = (userId, title, budget, spent = 0) => {
  return queryDatabase(
    `INSERT INTO personal_budget (user_id, title, budget, spent)
    VALUES($1, $2, $3, $4)
    RETURNING id, title, budget, spent`, [ userId, title, budget, spent]
  ) .then(newBudget => newBudget[0])
    .catch(error => {
      if (error.message.includes('Exceeded budget limit')) {
        return { exceedLimit: true };
      } else {
        console.log(error);
        throw new Error('Internal Server Error');
      }
  });
};

module.exports = {
  getAllEnvelopes,
  isValidUserId,
  postNewEnvelope
}