const express = require('express');
const {
  getAdminDashboardStats,
  getUsers,
  toggleUserStatus,
  updateUserRole,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');

const router = express.Router();

// Admin routes require both JWT authentication and admin role
router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.patch('/users/:id/role', updateUserRole);

module.exports = router;
