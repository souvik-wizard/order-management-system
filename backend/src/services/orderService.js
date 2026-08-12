'use strict';

const mongoose = require('mongoose');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

/**
 * Order service — all business logic for orders.
 * Prices and totals are ALWAYS computed from MongoDB, never trusted from the client.
 */

/**
 * Create a new order.
 * - Validates that every menuItemId exists in MongoDB.
 * - Fetches authoritative prices from MongoDB.
 * - Computes per-item subtotals and order total.
 *
 * @param {{ customer: Object, items: Array }} data
 * @returns {Promise<Object>} the saved order
 */
const createOrder = async ({ customer, items }) => {
  // Validate & collect IDs
  const menuItemIds = items.map((i) => i.menuItemId);

  // Check for invalid ObjectIds early
  const invalidIds = menuItemIds.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    const err = new Error(`Invalid menu item ID(s): ${invalidIds.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  // Fetch all referenced menu items in one query
  const menuItems = await MenuItem.find({ _id: { $in: menuItemIds }, isAvailable: true }).lean();

  // Check every requested item exists and is available
  const foundIds = new Set(menuItems.map((m) => m._id.toString()));
  const missingIds = menuItemIds.filter((id) => !foundIds.has(id.toString()));
  if (missingIds.length > 0) {
    const err = new Error(`Menu item(s) not found or unavailable: ${missingIds.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  // Build a lookup map id → menuItem
  const menuMap = {};
  menuItems.forEach((m) => { menuMap[m._id.toString()] = m; });

  // Compute order items using DB prices
  const orderItems = items.map((requestedItem) => {
    const menuItem = menuMap[requestedItem.menuItemId.toString()];
    const quantity = Number(requestedItem.quantity);
    const price = menuItem.price;
    const subtotal = parseFloat((price * quantity).toFixed(2));

    return {
      menuItemId: menuItem._id,
      name: menuItem.name,
      price,
      quantity,
      subtotal,
    };
  });

  // Compute total
  const totalAmount = parseFloat(
    orderItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)
  );

  const order = await Order.create({
    customer,
    items: orderItems,
    totalAmount,
    status: 'ORDER_RECEIVED',
  });

  return order;
};

/**
 * Return all orders, newest first.
 * @returns {Promise<Array>}
 */
const getAllOrders = async () => {
  return Order.find().sort({ createdAt: -1 }).lean();
};

/**
 * Return a single order by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const getOrderById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid order ID');
    err.statusCode = 400;
    throw err;
  }
  return Order.findById(id).lean();
};

/**
 * Update the status of an order.
 * @param {string} id
 * @param {string} status
 * @returns {Promise<Object|null>}
 */
const updateOrderStatus = async (id, status) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid order ID');
    err.statusCode = 400;
    throw err;
  }
  return Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).lean();
};

/**
 * Delete an order by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const deleteOrder = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid order ID');
    err.statusCode = 400;
    throw err;
  }
  return Order.findByIdAndDelete(id).lean();
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder };
