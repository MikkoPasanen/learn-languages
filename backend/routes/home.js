const express = require('express');
const database = require('../database/methods');
const homeRouter = express.Router();

homeRouter.get('/', async (req, res) => {
  try {
    const allExercises = await database.fetchAllExercises();
    res.json(allExercises);
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = homeRouter;
