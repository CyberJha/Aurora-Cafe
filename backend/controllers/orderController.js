/**
 * controllers/orderController.js
 * Handles all business logic for order submissions.
 * Separated from routing for clean, testable code.
 */

const db = require('../db');

/**
 * POST /api/orders
 * Validates the request body, then inserts the order
 * into MySQL using a parameterised prepared statement 
 * to prevent SQL injection.
 */
const createOrder = async (req, res) => {
    const { customer_name, phone_number, item_name, quantity, special_notes } = req.body;

    // ── Input Validation ──────────────────────────────────────────────────────
    // All required fields must be present and non-empty strings/numbers.
    const errors = [];

    if (!customer_name || typeof customer_name !== 'string' || customer_name.trim().length === 0) {
        errors.push('customer_name is required.');
    }
    if (!phone_number || typeof phone_number !== 'string' || phone_number.trim().length === 0) {
        errors.push('phone_number is required.');
    }
    if (!item_name || typeof item_name !== 'string' || item_name.trim().length === 0) {
        errors.push('item_name is required.');
    }
    if (!quantity || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
        errors.push('quantity must be a positive integer.');
    }

    // Return a 400 Bad Request if any validation fails.
    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    // ── Database Insertion ────────────────────────────────────────────────────
    // Using placeholders (?) for a prepared statement.
    // mysql2 escapes these values automatically, blocking SQL injection.
    const sql = `
        INSERT INTO orders (customer_name, phone_number, item_name, quantity, special_notes)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        customer_name.trim(),
        phone_number.trim(),
        item_name.trim(),
        Number(quantity),
        special_notes ? special_notes.trim() : null   // Optional field - store NULL if empty
    ];

    try {
        const [result] = await db.execute(sql, values);

        // result.insertId is the auto-generated primary key of the new row.
        return res.status(201).json({
            success: true,
            message: 'Order saved successfully',
            order_id: result.insertId
        });
    } catch (err) {
        // Log the full error server-side but don't expose DB internals to client.
        console.error('❌ Database error while saving order:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
};

module.exports = { createOrder };
