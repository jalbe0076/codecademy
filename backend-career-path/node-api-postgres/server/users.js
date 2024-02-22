const express = require('express');
const { getUsers, getUserById, postNewUser } = require('.././db/queries');
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
      if(!user) {
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

module.exports = apiUsers;