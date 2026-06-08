const { Announcement } = require('../models');

async function listActive() {
  return Announcement.findAll({ where: { active: true }, order: [['createdAt', 'DESC']] });
}

async function create(data) {
  return Announcement.create(data);
}

async function update(id, data) {
  const ann = await Announcement.findByPk(id);
  if (!ann) return null;
  return ann.update(data);
}

async function remove(id) {
  const ann = await Announcement.findByPk(id);
  if (!ann) return null;
  ann.active = false;
  return ann.save();
}

module.exports = { listActive, create, update, remove };