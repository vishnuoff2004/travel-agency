const { Router } = require('express');
const bookingController = require('../controllers/bookingController');

const router = Router();

router.post('/', bookingController.create);
router.get('/', bookingController.list);
router.get('/:id', bookingController.getById);
router.get('/:id/status', bookingController.getStatus);
router.get('/:id/status-history', bookingController.getStatusHistory);
router.put('/:id/cancel', bookingController.cancel);

module.exports = router;
