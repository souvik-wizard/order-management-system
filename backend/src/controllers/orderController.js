'use strict';

const orderService = require('../services/orderService');
const Order = require('../models/Order');

const { ORDER_STATUSES } = Order;

/**
 * SSE client map: orderId → Set of response objects
 * Allows multiple browser tabs to subscribe to the same order.
 */
const sseClients = new Map();

// ── Status simulation ──────────────────────────────────────────────────────────

/**
 * After an order is created, simulate the status progression in the background.
 * Updates MongoDB and broadcasts to any SSE subscribers.
 *
 * Timeline:
 *  +0s  ORDER_RECEIVED  (already set on creation)
 *  +6s  PREPARING
 *  +14s OUT_FOR_DELIVERY
 */
const simulateStatusProgression = (orderId) => {
  const id = orderId.toString();

  const broadcast = (status) => {
    const clients = sseClients.get(id);
    if (clients) {
      clients.forEach((res) => {
        res.write(`data: ${JSON.stringify({ status })}\n\n`);
      });
    }
  };

  const updateAndBroadcast = async (status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      broadcast(status);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`SSE simulation error for order ${id}:`, err.message);
    }
  };

  setTimeout(() => updateAndBroadcast('PREPARING'), 6_000);
  setTimeout(() => updateAndBroadcast('OUT_FOR_DELIVERY'), 14_000);
};

// ── Controllers ────────────────────────────────────────────────────────────────

/**
 * POST /api/orders
 */
const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    simulateStatusProgression(order._id);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders
 */
const getOrders = async (_req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/orders/:id/status
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/orders/:id
 */
const deleteOrder = async (req, res, next) => {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id/status/stream
 * Server-Sent Events endpoint.
 * Immediately sends the current status, then pushes updates as the simulation runs.
 * Closes after OUT_FOR_DELIVERY is reached or the client disconnects.
 */
const streamOrderStatus = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
    res.flushHeaders();

    // Send current status immediately
    res.write(`data: ${JSON.stringify({ status: order.status })}\n\n`);

    // If already at final status, close immediately
    if (order.status === 'OUT_FOR_DELIVERY') {
      res.write('event: done\ndata: {}\n\n');
      return res.end();
    }

    // Register this client
    if (!sseClients.has(id)) sseClients.set(id, new Set());
    sseClients.get(id).add(res);

    // Heartbeat to keep connection alive through proxies
    const heartbeat = setInterval(() => {
      res.write(': ping\n\n');
    }, 20_000);

    // Clean up when client disconnects
    req.on('close', () => {
      clearInterval(heartbeat);
      const clients = sseClients.get(id);
      if (clients) {
        clients.delete(res);
        if (clients.size === 0) sseClients.delete(id);
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  streamOrderStatus,
};
