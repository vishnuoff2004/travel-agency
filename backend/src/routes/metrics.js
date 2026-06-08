const { Router } = require('express');
const { metricsEndpoint } = require('../monitoring/metrics');

const router = Router();
router.get('/', metricsEndpoint);

module.exports = router;