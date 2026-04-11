const logger = require('../utils/logger');

const sendErrorDev = (err, res) => {
  logger.error(`${err.status || 500} - ${err.message}`, { stack: err.stack });
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    logger.warn(`${err.status} - ${err.message}`);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  // Programming or other unknown error: don't leak error details
  } else {
    logger.error('CRITICAL ERROR ⭐', { error: err.message, stack: err.stack });
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    sendErrorProd(error, res);
  } else {
    sendErrorDev(err, res);
  }
};
