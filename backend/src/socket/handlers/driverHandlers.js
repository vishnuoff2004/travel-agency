function registerDriverHandlers(io) {
  const driversNamespace = io.of('/drivers');

  return {
    emitAvailabilityChanged(driverId, userId, available) {
      driversNamespace.to(`driver:${userId}`).emit('driver:availability-changed', {
        driverId,
        available,
        updatedAt: new Date().toISOString(),
      });
      driversNamespace.to('agency:management').emit('driver:availability-changed', {
        driverId,
        available,
        updatedAt: new Date().toISOString(),
      });
    },

    emitDriverAssigned(bookingId, driverId, userId) {
      driversNamespace.to(`driver:${userId}`).emit('driver:assigned', {
        bookingId,
        driverId,
        assignedAt: new Date().toISOString(),
      });
    },
  };
}

module.exports = { registerDriverHandlers };
