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

quoteRoute.post('/', (req, res, next) => {
  const newQuote = {
    quote: req.query.quote,
    person: req.query.person
  };
  if(newQuote.quote && newQuote.person) {
    quotes.push(newQuote);
    res.status(201).send(newQuote);
  } else {
    res.status(400).send();
  }
})

module.exports = quoteRoute;