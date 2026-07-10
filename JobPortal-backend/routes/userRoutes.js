const express = require('express');
const { registerUser, loginUser, getUserProfile, uploadUserProfilePic, updateUserProfile } = require('../controllers/userController');
const { protectUser } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes
router.get('/profile', protectUser, getUserProfile);
router.put('/profile', protectUser, updateUserProfile);
router.post('/upload-profile-pic', protectUser, upload.single('profilePic'), uploadUserProfilePic);

module.exports = router;




