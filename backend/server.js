const express = require('express');
const homeRouter = require('./routes/home');
const exerciseRouter = require('./routes/exercise');
const credentialsRouter = require('./routes/credentials');
const adminRouter = require('./routes/admin');
const cors = require('cors');

const app = express();
const port = 8080;

// Enable CORS so backend and frontend can communicate
app.use(cors());
app.use(express.json());
app.use(express.static('./frontend/dist'));
app.use('/api/home', homeRouter);
app.use('/api/exercise', exerciseRouter);
app.use('/api/credentials', credentialsRouter);
app.use('/api/admin', adminRouter);

// If no route is matched, return the frontend
app.all('*', (req, res) => {
  res.sendFile('index.html', { root: './frontend/dist' });
});

app
  .listen(port, () => {
    console.log(`SERVER: listening on port ${port}`);
  })
  .on('error', (err) => {
    console.log(`SERVER: Error starting the server ${err}`);
  });
