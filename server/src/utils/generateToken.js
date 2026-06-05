import jwt from 'jsonwebtoken';
import { formatUser } from './formatUser.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not defined. Using a default development JWT secret.');
}

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const sendTokenResponse = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: formatUser(user),
  });
};
