import express from 'express';
import {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  getDealStats,
} from '../controllers/dealController.js';
import { adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(adminOnly);

router.get('/stats', getDealStats);
router.route('/').get(getDeals).post(createDeal);
router.route('/:id').get(getDeal).put(updateDeal).delete(deleteDeal);

export default router;
