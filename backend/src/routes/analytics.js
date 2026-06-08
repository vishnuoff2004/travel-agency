const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const analyticsController = require('../controllers/analyticsController');

const router = Router();

router.get(
  '/bookings-by-date',
  authenticate,
  authorize('admin', 'agency_admin'),
  analyticsController.getBookingsByDate,
);

module.exports = router;