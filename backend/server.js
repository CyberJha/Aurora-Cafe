/**
 * server.js
 * Main Express application entry point.
 * Bootstraps middleware, routes, and starts the HTTP server.
 */

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

// db.js connectivity initialization
require('./db');

const orderRoutes = require('./routes/orders');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/orders', orderRoutes);

// AI Chatbot endpoint for local development
app.post('/api/chat', (req, res) => {
    const { message } = req.body || {};
    const text = (message || '').toLowerCase();
    
    let reply = "Welcome to Aurora Café! I'm Aura, your resident barista and literary guide. May I recommend a Velvet Cappuccino paired with a novel from our fiction shelf?";
    let suggestions = ['Recommend a coffee', 'Book & brew pairing', 'See the menu', 'Skip the line order'];
    let action = null;

    if (/coffee|drink|recommend|cold brew|latte|espresso/i.test(text)) {
        reply = "Our top house recommendation is the **Velvet Cappuccino (₹250)** with silky micro-foam, or our 24-hr steeped **Signature Cold Brew (₹350)** with rich chocolate notes!";
        suggestions = ['Order Velvet Cappuccino', 'Order Cold Brew', 'View Menu'];
        action = { type: 'select_drink', drinkName: 'Velvet Cappuccino' };
    } else if (/book|library|read|shelf/i.test(text)) {
        reply = "Our **Aurora Literary Lounge** features 70+ curated books across 7 distinct categories. You can borrow any title to read at your table!";
        suggestions = ['Explore All Books', 'Book & Brew Pairing', 'Borrow a Book'];
        action = { type: 'scroll_section', sectionId: 'library' };
    }

    res.json({ success: true, reply, suggestions, action });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Aurora Cafe API is running', version: '2.0.0' });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Aurora Cafe API is running', version: '2.0.0' });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong' });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Aurora Cafe API running at http://localhost:${PORT}`);
    console.log(`   Health check → http://localhost:${PORT}/health`);
});
