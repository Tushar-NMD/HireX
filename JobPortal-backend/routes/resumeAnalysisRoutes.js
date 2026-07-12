const express = require('express');
const { analyzeResumeMatch } = require('../controllers/resumeAnalysisController');
const { protectUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Analyze resume match with job
router.post('/analyze-resume/:jobId', protectUser, analyzeResumeMatch);

module.exports = router;
