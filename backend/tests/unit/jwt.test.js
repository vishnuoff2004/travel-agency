const jwt = require('../../src/utils/jwt');

describe('TEST-105 — JWT Utility', () => {
  const user = { id: 1, role: 'traveler' };

  test('should generate a token with id and role', () => {
    const token = jwt.generateToken(user);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  test('should verify a valid token and return decoded payload', () => {
    const token = jwt.generateToken(user);
    const decoded = jwt.verifyToken(token);
    expect(decoded.id).toBe(1);
    expect(decoded.role).toBe('traveler');
  });

  test('should throw on expired token', () => {
    const expiredToken = jwt.generateToken(user, { expiresIn: '0s' });
    expect(() => jwt.verifyToken(expiredToken)).toThrow('Token expired');
  });

  test('should throw on invalid token', () => {
    expect(() => jwt.verifyToken('invalid.token.here')).toThrow('Invalid token');
  });

  test('should throw on malformed token string', () => {
    expect(() => jwt.verifyToken('not-a-jwt')).toThrow();
  });
});
