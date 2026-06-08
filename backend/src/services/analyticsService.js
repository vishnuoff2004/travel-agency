const { Op, fn, col, literal } = require('sequelize');
const { Booking } = require('../models');
const { CacheService } = require('../cache/CacheService');
const redis = require('../config/redis');

const cache = CacheService(redis);
const ANALYTICS_CACHE_TTL = 300;

function buildAnalyticsCacheKey(startDate, endDate) {
  return `analytics:bookings-by-date:${startDate || '*'}:${endDate || '*'}`;
}

async function getBookingsByDate(startDate, endDate) {
  const cacheKey = buildAnalyticsCacheKey(startDate, endDate);
  const cached = await cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const where = {};
  if (startDate) {
    where.travelDate = { ...(where.travelDate || {}), [Op.gte]: startDate };
  }
  if (endDate) {
    where.travelDate = { ...(where.travelDate || {}), [Op.lte]: endDate };
  }

  const results = await Booking.findAll({
    attributes: [
      [fn('DATE', col('travelDate')), 'date'],
      [fn('COUNT', col('id')), 'count'],
    ],
    where: Object.keys(where).length > 0 ? where : undefined,
    group: [fn('DATE', col('travelDate'))],
    order: [[fn('DATE', col('travelDate')), 'ASC']],
    raw: true,
  });

  const data = results.map(r => ({
    date: r.date,
    count: Number(r.count),
  }));

  await cache.set(cacheKey, data, ANALYTICS_CACHE_TTL);
  return data;
}

module.exports = { getBookingsByDate };