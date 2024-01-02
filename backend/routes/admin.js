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

    const id = await database.addExercise(exerciseName, category, language);

    console.log(id);
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = adminRouter;
