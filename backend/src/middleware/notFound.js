'use strict';

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = notFound;
