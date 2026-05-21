import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/leadController.js';
import { adminOnly } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

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
    .isIn(['lead', 'prospect', 'customer', 'inactive'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('notes').optional().trim().isLength({ max: 2000 }),
  body('followUpDate').optional({ values: 'null' }).isISO8601().withMessage('Invalid follow-up date'),
];

const listRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status')
    .optional()
    .isIn(['all', 'lead', 'prospect', 'customer', 'inactive']),
  query('search').optional().trim(),
  validate,
];

router.use(adminOnly);

router.get('/', listRules, getLeads);
router.get('/:id', param('id').isMongoId().withMessage('Invalid lead ID'), validate, getLead);
router.post('/', leadBodyRules, validate, createLead);
router.put('/:id', param('id').isMongoId(), ...leadBodyRules, validate, updateLead);
router.delete('/:id', param('id').isMongoId(), validate, deleteLead);

export default router;
