const express = require('express');
const database = require('../database/methods');
const languageRouter = express.Router();

// Handles requests for fetching all results from a db table
languageRouter.get('/:lang', async (req, res) => {
  try {
    const results = await database.fetchAll(req.params.lang);

    res.json(results);
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

languageRouter.post('/:lang', async (req, res) => {
  try {
    await database.addData(req.params.lang, req.body);
    res.status(201);
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = languageRouter;
