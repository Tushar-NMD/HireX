const express = require('express');
const { parseJobFromPrompt } = require('../controllers/aiJobParserController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Parse job from natural language prompt
router.post('/parse-job', protectAdmin, parseJobFromPrompt);

module.exports = router;
