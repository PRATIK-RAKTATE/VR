const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const getAdminDashboard = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: 'Admin Dashboard',
  });
});

module.exports = { getAdminDashboard };