const notificationService = require('../services/notificationService');

async function listNotifications(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const result = await notificationService.getUserNotifications(req.user.id, page);
    res.json(result);
  } catch (err) { next(err); }
}

async function markRead(req, res, next) {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) { next(err); }
}

async function markAllRead(req, res, next) {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) { next(err); }
}

async function unreadCount(req, res, next) {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (err) { next(err); }
}

module.exports = { listNotifications, markRead, markAllRead, unreadCount };
