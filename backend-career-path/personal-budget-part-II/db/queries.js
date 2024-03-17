const pool = require('./db-config.js');
const { parseEnvelope } = require('../server/utils.js')

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

const getEnvelopeById = (userId, envelopeId) => {
  return queryDatabase('SELECT id, title, budget, spent FROM personal_budget WHERE user_id = $1 AND id = $2', [userId, envelopeId])
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
    RETURNING id, title, budget, spent`, [userId, title, budget, spent]
  ).then(newBudget => newBudget[0])
    .catch(error => {
      if (error.message.includes('Exceeded budget limit')) {
        return { exceedLimit: true };
      } else {
        throw new Error('Internal Server Error');
      }
    });
};

const updatePersonalSpent = (user_id, envelopeId, newSpent) => {
  return queryDatabase(
    `UPDATE personal_budget
    SET spent = $3
    WHERE user_id = $1 AND id = $2
    RETURNING id, title, budget, spent`, [user_id, envelopeId, newSpent]
  )
    .then(updatedEnvelope => updatedEnvelope[0])
};

const deleteEnvelope = (userId, envelopeId) => {
  return queryDatabase(`DELETE FROM personal_budget WHERE user_id = $1 AND id = $2 RETURNING *`, [userId, envelopeId])
};

const replaceEnvelopeBudget = (userId, envelopeId, newBudget) => {
  return queryDatabase(
    `UPDATE personal_budget
    SET budget = $3
    WHERE user_id = $1 AND id = $2
    RETURNING id, title, budget, spent`, [userId, envelopeId, newBudget]);
};

const adjustEnvelopeBudget = async (userId, envelopeId, amount, operation = '+') => {
  if (operation !== '-' && operation !== '+') return [];

  // Check budget amount before update
  if (operation === '-') {
    await queryDatabase(`SELECT * FROM personal_budget WHERE user_id = $1 AND id = $2`, [userId, envelopeId])
      .then(response => {
        if (!response.length) {
          throw {
            error: `Envelope with ID ${envelopeId} not found`,
            status: 404
          };
        } else if (amount > response[0].budget) {
          throw {
            error: 'Insufficient budget to transfer',
            status: 400
          };
        } else if (response[0].budget - amount < response[0].spent) { // makes sure that the budget cannot go below something that has been spent
          throw {
            error: `Cannot transfer budget since you've already spent more than you want to transfer, wait till next pay day.`,
            status: 400
          };
        }
      })
  }

  return queryDatabase(
    `UPDATE personal_budget
    SET budget = budget ${operation} $3
    WHERE user_id = $1 AND id = $2
    RETURNING id, title, budget, spent`, [userId, envelopeId, amount]
  )
};

// Query handler functions
const fetchEnvelopeById = async (userId, envById, res) => {
  try {
    const envelopeById = await getEnvelopeById(userId, envById);
    if (!envelopeById.length) {
      res.status(404).json({ error: `Envelope with ID ${envById} not found` });
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
  queryDatabase,
  getAllEnvelopes,
  getEnvelopeById,
  isValidUserId,
  postNewEnvelope,
  updatePersonalSpent,
  deleteEnvelope,
  replaceEnvelopeBudget,
  fetchEnvelopeById,
  adjustEnvelopeBudget
}
