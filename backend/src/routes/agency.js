const { Router } = require('express');
const agencyController = require('../controllers/agencyController');

const router = Router();

router.post('/drivers', agencyController.addDriver);
router.delete('/drivers/:id', agencyController.removeDriver);
router.get('/drivers', agencyController.getDrivers);
router.get('/bookings', agencyController.getBookings);

module.exports = router;
