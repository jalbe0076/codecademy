const express = require('express');
const { getUsers, getUserById, postNewUser, updateUser, deleteUser } = require('.././db/queries');
const apiUsers = express.Router();

apiUsers.get('/', (req, res) => {
  getUsers()
    .then(users => {
      if (!users.length) {
        res.status(404).json({ error: 'Users not found' });
      } else {
        res.status(200).json(users);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

apiUsers.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  getUserById(id)
    .then(user => {
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

apiUsers.post('/', (req, res) => {
  const { name, email } = req.body;
  console.log(name, email)
  postNewUser(name, email)
    .then(user => {
      if (!user) {
        res.status(400).json({ error: 'Could not create user' });
      } else {
        res.status(201).json(user);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    })
});

apiUsers.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  if (name || email) {
    updateUser(id, name, email)
      .then(user => {
        if (!user) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.status(200).json('user: ' + user.id + ' was updated');
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  } else {
    res.status(400).json({ error: 'Update name or email' });
  }
});

apiUsers.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  deleteUser(id)
    .then(user => {
      if (!user.success) {
        res.status(404).json(user.message);
      } else {
        res.status(200).json(user.message);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = apiUsers;