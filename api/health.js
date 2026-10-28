/**
 * api/health.js
 * Vercel Serverless Function for /api/health
 */

module.exports = (req, res) => {
    res.status(200).json({
        status: 'ok',
        app: 'Aurora Cafe & Literary Lounge',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        features: {
            library: '7 categories, 70+ books',
            ai_chatbot: 'Aura - Barista & Literary Sommelier',
            serverless: true
        }
    });
};
