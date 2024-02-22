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

const postNewUser = (name, email) => {
  console.log(name, email)
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(`User ${result.rows[0].name} added with an id of: ${result.rows[0].id}`)
      }
    });
  })
}

module.exports = {
  getUsers,
  getUserById,
  postNewUser
};