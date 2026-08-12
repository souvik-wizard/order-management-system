'use strict';

const { ORDER_STATUSES } = require('../models/Order');

/**
 * Validation helpers — return { valid: true } or { valid: false, errors: [] }
 */

const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;

/**
 * Validate a POST /api/orders request body.
 */
const validateCreateOrder = (req, res, next) => {
  const errors = [];
  const { customer, items } = req.body;

  // ── Customer ────────────────────────────────────────────────────────────────
  if (!customer || typeof customer !== 'object') {
    errors.push('customer is required');
  } else {
    if (!customer.name || !customer.name.trim()) errors.push('customer.name is required');
    if (!customer.address || !customer.address.trim()) errors.push('customer.address is required');
    if (!customer.phone || !customer.phone.trim()) {
      errors.push('customer.phone is required');
    } else if (!PHONE_REGEX.test(customer.phone.trim())) {
      errors.push('customer.phone is not a valid phone number');
    }
  }

  // ── Items ───────────────────────────────────────────────────────────────────
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('items must be a non-empty array');
  } else {
    items.forEach((item, idx) => {
      if (!item.menuItemId) {
        errors.push(`items[${idx}].menuItemId is required`);
      }
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1) {
        errors.push(`items[${idx}].quantity must be a positive integer`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  next();
};

/**
 * Validate a PATCH /api/orders/:id/status request body.
 */
const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'status is required' });
  }

  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${ORDER_STATUSES.join(', ')}`,
    });
  }

  next();
};

module.exports = { validateCreateOrder, validateUpdateStatus };
