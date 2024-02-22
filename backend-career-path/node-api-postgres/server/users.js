const express = require('express');
const { getUsers, getUserById } = require('.././db/queries');
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
      res.status(500).json({ err: 'Internal server error' });
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
      res.status(500).json({ err: 'Internal server error' });
    })

});

module.exports = apiUsers;