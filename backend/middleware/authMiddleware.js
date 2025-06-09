const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    console.log('Auth header:', req.headers.authorization);
    
    if (req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Extracted token:', token);
    } else {
      console.log('Authorization header does not start with "Bearer "');
    }
  } else {
    console.log('No authorization header found');
  }

  if (token) {
    try {
      console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
      console.log('Received token in middleware:', token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      console.log('Decoded ID:', decoded.id);
      const user = await User.findById(decoded.id).select('-password');
      console.log('User found:', !!user, user?._id);
      if (!user) {
        console.log('User not found in database');
        res.status(401);
        throw new Error('User not found');
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('Database error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// role check
const roleCheck = (role) => {
  return (req, res, next) => {
    console.log('Role check - User:', req.user);
    console.log('Role check - Required role:', role);
    console.log('Role check - User role:', req.user?.role);
    
    if (!req.user) {
      console.log('Role check failed - No user found');
      res.status(401);
      throw new Error('Not authenticated');
    }
    
    if (req.user.role !== role) {
      console.log('Role check failed - Wrong role');
      res.status(403);
      throw new Error(`Not authorized - ${role} access required`);
    }
    
    console.log('Role check passed');
    next();
  };
};

const isAdmin = roleCheck('admin');
const isUser = roleCheck('user');

module.exports = {
  protect,
  isAdmin,
  isUser,
  roleCheck, 
};
