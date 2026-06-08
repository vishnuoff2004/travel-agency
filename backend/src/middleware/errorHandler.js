function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(err.errors && { errors: err.errors }),
  });
}

module.exports = { errorHandler };
