/**
 * server.js
 * Main Express application entry point.
 * Bootstraps middleware, routes, and starts the HTTP server.
 */

const express = require('express');
const cors    = require('cors');
require('dotenv').config(); // Load .env variables FIRST, before anything else

// db.js is imported early to validate DB connectivity at startup.
require('./db');

const orderRoutes = require('./routes/orders');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────

// CORS: Allow requests from the React Vite dev server (port 5173).
// In production, replace the origin with your actual deployed frontend URL.
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Parse incoming JSON request bodies.
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────

// All order-related routes are prefixed with /api/orders
app.use('/api/orders', orderRoutes);

// Health check endpoint — useful for deployment & uptime monitoring.
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Aurora Cafe API is running' });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
// Catches any request to a route that doesn't exist.
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// Catches any unhandled errors thrown in route/controller code.
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong' });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Aurora Cafe API running at http://localhost:${PORT}`);
    console.log(`   Health check → http://localhost:${PORT}/health`);
});
