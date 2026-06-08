const announcementService = require('../services/announcementService');

async function listActive(req, res, next) {
  try {
    const announcements = await announcementService.listActive();
    res.json(announcements);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const announcement = await announcementService.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(announcement);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const announcement = await announcementService.update(req.params.id, req.body);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.json(announcement);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const announcement = await announcementService.remove(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.json({ message: 'Announcement deactivated' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listActive, create, update, remove };