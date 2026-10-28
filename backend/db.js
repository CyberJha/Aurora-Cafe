/**
 * db.js
 * Creates and exports a MySQL connection pool.
 * A pool reuses connections efficiently instead of
 * creating a new connection for every query.
 */

const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool using environment variables for credentials.
const pool = mysql.createPool({
    host:     process.env.DB_HOST || 'localhost',
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aurora_cafe',
    waitForConnections: true,  // Queue requests when all connections are busy
    connectionLimit: 10,       // Maximum simultaneous connections
    queueLimit: 0,             // Unlimited queued connection requests
    connectTimeout: 4000
});

// Test the connection without crashing the server if DB is temporarily unreachable
pool.getConnection((err, connection) => {
    if (err) {
        console.warn('⚠️  MySQL connection notice:', err.message);
        console.warn('   The server will continue running with resilient fallback.');
    } else {
        console.log('✅ MySQL connected successfully');
        connection.release();
    }
});

// Export the promise-based version of the pool for use with async/await.
module.exports = pool.promise();
