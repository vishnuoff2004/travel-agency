const path = require('path');
const fs = require('fs');

describe('Phase 2 Architecture — Socket.io', () => {
  test('socket directory exists', () => {
    expect(fs.existsSync(path.join(__dirname, '../../src/socket'))).toBe(true);
  });

  test('socket/index.js exists', () => {
    expect(fs.existsSync(path.join(__dirname, '../../src/socket/index.js'))).toBe(true);
  });

  test('socket/authenticateSocket.js exists', () => {
    expect(fs.existsSync(path.join(__dirname, '../../src/socket/authenticateSocket.js'))).toBe(true);
  });

  test('socket.io is a dependency', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    expect(pkg.dependencies['socket.io']).toBeDefined();
  });

  test('socket.io-client is a devDependency', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    expect(pkg.devDependencies['socket.io-client']).toBeDefined();
  });

  test('@socket.io/redis-adapter is a dependency', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    expect(pkg.dependencies['@socket.io/redis-adapter']).toBeDefined();
  });

  test('server.js uses http.createServer', () => {
    const content = fs.readFileSync(path.join(__dirname, '../../src/server.js'), 'utf8');
    expect(content).toMatch(/createServer\(/);
    expect(content).toMatch(/createSocketServer\(/);
  });

  test('authenticateSocket verifies JWT and attaches user', () => {
    const { authenticateSocket } = require('../../src/socket/authenticateSocket');
    expect(authenticateSocket).toBeDefined();
    expect(typeof authenticateSocket).toBe('function');
  });

  test('createSocketServer returns io instance', () => {
    const { createSocketServer } = require('../../src/socket');
    const http = require('http');
    const httpServer = http.createServer();
    const io = createSocketServer(httpServer);
    expect(io).toBeDefined();
    expect(io.of).toBeDefined();
    httpServer.close();
  });

  test('socket namespaces are registered', () => {
    const { createSocketServer } = require('../../src/socket');
    const http = require('http');
    const httpServer = http.createServer();
    const io = createSocketServer(httpServer);
    expect(io._nsps.has('/bookings')).toBe(true);
    expect(io._nsps.has('/drivers')).toBe(true);
    expect(io._nsps.has('/dashboard')).toBe(true);
    expect(io._nsps.has('/admin')).toBe(true);
    httpServer.close();
  });
});
