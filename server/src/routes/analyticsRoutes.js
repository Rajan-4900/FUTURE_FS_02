import express from 'express';
import { getAnalyticsSummary } from '../controllers/analyticsController.js';
import { adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(adminOnly);

router.get('/summary', getAnalyticsSummary);

export default router;
