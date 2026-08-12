'use strict';

const express = require('express');
const router = express.Router();

/**
 * Placeholder product routes.
 * Full implementation will be added in the next step.
 *
 * GET  /api/products       – list all products
 * GET  /api/products/:id   – get single product
 * POST /api/products       – create product
 * PUT  /api/products/:id   – update product
 * DELETE /api/products/:id – delete product
 */

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Products route – coming soon', data: [] });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, message: `Product ${req.params.id} – coming soon`, data: null });
});

module.exports = router;
