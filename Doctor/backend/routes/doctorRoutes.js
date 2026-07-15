const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  applyAsDoctor
} = require('../Controllers/doctorController');
const { protect } = require('../Middlewares/authMiddleware');
const upload = require('../Middlewares/uploadMiddleware');
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post(
  '/apply',
  protect,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'certificates', maxCount: 10 }
  ]),
  applyAsDoctor
);
module.exports = router;