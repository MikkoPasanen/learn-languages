/**
 * @fileoverview This file handles all requests to the /exercise endpoint.
 * @description Provides route for fetching exercise data from the database.
 * @module routes/exercise
 */

const express = require('express');
const database = require('../database/methods');

// Create a router
const exerciseRouter = express.Router();

/**
 * Route handler for fetching exercise data.
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 */
exerciseRouter.get('/:id([0-9]+)', async (req, res) => {
  try {
    // Get the exercise data from the database
    const results = await database.fetchExercise(req.params.id);

    // Send the exercise data to the client
    res.json(results);
  } catch (err) {
    // Send an error response if something went wrong
    res.status(err.status).json(err.msg);
  }
});

// Export the router
module.exports = exerciseRouter;
