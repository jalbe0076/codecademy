const express = require('express');
const apiEnvelopes = express.Router();
const { envelopes } = require('./db');

apiEnvelopes.get('/', (req, res) => {
  res.send(envelopes);
});

module.exports = apiEnvelopes;