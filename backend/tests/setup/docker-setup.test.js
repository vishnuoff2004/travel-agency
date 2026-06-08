const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

describe('REQ-034 — Modular Architecture (TEST-109)', () => {
  const rootDir = path.join(__dirname, '..', '..', '..');

  test('should have backend Dockerfile', () => {
    const dockerfile = path.join(rootDir, 'backend', 'Dockerfile');
    expect(fs.existsSync(dockerfile)).toBe(true);
    const content = fs.readFileSync(dockerfile, 'utf-8');
    expect(content).toContain('FROM');
    expect(content).toContain('EXPOSE');
  });

  test('should have docker-compose.yml at root', () => {
    const composeFile = path.join(rootDir, 'docker-compose.yml');
    expect(fs.existsSync(composeFile)).toBe(true);
  });

  test('should have backend directory with package.json', () => {
    const pkg = path.join(rootDir, 'backend', 'package.json');
    expect(fs.existsSync(pkg)).toBe(true);
  });

  test('should have src/server.js entry point', () => {
    const serverPath = path.join(rootDir, 'backend', 'src', 'server.js');
    expect(fs.existsSync(serverPath)).toBe(true);
  });

  test('should have .env.example with required keys', () => {
    const envExample = path.join(rootDir, '.env.example');
    expect(fs.existsSync(envExample)).toBe(true);
    const content = fs.readFileSync(envExample, 'utf-8');
    expect(content).toContain('DB_HOST');
    expect(content).toContain('DB_USER');
    expect(content).toContain('DB_PASS');
    expect(content).toContain('DB_NAME');
    expect(content).toContain('JWT_SECRET');
    expect(content).toContain('PORT');
  });

  test('should have .gitignore', () => {
    const gitignore = path.join(rootDir, '.gitignore');
    expect(fs.existsSync(gitignore)).toBe(true);
    const content = fs.readFileSync(gitignore, 'utf-8');
    expect(content).toContain('node_modules');
    expect(content).toContain('.env');
  });
});
