/**
 * api/feedback.js
 * Vercel Serverless Function for /api/feedback
 */

const feedbackStore = [];

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        return res.status(200).json({ success: true, count: feedbackStore.length, reviews: feedbackStore });
    }

    if (req.method === 'POST') {
        const { name, text, rating } = req.body || {};
        if (!name || !text) {
            return res.status(400).json({ success: false, message: 'Name and review text are required' });
        }
        const review = {
            id: Date.now(),
            name: name.trim(),
            text: text.trim(),
            rating: Number(rating) || 5,
            created_at: new Date().toISOString()
        };
        feedbackStore.unshift(review);
        return res.status(201).json({ success: true, message: 'Review received', review });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
};
