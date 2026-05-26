import express from 'express';
import authRoutes from './authRoutes.js';
import contactRoutes from './contactRoutes.js';
import leadRoutes from './leadRoutes.js';
import dealRoutes from './dealRoutes.js';
import followUpRoutes from './followUpRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Future CRM API is running' });
});

router.use('/auth', authRoutes);
router.use('/contacts', contactRoutes);
router.use('/leads', leadRoutes);
router.use('/deals', dealRoutes);
router.use('/follow-ups', followUpRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
