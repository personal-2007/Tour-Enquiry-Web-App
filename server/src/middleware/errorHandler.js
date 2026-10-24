/**
 * Centralized error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Unhandled Error]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  // Handle specific database errors (PostgreSQL codes)
  if (err.code === '23505') { // unique_violation
    return res.status(409).json({
      success: false,
      message: 'A record with this information already exists.',
    });
  }

  if (err.code === '23514') { // check_violation
    return res.status(400).json({
      success: false,
      message: 'Data constraint validation failed.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error. Please try again later.'
    : err.message || 'Something went wrong.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
  });
};

/**
 * 404 Not Found handler for undefined API routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
