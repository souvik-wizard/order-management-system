'use strict';

const notFound = (_req, res, next) => {
  const error = new Error('Not Found');
  error.statusCode = 404;
  next(error);
};

module.exports = notFound;
