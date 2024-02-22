const pool = require('./db-config');

const getUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.rows);
      }
    });
  })
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.rows[0]);
      }
    });
  })
};

module.exports = {
  getUsers,
  getUserById
};