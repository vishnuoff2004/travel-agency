const { Router } = require('express');
const { authorize } = require('../middleware/rbac');
const dashboardController = require('../controllers/dashboardController');

const router = Router();

router.get('/user', dashboardController.getUserDashboard);
router.get('/driver', authorize('driver', 'admin'), dashboardController.getDriverDashboard);
router.get('/admin', authorize('admin'), dashboardController.getAdminDashboard);

module.exports = router;
