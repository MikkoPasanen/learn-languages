/**
 * Entry point for the frontend.
 * @module frontend/src/main
 * @requires react
 * @requires react-dom/client
 * @requires App
 * @author Mikko Pasanen
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
