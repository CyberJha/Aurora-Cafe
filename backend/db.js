/**
 * db.js
 * Creates and exports a MySQL connection pool.
 * A pool reuses connections efficiently instead of
 * creating a new connection for every query.
 */

const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool using environment variables for credentials.
// mysql2's pool automatically handles acquiring/releasing connections.
const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,  // Queue requests when all connections are busy
    connectionLimit: 10,       // Maximum simultaneous connections
    queueLimit: 0              // Unlimited queued connection requests
});

// Immediately test the connection to catch misconfiguration at startup.
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL connection failed:', err.message);
        process.exit(1); // Exit process so issues are visible immediately
    }
    console.log('✅ MySQL connected successfully');
    connection.release(); // Return connection back to the pool
});

// Export the promise-based version of the pool for use with async/await.
module.exports = pool.promise();
