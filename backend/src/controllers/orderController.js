'use strict';

const orderService = require('../services/orderService');
const Order = require('../models/Order');

const { ORDER_STATUSES } = Order;



// ── Status simulation ──────────────────────────────────────────────────────────

/**
 * After an order is created, simulate the status progression in the background.
 * Writes status changes to MongoDB — the SSE polling endpoint reads from DB.
 *
 * Timeline:
 *  +0s  ORDER_RECEIVED  (already set on creation)
 *  +6s  PREPARING
 *  +14s OUT_FOR_DELIVERY
 */
const simulateStatusProgression = (orderId) => {
  const id = orderId.toString();

  const updateStatus = async (status) => {
    try {
      await orderService.updateOrderStatus(id, status);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Status simulation error for order ${id}:`, err.message);
    }
  };

  setTimeout(() => updateStatus('PREPARING'), 6_000);
  setTimeout(() => updateStatus('OUT_FOR_DELIVERY'), 14_000);
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
 * Server-Sent Events endpoint — DB-polling strategy.
 *
 * Instead of relying on an in-memory sseClients Map (which is lost if the
 * server restarts or sleeps on Render's free tier), this endpoint polls
 * MongoDB every 3 seconds and pushes the status whenever it changes.
 * This makes the SSE stream fully stateless and resilient to server restarts.
 *
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
    res.setHeader('X-Accel-Buffering', 'no'); // disable nginx/Render proxy buffering
    res.flushHeaders();

    // Send current status immediately
    let lastStatus = order.status;
    res.write(`data: ${JSON.stringify({ status: lastStatus })}\n\n`);

    // If already at final status, close immediately
    if (lastStatus === 'OUT_FOR_DELIVERY') {
      res.write('event: done\ndata: {}\n\n');
      return res.end();
    }

    let closed = false;

    // Heartbeat every 15s — keeps connection alive through Render's proxy
    // (Render has ~55s idle timeout; 15s is safely within that window)
    const heartbeat = setInterval(() => {
      if (!closed) res.write(': ping\n\n');
    }, 15_000);

    // Poll MongoDB every 3 seconds for status changes
    const pollInterval = setInterval(async () => {
      if (closed) return;
      try {
        const fresh = await orderService.getOrderById(id);
        if (!fresh) return;

        if (fresh.status !== lastStatus) {
          lastStatus = fresh.status;
          res.write(`data: ${JSON.stringify({ status: lastStatus })}\n\n`);

          // Close stream once final status is reached
          if (lastStatus === 'OUT_FOR_DELIVERY') {
            res.write('event: done\ndata: {}\n\n');
            closed = true;
            clearInterval(heartbeat);
            clearInterval(pollInterval);
            res.end();
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`SSE poll error for order ${id}:`, err.message);
      }
    }, 3_000);

    // Clean up when client disconnects
    req.on('close', () => {
      closed = true;
      clearInterval(heartbeat);
      clearInterval(pollInterval);
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
