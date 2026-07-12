const express = require('express');
const { applyForJob, getMyApplications } = require('../controllers/applicationController');
const { generateInterviewQuestions, evaluateAnswer, submitInterview, startConversationalInterview, getNextQuestion, completeConversationalInterview } = require('../controllers/interviewController');
const { parseResumeText } = require('../controllers/resumeParserController');
const { protectUser } = require('../middleware/authMiddleware');
const { uploadResume } = require('../config/cloudinary');

const router = express.Router();

// User applies for job
router.post('/:jobId', protectUser, uploadResume.single('resume'), applyForJob);

// User gets their applications
router.get('/my-applications', protectUser, getMyApplications);

// Resume parsing
router.post('/parse-resume', protectUser, parseResumeText);

// Old interview routes (batch questions)
router.post('/:applicationId/interview/questions', protectUser, generateInterviewQuestions);
router.post('/generate-interview-questions/:applicationId', protectUser, generateInterviewQuestions);
router.post('/:applicationId/interview/evaluate', protectUser, evaluateAnswer);
router.post('/:applicationId/interview/submit', protectUser, submitInterview);

// New conversational interview routes (one question at a time)
router.post('/:applicationId/interview/start', protectUser, startConversationalInterview);
router.post('/:applicationId/interview/next', protectUser, getNextQuestion);
router.post('/:applicationId/interview/complete', protectUser, completeConversationalInterview);

module.exports = router;
