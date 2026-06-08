const { verifyToken } = require('../utils/jwt');

function authenticateSocket(allowedRoles) {
  return (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;

      if (!token) {
        const err = new Error('Authentication required');
        err.data = { code: 4001, message: 'Authentication required' };
        return next(err);
      }

      const decoded = verifyToken(token);
      if (!decoded || !decoded.id || !decoded.role) {
        const err = new Error('Invalid token payload');
        err.data = { code: 4001, message: 'Invalid token payload' };
        return next(err);
      }

      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        const err = new Error('Forbidden: insufficient role');
        err.data = { code: 4003, message: 'Forbidden: insufficient role' };
        return next(err);
      }

      socket.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      const error = new Error('Authentication failed');
      error.data = { code: 4001, message: 'Authentication failed: ' + err.message };
      next(error);
    }
  };
}

module.exports = { authenticateSocket };
