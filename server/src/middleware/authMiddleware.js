import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  try {
    let user = await User.findOne({ role: 'admin' });
    if (!user) {
      user = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        company: 'Future CRM',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Auth bypass failed: ' + error.message });
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      });
    }
    next();
  };
};

export const adminOnly = [protect, authorize('admin')];
