/**
 * @description: This file is the entry point for the backend server.
 */
const express = require('express');
const homeRouter = require('./routes/home');
const exerciseRouter = require('./routes/exercise');
const credentialsRouter = require('./routes/credentials');
const adminRouter = require('./routes/admin');
const cors = require('cors');

/**
 * Create Express server.
 * @type {Express}
 */
const app = express();
const port = 8080;

/**
 * Express configuration.
 * Enable CORS and JSON parsing.
 * Serve the frontend from the backend.
 * Set up the routes.
 */
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.static('./frontend/dist'));
app.use('/api/home', homeRouter);
app.use('/api/exercise', exerciseRouter);
app.use('/api/credentials', credentialsRouter);
app.use('/api/admin', adminRouter);

/**
 * If no API route is matched, send the React app which will display error page.
 */
app.all('*', (req, res) => {
  res.sendFile('index.html', { root: './frontend/dist' });
});

/**
 * Start the server.
 */
app
  .listen(port, () => {
    /**
     * This callback is called when the server starts succesfully.
     */
    console.log(`SERVER: listening on port ${port}`);
  })
  .on('error', (err) => {
    /**
     * This callback is called if the server fails to start.
     */
    console.log(`SERVER: Error starting the server ${err}`);
  });
