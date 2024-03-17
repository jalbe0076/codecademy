const express = require('express');
const apiRouter = express.Router();
const apiEnvelopes = require('./envelopes');

apiRouter.use('/envelopes', apiEnvelopes);

module.exports = apiRouter;