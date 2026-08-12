'use strict';

const config = require('../config/config');

/**
 * CORS options — restrict origins to the configured frontend URL.
 * In development, also allow localhost variants for convenience.
 */
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [config.frontendUrl];

    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = corsOptions;
