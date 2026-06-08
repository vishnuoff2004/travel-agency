const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const reportsController = require('../controllers/reportsController');

const router = Router();

router.get(
  '/agency-performance',
  authenticate,
  authorize('admin', 'agency_admin'),
  reportsController.getAgencyPerformance,
);

module.exports = router;