const express = require('express');
const { getAllFromDatabase, addToDatabase, deleteAllFromDatabase, createMeeting } = require('./db')
const meetingsRouter = express.Router();

const modelMeetings = 'meetings'

meetingsRouter.get('/', (req, res, next) => {
  const allMeetings = getAllFromDatabase(modelMeetings);
  res.send(allMeetings);
});

meetingsRouter.post('/', (req, res, next) => {
    const createdMeeting = addToDatabase(modelMeetings, createMeeting())
    res.status(201).send(createdMeeting)
});

meetingsRouter.delete('/', (req, res, next) => {
  deleteAllFromDatabase(modelMeetings);
  res.status(204).send();
});

module.exports = meetingsRouter;