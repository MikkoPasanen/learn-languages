/**
 * @fileOverview Database configuration file
 * @module backend/database/dbConfig
 * @requires dotenv
 * @requires mysql
 */

// Load environment variables from .env file
require('dotenv').config();

// Load mysql
const mysql = require('mysql');

/**
 * @description: MySQL configuration object.
 * @type {Object}
 * @property {string} host - MySQL server host.
 * @property {string} user - MySQL user.
 * @property {string} password -  Password of the MySQL user.
 * @property {string} database - The MySQL database to connect to.
 * @property {number} connectionLimit - The maximum number of connections to the MySQL server.
 */
const config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: process.env.LIMIT,
};

/**
 * @description: Create a MySQL connection pool.
 * @type {mysql.Pool}
 */
const pool = mysql.createPool(config);

// Export the pool
module.exports = pool;
