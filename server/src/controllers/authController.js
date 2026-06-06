import User from '../models/User.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import { formatUser } from '../utils/formatUser.js';
import asyncHandler from '../utils/asyncHandler.js';
import { addDevUser } from '../utils/devUserStore.js';

const INVALID_CREDENTIALS = 'Invalid email or password';

export const registerAdmin = asyncHandler(async (req, res) => {
  console.log('[auth] registerAdmin request body:', { ...req.body, password: req.body.password ? '***' : undefined });
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

  // Persist admin to local dev store so accounts survive server restarts when
  // using an in-memory MongoDB during development.
  try {
    await addDevUser(user.toObject());
  } catch (err) {
    console.warn('[auth] failed to write dev user store:', err.message);
  }

  console.log('[auth] created admin:', { id: user._id.toString(), email: user.email });

  sendTokenResponse(res, user, 201);
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log('[auth] login attempt for:', email);

  const user = await User.findOne({ email, role: 'admin' }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    console.log('[auth] login failed for:', email);
    return res.status(401).json({ success: false, message: INVALID_CREDENTIALS });
  }

  console.log('[auth] login success for:', email, 'id:', user._id.toString());
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

export const getSetupStatus = asyncHandler(async (_req, res) => {
  const adminCount = await User.countDocuments({ role: 'admin' });
  res.status(200).json({
    success: true,
    needsSetup: adminCount === 0,
    adminOnly: true,
  });
});

export const debugUsers = asyncHandler(async (_req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ success: false });
  }
  const users = await User.find().select('-password');
  res.status(200).json({ success: true, count: users.length, users });
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
