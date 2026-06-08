const { Op } = require('sequelize');
const { Event } = require('../models');

async function list({ startDate, endDate, page = 1, pageSize = 10 }) {
  const where = {};
  if (startDate) where.startDate = { [Op.gte]: startDate };
  if (endDate) where.endDate = { [Op.lte]: endDate };

  const offset = (page - 1) * pageSize;
  const { count, rows } = await Event.findAndCountAll({
    where: Object.keys(where).length ? where : undefined,
    order: [['startDate', 'ASC']],
    limit: pageSize,
    offset,
  });

  return { data: rows, pagination: { page, pageSize, total: count, totalPages: Math.ceil(count / pageSize) } };
}

async function create(data) {
  return Event.create(data);
}

async function update(id, data) {
  const evt = await Event.findByPk(id);
  if (!evt) return null;
  return evt.update(data);
}

async function remove(id) {
  const evt = await Event.findByPk(id);
  if (!evt) return null;
  return evt.destroy();
}

module.exports = { list, create, update, remove };