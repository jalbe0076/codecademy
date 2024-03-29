const Pool = require('pg').Pool; // Connection pooling to maintain a connection over the course of multiple requests

const pool = new Pool({
  user: process.env.DB_USER || 'me',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'api',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432
});

module.exports = pool;