const express = require('express');
const app = express();

const PORT = process.env.PORT || 4001;
const quoteRoute = require('./modules/quotes.js');

app.use(express.static('public'));
app.use('/api/quotes', quoteRoute);

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}.`)
});