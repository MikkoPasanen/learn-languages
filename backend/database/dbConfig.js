require('dotenv').config();
const mysql = require('mysql');

const config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: process.env.LIMIT,
};

const pool = mysql.createPool(config);

module.exports = pool;
