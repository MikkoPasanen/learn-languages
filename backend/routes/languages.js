const express = require('express');
const database = require('../database/methods');
const languageRouter = express.Router();

// Handles requests for fetching all results from a db table
languageRouter.get('/:lang', async (req, res) => {
  try {
    const language = req.params.lang;
    const results = await database.fetchAll(language);

    res.json(results);
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = languageRouter;
