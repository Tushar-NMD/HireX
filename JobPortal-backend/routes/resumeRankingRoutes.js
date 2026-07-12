const express = require('express');
const { getTopResumesForJob } = require('../controllers/resumeRankingController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get top ranked resumes for a specific job
router.get('/top-resumes/:jobId', protectAdmin, getTopResumesForJob);

module.exports = router;
