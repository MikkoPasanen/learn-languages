const express = require('express');
const bcrypt = require('bcrypt');
const database = require('../database/methods');
const adminRouter = express.Router();

adminRouter.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const validUser = await database.findUser(username);
    const validPassword = await bcrypt.compare(password, validUser.password);

    if (validUser && validPassword) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

adminRouter.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await database.findUser(username);

    if (userExists) {
      res.status(400).json('Username already exists');
    } else {
      const hashedPassword = await bcrypt.hash(password, 13);
      const newUser = await database.addUser(username, hashedPassword);
      res.json(newUser);
    }
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = adminRouter;
