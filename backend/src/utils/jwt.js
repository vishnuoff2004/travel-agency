const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'travel-agency-jwt-secret-dev';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

function generateToken(user, options) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: options && options.expiresIn ? options.expiresIn : JWT_EXPIRY,
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
}

module.exports = { generateToken, verifyToken };
