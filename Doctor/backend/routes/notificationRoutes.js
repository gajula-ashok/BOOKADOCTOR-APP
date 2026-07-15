const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAllRead,
  markNotificationRead
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');
router.use(protect);
router.get('/', getNotifications);
router.put('/read', markAllRead);
router.put('/:id/read', markNotificationRead);
module.exports = router;