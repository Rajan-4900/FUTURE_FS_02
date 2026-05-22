import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getFollowUps,
  getFollowUpStats,
  getTimeline,
  getFollowUp,
  createFollowUp,
  updateFollowUp,
  completeFollowUp,
  deleteFollowUp,
} from '../controllers/followUpController.js';
import { adminOnly } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

const TYPES = ['note', 'reminder', 'call', 'email', 'meeting'];

const createRules = [
  body('lead').isMongoId().withMessage('Valid lead ID is required'),
  body('note').trim().notEmpty().withMessage('Note content is required'),
  body('type').optional().isIn(TYPES),
  body('title').optional().trim().isLength({ max: 200 }),
  body('reminderDate').optional({ values: 'null' }).isISO8601(),
  validate,
];

const updateRules = [
  body('note').optional().trim().notEmpty(),
  body('type').optional().isIn(TYPES),
  body('title').optional().trim().isLength({ max: 200 }),
  body('reminderDate').optional({ values: 'null' }).isISO8601(),
  body('completed').optional().isBoolean(),
  validate,
];

router.use(adminOnly);

router.get('/stats', getFollowUpStats);
router.get('/timeline', getTimeline);
router.get(
  '/',
  query('lead').optional().isMongoId(),
  query('status').optional().isIn(['all', 'overdue', 'upcoming', 'due_today', 'completed']),
  validate,
  getFollowUps
);
router.get('/:id', param('id').isMongoId(), validate, getFollowUp);
router.post('/', createRules, createFollowUp);
router.patch('/:id/complete', param('id').isMongoId(), validate, completeFollowUp);
router.put('/:id', param('id').isMongoId(), updateRules, updateFollowUp);
router.delete('/:id', param('id').isMongoId(), validate, deleteFollowUp);

export default router;
