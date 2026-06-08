const { Router } = require('express');
const { authorize } = require('../middleware/rbac');
const driverController = require('../controllers/driverController');

const router = Router();

router.post('/profile', authorize('driver', 'admin'), driverController.createProfile);
router.put('/profile', authorize('driver', 'admin'), driverController.updateProfile);
router.post('/routes', authorize('driver', 'admin'), driverController.createRoute);
router.put('/routes/:id/availability', authorize('driver', 'admin'), driverController.setRouteAvailability);
router.put('/bookings/:id/accept', authorize('driver', 'admin'), driverController.acceptBooking);
router.put('/bookings/:id/reject', authorize('driver', 'admin'), driverController.rejectBooking);
router.put('/bookings/:id/status', authorize('driver', 'admin'), driverController.updateTripStatus);
router.put('/availability', authorize('driver', 'admin'), driverController.setAvailability);

module.exports = router;
