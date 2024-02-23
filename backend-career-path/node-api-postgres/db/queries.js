const pool = require('./db-config');

const queryDatabase = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.rows);
      }
    });
  });
};

const getUsers = () => {
  return queryDatabase('SELECT * FROM users ORDER BY id ASC');
};

const getUserById = (id) => {
  return queryDatabase('SELECT * FROM users WHERE id = $1', [id])
    .then(user => user[0])
};

const postNewUser = (name, email) => {
  return queryDatabase('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email])
    .then(user => `User ${user[0].name} added with an id of: ${user[0].id}`)
};

const updateUser = (id, name, email) => {
  if (!name || !email) {
    return queryDatabase('SELECT * FROM users WHERE id = $1', [id])
      .then(user => {
        if (user.length) {
          name = name ?? user[0].name;
          email = email ?? user[0].email;
        }

        return queryDatabase('UPDATE users SET name = $2, email = $3 WHERE id = $1  RETURNING *', [id, name, email])
          .then(user => user[0])
      })
  } else {
    return queryDatabase('UPDATE users SET name = $2, email = $3 WHERE id = $1  RETURNING *', [id, name, email])
      .then(user => user[0])
  }
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