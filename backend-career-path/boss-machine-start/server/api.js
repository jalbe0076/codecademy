const express = require('express');
const apiRouter = express.Router();

// minions route
const minionsRouter = require('./apiMinions.js');
apiRouter.use('/minions', minionsRouter);

module.exports = apiRouter;
