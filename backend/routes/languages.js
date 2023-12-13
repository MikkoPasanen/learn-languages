const express = require('express');
const languageRouter = express.Router();

languageRouter.get('/languages/:lang', async (req, res) => {
  try {
    const language = req.params.lang;
    const results = await database.fetchAll(language);

    res.json(results);
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});
