const express = require('express');
const app = express();

const { quotes } = require('../data');
const { getRandomElement, isObjectEmpty, generateNewId} = require('../utils');
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
    id: generateNewId(),
    quote: req.query.quote,
    person: req.query.person
  };
  if(newQuote.quote && newQuote.person) {
    quotes.push(newQuote);
    res.status(201).send(newQuote);
  } else {
    res.status(400).send();
  }
});

quoteRoute.put('/', (req, res, next) => {
  const indexOfQuote = quotes.findIndex(quote => quote.id === req.body.id);

  if(indexOfQuote !== -1) {
    quotes[indexOfQuote].quote = req.body.quote;
    quotes[indexOfQuote].person = req.body.person;
    res.status(201).send(quotes[indexOfQuote]);
  } else {
    res.status(404).send();
  }
});

quoteRoute.delete('/', (req, res, next) => {
  const indexOfQuote = quotes.findIndex(quote => quote.id === req.body.id);

  if(indexOfQuote !== -1) {
    quotes.splice(indexOfQuote, 1);
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

module.exports = quoteRoute;