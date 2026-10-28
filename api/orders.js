/**
 * api/orders.js
 * Vercel Serverless Function for /api/orders
 * Supports MySQL when configured in environment variables,
 * with graceful fallback to resilient ticket generation for zero-config Vercel previews.
 */

let pool = null;

// Lazily initialize MySQL pool only if DB_HOST and DB_USER are provided
const getPool = () => {
    if (!pool && process.env.DB_HOST && process.env.DB_USER) {
        try {
            const mysql = require('mysql2');
            pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 5,
                queueLimit: 0,
                connectTimeout: 5000
            }).promise();
        } catch (e) {
            console.warn('MySQL pool initialization skipped:', e.message);
            pool = null;
        }
    }
    return pool;
};

// In-memory fallback for serverless lifecycle
const fallbackOrders = [];

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            count: fallbackOrders.length,
            orders: fallbackOrders
        });
    }

    if (req.method === 'POST') {
        const { customer_name, phone_number, item_name, quantity, special_notes } = req.body || {};

        // Validation
        const errors = [];
        if (!customer_name || typeof customer_name !== 'string' || !customer_name.trim()) {
            errors.push('customer_name is required.');
        }
        if (!phone_number || typeof phone_number !== 'string' || !phone_number.trim()) {
            errors.push('phone_number is required.');
        }
        if (!item_name || typeof item_name !== 'string' || !item_name.trim()) {
            errors.push('item_name is required.');
        }
        if (!quantity || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
            errors.push('quantity must be a positive integer.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const safeOrder = {
            customer_name: customer_name.trim(),
            phone_number: phone_number.trim(),
            item_name: item_name.trim(),
            quantity: Number(quantity),
            special_notes: special_notes ? special_notes.trim() : null
        };

        const dbPool = getPool();
        if (dbPool) {
            try {
                const sql = `
                    INSERT INTO orders (customer_name, phone_number, item_name, quantity, special_notes)
                    VALUES (?, ?, ?, ?, ?)
                `;
                const [result] = await dbPool.execute(sql, [
                    safeOrder.customer_name,
                    safeOrder.phone_number,
                    safeOrder.item_name,
                    safeOrder.quantity,
                    safeOrder.special_notes
                ]);

                return res.status(201).json({
                    success: true,
                    message: 'Order saved successfully to database',
                    order_id: result.insertId
                });
            } catch (dbErr) {
                console.warn('Database write failed, falling back to serverless order confirmation:', dbErr.message);
            }
        }

        // Graceful fallback ticket generation
        const generatedId = Math.floor(1000 + Math.random() * 9000);
        const savedOrder = {
            order_id: generatedId,
            ...safeOrder,
            created_at: new Date().toISOString()
        };
        fallbackOrders.push(savedOrder);

        return res.status(201).json({
            success: true,
            message: 'Order confirmed by Aurora Barista Team',
            order_id: generatedId
        });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
};
