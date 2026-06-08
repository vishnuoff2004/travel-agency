const eventService = require('../services/eventService');

async function list(req, res, next) {
  try {
    const { startDate, endDate, page, pageSize } = req.query;
    const result = await eventService.list({ startDate, endDate, page: parseInt(page) || 1, pageSize: parseInt(pageSize) || 10 });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const event = await eventService.create({ ...req.body, organizerId: req.user.id });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const event = await eventService.update(req.params.id, req.body);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const event = await eventService.remove(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };