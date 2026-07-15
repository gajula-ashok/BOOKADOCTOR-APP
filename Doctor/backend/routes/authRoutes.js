const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require('../Controllers/authController');
const { protect } = require('../Middlewares/authMiddleware');
const upload = require('../Middlewares/uploadMiddleware');
router.post('/register', upload.single('profilePhoto'), registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profilePhoto'), updateUserProfile);
module.exports = router;