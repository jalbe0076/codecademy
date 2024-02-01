const express = require('express');
const { getAllFromDatabase, addToDatabase } = require('./db')
const meetingsRouter = express.Router();

const modelMeetings = 'meetings'

meetingsRouter.get('/', (req, res, next) => {
  const allMeetings = getAllFromDatabase(modelMeetings);
  res.send(allMeetings);
});

meetingsRouter.post('/', (req, res, next) => {
  const newMeeting = req.body;
  
  if(!newMeeting) {
    res.status(400).send();
  } else {
    const createdMeeting = addToDatabase(modelMeetings, newMeeting)
    res.status(201).send(createdMeeting)
  }
});

module.exports = meetingsRouter;