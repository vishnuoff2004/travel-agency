const { Op } = require('sequelize');
const { Route, Driver, Agency } = require('../models');
const { CacheService } = require('../cache/CacheService');
const redis = require('../config/redis');

const cache = CacheService(redis);
const SEARCH_CACHE_TTL = 60;

function buildSearchCacheKey(source, destination) {
  return `search:${source || '*'}:${destination || '*'}`;
}

async function searchRoutes(source, destination) {
  const cacheKey = buildSearchCacheKey(source, destination);
  const cached = await cache.get(cacheKey);
  if (cached) {
    return { data: cached };
  }

  const where = { available: true };
  if (source) {
    where.source = { [Op.like]: `%${source}%` };
  }
  if (destination) {
    where.destination = { [Op.like]: `%${destination}%` };
  }

  const routes = await Route.findAll({
    where,
    include: [
      {
        model: Driver,
        include: [{ model: Agency, where: { active: true } }],
      },
    ],
  });

  const data = routes.map(route => ({
    id: route.id,
    source: route.source,
    destination: route.destination,
    departureTime: route.departureTime,
    arrivalTime: route.arrivalTime,
    fare: route.fare,
    capacity: route.capacity,
    available: route.available,
    driverId: route.Driver.id,
    driverName: route.Driver.name,
    vehicleType: route.Driver.vehicleType,
    agencyId: route.Driver.Agency.id,
    agencyName: route.Driver.Agency.name,
  }));

  await cache.set(cacheKey, data, SEARCH_CACHE_TTL);

  if (data.length === 0) {
    return { data, message: 'No routes found for this destination' };
  }

  return { data };
}

module.exports = { searchRoutes };
