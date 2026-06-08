const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = Router();

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;
