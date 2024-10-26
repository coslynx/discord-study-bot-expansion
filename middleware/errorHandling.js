const { StatusCodes } = require('http-status-codes');
const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong';

  res.status(status).json({ message });
};

module.exports = errorHandler;