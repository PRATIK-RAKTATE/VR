const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Admin-only
router.get('/dashboard', protect, isAdmin, getAdminDashboard);

module.exports = router;
