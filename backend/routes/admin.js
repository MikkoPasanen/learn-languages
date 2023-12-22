const express = require('express');
const bcrypt = require('bcrypt');
const database = require('../database/methods');
const adminRouter = express.Router();

adminRouter.get('/signin', async (req, res) => {
  try {
    const allUsers = await database.fetchAllUsers();
    res.json(allUsers);
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

adminRouter.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 13);
    await database.addUser(username, hashedPassword);

    res.status(201);
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = adminRouter;
