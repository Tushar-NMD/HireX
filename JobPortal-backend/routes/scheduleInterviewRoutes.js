const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/authMiddleware');
const {
  scheduleInterview,
  getInterviewDetails,
  cancelInterview
} = require('../controllers/scheduleInterviewController');

// Schedule interview for an application
router.post('/:applicationId/schedule', protectAdmin, scheduleInterview);

// Get interview details
router.get('/:applicationId', protectAdmin, getInterviewDetails);

// Cancel interview
router.delete('/:applicationId/cancel', protectAdmin, cancelInterview);

module.exports = router;
