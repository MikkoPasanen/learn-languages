const express = require('express');
const languageRouter = require('./routes/languages');
const cors = require('cors');

const app = express();
const port = 8080;

// Enable CORS so backend and frontend can communicate
app.use(cors());
app.use('/api/languages', languageRouter);

app
  .listen(port, () => {
    console.log(`SERVER: listening on port ${port}`);
  })
  .on('error', (err) => {
    console.log(`SERVER: Error starting the server ${err}`);
  });
