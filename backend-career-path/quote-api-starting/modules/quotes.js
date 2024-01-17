const express = require('express');
const app = express();

const { quotes } = require('../data');
const { getRandomElement, isObjectEmpty } = require('../utils');
quoteRoute = express.Router();

quoteRoute.get('/', (req, res, next) => {
  const author = req.query;
  if(isObjectEmpty(author)) {
    res.send(quotes);
  } else {
    const authorQuotes = quotes.filter(quotes => quotes.person.toLowerCase() === author.person.trim().toLowerCase());
    res.send(authorQuotes);
  }
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