const express = require('express');
const bcrypt = require('bcrypt');
const database = require('../database/methods');
const adminRouter = express.Router();

adminRouter.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const databaseUser = await database.findUser(username);

    if (databaseUser.length > 0) {
      const validPassword = await bcrypt.compare(
        password,
        databaseUser[0].password,
      );

      if (validPassword) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

adminRouter.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await database.findUser(username);

    if (userExists.length > 0) {
      res.status(400);
      console.log('cant do sir');
    } else {
      const hashedPassword = await bcrypt.hash(password, 13);
      const newUser = await database.addUser(username, hashedPassword);
      res.json(newUser);
      console.log('yessir');
    }
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = adminRouter;
