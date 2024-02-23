const pool = require('./db-config');

const queryDatabase = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.rows)
      }
    });
  });
};

const getUsers = () => {
  return queryDatabase('SELECT * FROM users ORDER BY id ASC');
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
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(`User ${result.rows[0].name} added with an id of: ${result.rows[0].id}`)
      }
    });
  })
};

const updateUser = (id, name, email) => {
  return new Promise((resolve, reject) => {
    if (!name || !email) {
      pool.query('SELECT * FROM users WHERE id = $1', [id], (fetchErr, fetchResult) => {
        if (fetchErr) {
          reject(fetchErr);
          return;
        }
        
        if (fetchResult.rows[0]) {
          name = name ?? fetchResult.rows[0].name;
          email = email ?? fetchResult.rows[0].email;
        }

        pool.query('UPDATE users SET name = $2, email = $3 WHERE id = $1  RETURNING *', [id, name, email], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows[0]);
          }
        });
      })
    } else {
      pool.query('UPDATE users SET name = $2, email = $3 WHERE id = $1 RETURNING *', [id, name, email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows[0]);
        }
      });
    }
  });
};

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (!results.rows.length) {
          resolve({ success: false, message: `No user found with ID ${id}` });
        } else {
          resolve({ success: true, message: `User with ID ${id} deleted successfully` });
        }
      }
    });
  });
};

module.exports = {
  getUsers,
  getUserById,
  postNewUser,
  updateUser,
  deleteUser
};