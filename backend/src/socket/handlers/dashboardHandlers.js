function registerDashboardHandlers(io) {
  const dashboardNamespace = io.of('/dashboard');
  let statsInterval = null;

  return {
    emitDashboardAlert(alertType, message, data) {
      dashboardNamespace.emit('dashboard:alert', {
        type: alertType,
        message,
        data,
        timestamp: new Date().toISOString(),
      });
    },

    startStatsBroadcast(fetchStatsFn) {
      if (statsInterval) clearInterval(statsInterval);
      statsInterval = setInterval(async () => {
        try {
          const stats = await fetchStatsFn();
          dashboardNamespace.emit('dashboard:stats', stats);
        } catch (err) {
          console.error('Dashboard stats broadcast error:', err.message);
        }
      }, 30000);
    },

    stopStatsBroadcast() {
      if (statsInterval) {
        clearInterval(statsInterval);
        statsInterval = null;
      }
    },
  };
}

module.exports = { registerDashboardHandlers };
