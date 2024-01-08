const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database/methods');
const credentialsRouter = express.Router();

credentialsRouter.post('/signin', async (req, res) => {
  try {
    const { username, password, remember } = req.body;

    const databaseUser = await database.findUser(username);

    if (databaseUser.length > 0) {
      const validPassword = await bcrypt.compare(
        password,
        databaseUser[0].password,
      );

      if (validPassword) {
        const expiresIn = remember ? '7d' : '2h';
        const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
          expiresIn,
        });

        res.json({ success: true, token });
      } else {
        res.status(401).json({ success: false });
      }
    } else {
      res.status(401).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

credentialsRouter.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await database.findUser(username);

    if (userExists.length > 0) {
      res.status(400).json({ userExists: true });
    } else {
      const hashedPassword = await bcrypt.hash(password, 13);
      const newUser = await database.addUser(username, hashedPassword);
      res.json(newUser);
    }
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = credentialsRouter;
