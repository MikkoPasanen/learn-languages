/**
 * @fileoverview Admin routes.
 * @description Provides routes for adding, editing and deleting exercises.
 * @module routes/admin
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../database/methods');

// Create a router
const adminRouter = express.Router();

/**
 * Middleware function to verify a JWT token.
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The Express next middleware function.
 */
const verifyToken = (req, res, next) => {
  // Get the auth header value
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  // Check if token is undefined
  if (!token) {
    // Forbidden if the token is undefined
    res.status(401).json({ success: false });
  } else {
    // Verify token
    jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
      if (err) {
        // Forbidden if the token is invalid
        res.status(401).json({ success: false });
      } else {
        // Token is valid
        next();
      }
    });
  }
};

// Use the verifyToken middleware for all routes in adminRouter
// This means that all routes in adminRouter will require a valid JWT token
adminRouter.use(verifyToken);

/**
 * Route handler for adding a new exercise.
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 */
adminRouter.post('/add-exercise', async (req, res) => {
  try {
    // Get the exercise data from the request body
    const { exerciseName, category, language, wordPairs, madeBy, modified } =
      req.body;

    // Add the exercise to the database
    await database.addExercise(
      exerciseName,
      category,
      language,
      wordPairs,
      madeBy,
      modified,
    );

    // Send a response if the exercise was added successfully
    res.status(201).json({ success: true });
  } catch (err) {
    // Send an error response if something went wrong
    res.status(err.status).json(err.msg);
  }
});

/**
 * Route handler for deleting an exercise.
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 */
adminRouter.delete('/delete-exercise/:id([0-9]+)', async (req, res) => {
  try {
    // Get the exercise id from the url
    const { id } = req.params;

    // Delete the exercise from the database
    await database.deleteExercise(id);

    // Send a response if the exercise was deleted successfully
    res.status(200).json({ success: true });
  } catch (err) {
    // Send an error response if something went wrong
    res.status(err.status).json(err.msg);
  }
});

/**
 * Route handler for editing an exercise.
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 */
adminRouter.put('/edit-exercise/:id([0-9]+)', async (req, res) => {
  try {
    // Get the exercise id from the url
    const { id } = req.params;
    // Get the exercise data from the request body
    const {
      name,
      category,
      language,
      wordPairsToUpdate,
      wordPairsToAdd,
      wordPairsToDelete,
      modified,
    } = req.body;

    // Edit the exercise in the database
    await database.editExercise(
      id,
      name,
      category,
      language,
      wordPairsToUpdate,
      modified,
    );

    // Add new word pairs to the database if there are any
    if (wordPairsToAdd.length > 0) {
      await database.addWordPairs(id, wordPairsToAdd);
    }

    // Delete word pairs from the database if there are any to delete
    if (wordPairsToDelete.length > 0) {
      await database.deleteWordPairs(wordPairsToDelete);
    }

    // Send a response if the exercise was edited successfully
    res.status(200).json({ success: true });
  } catch (err) {
    // Send an error response if something went wrong
    res.status(err.status).json(err.msg);
  }
});

// Export the router
module.exports = adminRouter;
