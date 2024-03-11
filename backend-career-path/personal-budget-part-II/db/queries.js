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
  return queryDatabase('SELECT id, title, budget, spent FROM personal_budget WHERE user_id = $1', [userId]);
};

const getEnvelopeById = (userId, envById) => {
  return queryDatabase('SELECT id, title, budget, spent FROM personal_budget WHERE user_id = $1 AND id = $2', [userId, envById])
}

const isValidUserId = (userId) => {
  return queryDatabase('SELECT * FROM users WHERE id = $1', [userId])
    .then((results) => results.length > 0 ? results[0] : null);
};

const postNewEnvelope = (userId, title, budget, spent = 0) => {
  // check to make sure the budget and spent arguments are numbers and throw an error if not.
  if (isNaN(budget) || isNaN(spent)) {
    const error = new Error('Invalid numeric value for budget or spent.');
    error.status = 400;
    throw error;
  }

  return queryDatabase(
    `INSERT INTO personal_budget (user_id, title, budget, spent)
    VALUES($1, $2, $3, $4)
    RETURNING id, title, budget, spent`, [ userId, title, budget, spent]
  ) .then(newBudget => newBudget[0])
    .catch(error => {
      if (error.message.includes('Exceeded budget limit')) {
        return { exceedLimit: true };
      } else {
        throw new Error('Internal Server Error');
      }
  });
};

const updatePersonalSpent = (user_id, envById, newSpent) => {
  return queryDatabase(
    `UPDATE personal_budget
    SET spent = $3
    WHERE user_id = $1 AND id = $2
    RETURNING id, title, budget, spent`, [user_id, envById, newSpent]
  )
  .then(updatedEnvelope => updatedEnvelope[0])
};

const deleteEnvelope = () => {

};

module.exports = {
  getAllEnvelopes,
  getEnvelopeById,
  isValidUserId,
  postNewEnvelope,
  updatePersonalSpent,
  deleteEnvelope
}