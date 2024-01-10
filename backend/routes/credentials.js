/**
 * @fileoverview Credentials router.
 * @description Provides routes for signing in and signing up.
 * @module routes/credentials
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database/methods');

// Create a router
const credentialsRouter = express.Router();

/**
 * Route handler for user sign in.
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 */
credentialsRouter.post('/signin', async (req, res) => {
  try {
    // Get data from the request body
    const { username, password, remember } = req.body;

    // Find the user in the database
    const databaseUser = await database.findUser(username);

    // Check if the user exists
    if (databaseUser.length > 0) {
      // Compare the password from the request body with the password from the database
      const validPassword = await bcrypt.compare(
        password,
        databaseUser[0].password,
      );

      // Check if the password is valid
      if (validPassword) {
        // Determine the expiration time for the token based on the remember flag
        const expiresIn = remember ? '7d' : '2h';

        // Generate a JWT token
        const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
          expiresIn,
        });

        // Send the token to the client
        res.json({ success: true, token });
      } else {
        // Forbidden if the password is invalid
        res.status(401).json({ success: false });
      }
    } else {
      // Forbidden if the user does not exist
      res.status(401).json({ success: false });
    }
  } catch (err) {
    // Internal server error
    res.status(500).json({ success: false });
  }
});

/**
 * Route handler for user sign up.
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 */
credentialsRouter.post('/signup', async (req, res) => {
  try {
    // Get data from the request body
    const { username, password } = req.body;

    // Check if the user already exists
    const userExists = await database.findUser(username);

    // If the user exists send a response with the userExists flag set to true
    if (userExists.length > 0) {
      res.status(400).json({ userExists: true });
    } else {
      // Hash the password from the request body
      const hashedPassword = await bcrypt.hash(password, 13);
      // Add the user to the database
      const newUser = await database.addUser(username, hashedPassword);
      // Send the new user info to the client
      res.json(newUser);
    }
  } catch (err) {
    // Send an error response if something went wrong
    res.status(err.status).json(err.msg);
  }
});

// Export the router
module.exports = credentialsRouter;
