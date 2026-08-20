'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (_req, res) => {
  const timestamp = new Date().toISOString();
  console.log('Health check ping received at ' + timestamp);

  res.json({
    success: true,
    message: 'Order Management API is running',
    timestamp: timestamp,
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
