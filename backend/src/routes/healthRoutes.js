'use strict';

const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Basic liveness probe — returns server status and timestamp.
 */
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Order Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
