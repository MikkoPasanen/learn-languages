const express = require('express');
const database = require('../database/methods');
const exerciseRouter = express.Router();

// Handles requests for fetching all results from a db table
exerciseRouter.get('/:id([0-9]+)', async (req, res) => {
  try {
    const results = await database.fetchExercise(req.params.id);

    res.json(results);
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = exerciseRouter;
