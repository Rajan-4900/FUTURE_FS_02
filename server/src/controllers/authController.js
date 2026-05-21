import User from '../models/User.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import { formatUser } from '../utils/formatUser.js';
import asyncHandler from '../utils/asyncHandler.js';

const INVALID_CREDENTIALS = 'Invalid email or password';

export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, company, setupKey } = req.body;

  const adminCount = await User.countDocuments({ role: 'admin' });

  if (adminCount > 0) {
    const validKey =
      process.env.ADMIN_SETUP_KEY && setupKey === process.env.ADMIN_SETUP_KEY;

    if (!validKey) {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is restricted. A valid setup key is required.',
      });
    }
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email is already registered' });
  }

  const user = await User.create({
    name,
    email,
    password,
    company,
    role: 'admin',
  });

  sendTokenResponse(res, user, 201);
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, role: 'admin' }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: INVALID_CREDENTIALS });
  }

  sendTokenResponse(res, user);
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: formatUser(req.user),
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, company } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, company },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    user: formatUser(user),
  });
});
