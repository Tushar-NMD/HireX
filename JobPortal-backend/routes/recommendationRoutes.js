const express = require('express');
const { getRecommendations } = require('../controllers/recommendationController');
const { protectUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/recommendations', protectUser, getRecommendations);

module.exports = router;
