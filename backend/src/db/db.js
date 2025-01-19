const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db', 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'projetoredes',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const promisePool = pool.promise();
module.exports = promisePool;
