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
    const { exerciseName, category, language } = req.body;

    const exerciseId = await database.addExercise(
      exerciseName,
      category,
      language,
    );

    res.status(201).json({ success: true, exerciseId });
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

adminRouter.post('/add-wordpairs', async (req, res) => {
  try {
    const { exerciseId, wordPairs } = req.body;

    await database.addWordPairs(exerciseId, wordPairs);

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = adminRouter;
