'use strict';

const errorHandler = (err, req, res, _next) => {
  // Fix: correct operator precedence vs the original placeholder
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  const isDev = process.env.NODE_ENV !== 'production';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = errorHandler;
