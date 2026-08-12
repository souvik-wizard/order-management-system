'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const config = require('./config/config');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// ── Route imports ──────────────────────────────────────────────────────────────
const healthRoutes = require('./routes/healthRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ── Connect to MongoDB ─────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// ── Express app ────────────────────────────────────────────────────────────────
const app = express();

// ── Core middleware ────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (config.isDev) {
  app.use(morgan('dev'));
}

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// ── 404 & error handling ───────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ───────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`✅  Server running on http://localhost:${config.port} [${config.nodeEnv}]`);
  });
}

module.exports = app;
