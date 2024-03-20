const Pool = require('pg').Pool; // Connection pooling to maintain a connection over the course of multiple requests
let pool;

// if (process.env.DATABASE_URL) {
//   pool = new Pool({
//     connectionString: process.env.DATABASE_URL
//   }); 
// } else {
  pool = new Pool({
    user: process.env.DB_USER || 'me',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'budget_project',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432
  });
// }
  
module.exports = pool;

