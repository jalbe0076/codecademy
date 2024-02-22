require('dotenv').config(); // Load envirenment variables from .env file
const express = require('express');
const app = express();

const { getUsers } = require('./db/queries');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/users', getUsers);

app.listen(PORT, () => {
  console.log(`app "Node API Postgres" is listening on port ${PORT}`);
});