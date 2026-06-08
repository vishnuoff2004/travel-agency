function createRealtimeMiddleware(io) {
  return function realtimeMiddleware(req, res, next) {
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      if (res.statusCode === 201 && req.originalUrl?.includes('/api/bookings')) {
        const bookingHandlers = req.app.get('bookingHandlers');
        if (bookingHandlers && body?.id) {
          bookingHandlers.emitBookingCreated(body, req.user.id);
        }
      }
      return originalJson(body);
    };
    next();
  };
}

module.exports = { createRealtimeMiddleware };
