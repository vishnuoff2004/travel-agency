function registerBookingHandlers(io) {
  const bookingsNamespace = io.of('/bookings');

  return {
    emitBookingCreated(booking, userId) {
      bookingsNamespace.to(`user:${userId}`).emit('booking:created', {
        bookingId: booking.id,
        status: booking.status,
        routeId: booking.routeId,
        travelDate: booking.travelDate,
        createdAt: new Date().toISOString(),
      });
    },

    emitBookingStatusChanged(booking, userId, previousStatus) {
      bookingsNamespace.to(`user:${userId}`).emit('booking:status-changed', {
        bookingId: booking.id,
        previousStatus,
        newStatus: booking.status,
        updatedAt: new Date().toISOString(),
      });
    },

    emitBookingCancelled(booking, userId) {
      bookingsNamespace.to(`user:${userId}`).emit('booking:cancelled', {
        bookingId: booking.id,
        status: booking.status,
        cancelReason: booking.cancelReason || null,
        updatedAt: new Date().toISOString(),
      });
    },
  };
}

module.exports = { registerBookingHandlers };
