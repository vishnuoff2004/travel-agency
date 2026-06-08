const reportsService = require('../services/reportsService');

async function getAgencyPerformance(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 10, 1), 100);
    const result = await reportsService.getAgencyPerformance(page, pageSize);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAgencyPerformance };