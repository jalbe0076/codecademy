const express = require('express');
const apiRouter = express.Router();

// minions route
const minionsRouter = require('./apiMinions.js');
apiRouter.use('/minions', minionsRouter);

// ideas route
const ideasRouter = require('./apiIdeas.js');
apiRouter.use('/ideas', ideasRouter);

const meetingsRouter = require('./apiMeetings.js');
apiRouter.use('/meetings', meetingsRouter);

module.exports = apiRouter;
