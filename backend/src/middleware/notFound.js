'use strict';

/**
 * Middleware that returns a 404 JSON response for unmatched routes.
 * Register this AFTER all route handlers but BEFORE errorHandler.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = notFound;
