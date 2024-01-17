const express = require('express');
const app = express();

const { quotes } = require('../data');
const { getRandomElement } = require('../utils');
quoteRoute = express.Router();

quoteRoute.get('/', (req, res, next) => {
  res.send(quotes);
});

quoteRoute.get('/random', (req, res, next) => {
  const randomQuote = getRandomElement(quotes);
  if(randomQuote) {
    res.send(randomQuote);
  } else {
    res.status(404).send();
  }
});

module.exports = quoteRoute;