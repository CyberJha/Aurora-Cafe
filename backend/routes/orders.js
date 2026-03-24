/**
 * routes/orders.js
 * Defines all routes under the /api/orders namespace.
 * Keeps routing logic separate from controller business logic.
 */

const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');

// POST /api/orders  →  create a new order
router.post('/', createOrder);

// Can easily extend later:
// GET  /api/orders       → list all orders (admin)
// GET  /api/orders/:id   → get single order by ID

module.exports = router;
