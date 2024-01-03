const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../database/methods');
const adminRouter = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false });
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
      if (err) {
        res.status(401).json({ success: false });
      } else {
        next();
      }
    });
  }
};

adminRouter.use(verifyToken);

adminRouter.post('/add-exercise', async (req, res) => {
  try {
    const { exerciseName, category, language, wordPairs } = req.body;

    await database.addExercise(exerciseName, category, language, wordPairs);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

adminRouter.delete('/delete-exercise/:id([0-9]+)', async (req, res) => {
  try {
    const { id } = req.params;

    await database.deleteExercise(id);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = adminRouter;
