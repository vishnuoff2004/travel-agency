const redis = require('../config/redis');

function CacheService(redisClient) {
  const client = redisClient || redis;

  async function get(key) {
    const value = await client.get(key);
    if (!value) return null;
    try { return JSON.parse(value); } catch { return value; }
  }

  async function set(key, value, ttl = 60) {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await client.set(key, serialized, 'EX', ttl);
  }

  async function del(key) {
    await client.del(key);
  }

  async function clearNamespace(pattern) {
    let cursor = '0';
    do {
      const result = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = result[0];
      const keys = result[1];
      if (keys.length > 0) await client.del(...keys);
    } while (cursor !== '0');
  }

  return { get, set, del, clearNamespace };
}

module.exports = { CacheService };
