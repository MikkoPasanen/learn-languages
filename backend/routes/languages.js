const express = require('express');
const database = require('../database/methods');
const languageRouter = express.Router();

// Handles requests for fetching all results from a db table
languageRouter.get('/:lang', async (req, res) => {
  try {
    const language = req.params.lang;
    console.log(language);
    const results = await database.fetchAll(language);

    res.json(results);
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

languageRouter.post('/:lang', async (req, res) => {
  try {
    const newData = await database.addData(req.params.lang, req.body);
    res.status(201).json(newData);
  } catch (err) {
    res.status(err.status).json(err.msg);
  }
});

module.exports = languageRouter;
