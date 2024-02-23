require('dotenv').config(); // Load envirenment variables from .env file
const express = require('express');
const app = express();
const apiUsers = require('./server/users');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', apiUsers)

app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' });
});

app.listen(PORT, () => {
  console.log(`app "Node API Postgres" is listening on port ${PORT}`);
});