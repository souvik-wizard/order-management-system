'use strict';

/**
 * Central app configuration derived from environment variables.
 * Import this module wherever config values are needed instead of
 * reading process.env directly.
 */
const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/order-management',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
};

module.exports = config;
