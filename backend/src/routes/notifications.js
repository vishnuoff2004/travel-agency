const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = Router();

router.use(authenticate);

router.get('/', notificationController.listNotifications);
router.put('/read-all', notificationController.markAllRead);
router.put('/:id/read', notificationController.markRead);
router.get('/unread-count', notificationController.unreadCount);

module.exports = router;
