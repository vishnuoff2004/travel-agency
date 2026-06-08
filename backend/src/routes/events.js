const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const eventController = require('../controllers/eventController');

const router = Router();

router.get('/', authenticate, eventController.list);
router.post('/', authenticate, authorize('admin'), eventController.create);
router.put('/:id', authenticate, authorize('admin'), eventController.update);
router.delete('/:id', authenticate, authorize('admin'), eventController.remove);

module.exports = router;