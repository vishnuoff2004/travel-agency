const path = require('path');
const fs = require('fs');

describe('REQ-034, REQ-037 — Architecture (TEST-112)', () => {
  const routesDir = path.join(__dirname, '../../src/routes');
  const controllersDir = path.join(__dirname, '../../src/controllers');
  const middlewareDir = path.join(__dirname, '../../src/middleware');
  const servicesDir = path.join(__dirname, '../../src/services');
  const validationsDir = path.join(__dirname, '../../src/validations');

  test('should have routes directory', () => {
    expect(fs.existsSync(routesDir)).toBe(true);
  });

  test('should have auth route file', () => {
    expect(fs.existsSync(path.join(routesDir, 'auth.js'))).toBe(true);
  });

  test('should have bookings route file', () => {
    expect(fs.existsSync(path.join(routesDir, 'bookings.js'))).toBe(true);
  });

  test('should have drivers route file', () => {
    expect(fs.existsSync(path.join(routesDir, 'drivers.js'))).toBe(true);
  });

  test('should have agency route file', () => {
    expect(fs.existsSync(path.join(routesDir, 'agency.js'))).toBe(true);
  });

  test('should have admin route file', () => {
    expect(fs.existsSync(path.join(routesDir, 'admin.js'))).toBe(true);
  });

  test('should have search route file', () => {
    expect(fs.existsSync(path.join(routesDir, 'search.js'))).toBe(true);
  });

  test('should have dashboard route file', () => {
    expect(fs.existsSync(path.join(routesDir, 'dashboard.js'))).toBe(true);
  });

  test('should have controllers directory', () => {
    expect(fs.existsSync(controllersDir)).toBe(true);
  });

  test('should have middleware directory', () => {
    expect(fs.existsSync(middlewareDir)).toBe(true);
  });

  test('should have services directory', () => {
    expect(fs.existsSync(servicesDir)).toBe(true);
  });

  test('should have validations directory', () => {
    expect(fs.existsSync(validationsDir)).toBe(true);
  });

  test('should have auth middleware file', () => {
    expect(fs.existsSync(path.join(middlewareDir, 'auth.js'))).toBe(true);
  });

  test('should have RBAC middleware file', () => {
    expect(fs.existsSync(path.join(middlewareDir, 'rbac.js'))).toBe(true);
  });

  test('should have error handler middleware file', () => {
    expect(fs.existsSync(path.join(middlewareDir, 'errorHandler.js'))).toBe(true);
  });
});
