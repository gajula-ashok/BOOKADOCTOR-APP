const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment
} = require('../Controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
router.post('/book', protect, upload.single('medicalReport'), bookAppointment);
router.get('/', protect, getAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.delete('/:id', protect, deleteAppointment);
module.exports = router;