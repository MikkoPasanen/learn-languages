/**
 * @fileoverview This file handles all requests to the /home endpoint.
 * @description Provides route for fetching all exercises from the database.
 * @module routes/home
 */

const express = require('express');
const database = require('../database/methods');

// Create a router
const homeRouter = express.Router();

/**
 * Route handler for fetching all exercises.
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 */
homeRouter.get('/', async (req, res) => {
  try {
    // Get all exercises from the database
    const allExercises = await database.fetchAllExercises();

    // Send the exercises to the client
    res.json(allExercises);
  } catch (err) {
    // Send an error response if something went wrong
    res.status(err.status).json(err.msg);
  }
});

// Export the router
module.exports = homeRouter;
