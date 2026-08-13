'use strict';

const express = require('express');
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  streamOrderStatus,
} = require('../controllers/orderController');

const { validateCreateOrder, validateUpdateStatus } = require('../middleware/validate');


// POST   /api/orders          — place a new order
// GET    /api/orders          — list all orders
// GET    /api/orders/:id      — get single order
// PATCH  /api/orders/:id/status — update order status
// DELETE /api/orders/:id      — delete an order
// GET    /api/orders/:id/status/stream — SSE status stream


router.post('/', validateCreateOrder, createOrder);
router.get('/', getOrders);

// SSE route must come BEFORE /:id to avoid id matching "status"
router.get('/:id/status/stream', streamOrderStatus);

router.get('/:id', getOrderById);
router.patch('/:id/status', validateUpdateStatus, updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
