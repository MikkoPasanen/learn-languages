const express = require('express');
const homeRouter = require('./routes/home');
const exerciseRouter = require('./routes/exercise');
const cors = require('cors');

const app = express();
const port = 8080;

// Enable CORS so backend and frontend can communicate
app.use(cors());
app.use(express.json());
app.use('/api/home', homeRouter);
app.use('/api/exercise', exerciseRouter);

app
  .listen(port, () => {
    console.log(`SERVER: listening on port ${port}`);
  })
  .on('error', (err) => {
    console.log(`SERVER: Error starting the server ${err}`);
  });
