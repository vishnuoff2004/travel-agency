const redis = require('../config/redis');

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 1000;
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 10;

const whitelist = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

function buildRateLimitKey(ip, endpoint) {
  const windowStart = Math.floor(Date.now() / WINDOW_MS);
  return `ratelimit:${ip}:${endpoint}:${windowStart}`;
}

function rateLimiter(req, res, next) {
  if (req.path === '/api/health' || whitelist.has(req.ip)) {
    return next();
  }

  const key = buildRateLimitKey(req.ip, req.path);

  redis.incr(key)
    .then((count) => {
      if (count === 1) {
        return redis.expire(key, Math.ceil(WINDOW_MS / 1000));
      }
    })
    .then(() => redis.get(key))
    .then((count) => {
      if (parseInt(count, 10) > MAX_REQUESTS) {
        return res.status(429).set('Retry-After', '1').json({ error: 'Too many requests' });
      }
      next();
    })
    .catch(() => next());
}

module.exports = { rateLimiter, buildRateLimitKey, whitelist };
