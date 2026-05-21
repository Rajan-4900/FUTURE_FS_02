import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
} from '../controllers/leadController.js';
import { adminOnly } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

const PIPELINE_STATUSES = ['new', 'contacted', 'proposal_sent', 'converted'];

const leadBodyRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Enter a valid email'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('leadSource')
    .optional()
    .isIn(['website', 'referral', 'linkedin', 'cold_call', 'email', 'event', 'other'])
    .withMessage('Invalid lead source'),
  body('status')
    .optional()
    .isIn(PIPELINE_STATUSES)
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('notes').optional().trim().isLength({ max: 2000 }),
  body('followUpDate')
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (!value) return true;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        throw new Error('Invalid follow-up date');
      }
      return true;
    }),
];

const listRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().trim(),
  query('search').optional().trim(),
  validate,
];

router.use(adminOnly);

router.get('/', listRules, getLeads);
router.get('/:id', param('id').isMongoId().withMessage('Invalid lead ID'), validate, getLead);
router.post('/', leadBodyRules, validate, createLead);
router.patch(
  '/:id/status',
  param('id').isMongoId(),
  body('status').isIn(PIPELINE_STATUSES).withMessage('Invalid pipeline status'),
  validate,
  updateLeadStatus
);
router.put('/:id', param('id').isMongoId(), ...leadBodyRules, validate, updateLead);
router.delete('/:id', param('id').isMongoId(), validate, deleteLead);

export default router;
