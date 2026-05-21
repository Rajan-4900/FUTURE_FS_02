import express from 'express';
import { body } from 'express-validator';
import {
  registerAdmin,
  loginAdmin,
  getMe,
  logout,
  updateProfile,
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

const emailRule = body('email').trim().isEmail().withMessage('Enter a valid email address');
const passwordRule = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');
const nameRule = body('name').trim().notEmpty().withMessage('Name is required');

const registerRules = [nameRule, emailRule, passwordRule, validate];
const loginRules = [
  emailRule,
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

router.post('/admin/register', registerRules, registerAdmin);
router.post('/admin/login', loginRules, loginAdmin);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/profile', adminOnly, updateProfile);

export default router;
