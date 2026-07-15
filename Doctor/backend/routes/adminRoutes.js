const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  deleteUser,
  getDoctorApplications,
  approveDoctor,
  rejectDoctor,
  getAdminDoctors,
  suspendDoctor,
  deleteDoctor,
  addDoctor
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
// Protect all routes inside this router for Admins only
router.use(protect, restrictTo('admin'));
router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/applications', getDoctorApplications);
router.put('/approve-doctor/:id', approveDoctor);
router.put('/reject-doctor/:id', rejectDoctor);
router.get('/doctors', getAdminDoctors);
router.put('/suspend-doctor/:id', suspendDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.post('/add-doctor', upload.single('profilePhoto'), addDoctor);
module.exports = router;