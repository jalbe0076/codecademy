require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const apiRouter = require('./server/api');
const PORT = process.env.PORT || 3000;

app.locals = {
  title: 'Personal Budget'
}

// middleware to handle cors requests from index.html
app.use(cors());

// middleware to parse request bodies
app.use(bodyParser.json());

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`${app.locals.title} is now running on http://localhost:${PORT}/`);
});