const express = require('express');
const { getAdminAnalytics, getSystemAnalytics } = require('../controllers/analyticsController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin', protectAdmin, getAdminAnalytics);
router.get('/system', protectAdmin, getSystemAnalytics);

module.exports = router;
