const express = require('express');
const { getAllFromDatabase } = require('./db')
const meetingsRouter = express.Router();

const modelMeetings = 'meetings'

meetingsRouter.get('/', (req, res, next) => {
  const allMeetings = getAllFromDatabase(modelMeetings);
  res.send(allMeetings);
})

module.exports = meetingsRouter;