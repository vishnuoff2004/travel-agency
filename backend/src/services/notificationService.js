const { Notification } = require('../models');

async function sendNotification({ userId, type, title, body, data }) {
  return Notification.create({ userId, type, title, body, data });
}

async function getUserNotifications(userId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const { rows, count } = await Notification.findAndCountAll({
    where: { userId },
    order: [['created_at', 'DESC']],
    offset,
    limit,
  });
  return { data: rows, totalItems: count, page, totalPages: Math.ceil(count / limit) };
}

async function markAsRead(notificationId, userId) {
  const notification = await Notification.findOne({ where: { id: notificationId, userId } });
  if (!notification) return null;
  notification.isRead = true;
  await notification.save();
  return notification;
}

async function markAllAsRead(userId) {
  await Notification.update({ isRead: true }, { where: { userId, isRead: false } });
  return true;
}

async function getUnreadCount(userId) {
  return Notification.count({ where: { userId, isRead: false } });
}

module.exports = { sendNotification, getUserNotifications, markAsRead, markAllAsRead, getUnreadCount };
