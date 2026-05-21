import FollowUp from '../models/FollowUp.js';
import Lead from '../models/Lead.js';
import asyncHandler from '../utils/asyncHandler.js';
import { formatFollowUp, getFollowUpStatus } from '../utils/followUpHelpers.js';

const buildFilter = (ownerId, query) => {
  const filter = { owner: ownerId };

  if (query.lead) filter.lead = query.lead;

  if (query.status === 'overdue') {
    filter.completed = false;
    filter.reminderDate = { $lt: new Date(), $ne: null };
  } else if (query.status === 'upcoming') {
    filter.completed = false;
    filter.reminderDate = { $gte: new Date() };
  } else if (query.status === 'due_today') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    filter.completed = false;
    filter.reminderDate = { $gte: start, $lte: end };
  } else if (query.status === 'completed') {
    filter.completed = true;
  }

  return filter;
};

export const getFollowUps = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = buildFilter(req.user._id, req.query);

  const [items, total] = await Promise.all([
    FollowUp.find(filter)
      .populate('lead', 'name email company status')
      .sort({ reminderDate: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    FollowUp.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items.map(formatFollowUp),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  });
});

export const getFollowUpStats = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const now = new Date();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const [overdue, dueToday, upcoming, totalPending] = await Promise.all([
    FollowUp.countDocuments({
      owner: ownerId,
      completed: false,
      reminderDate: { $lt: now, $ne: null },
    }),
    FollowUp.countDocuments({
      owner: ownerId,
      completed: false,
      reminderDate: { $gte: start, $lte: end },
    }),
    FollowUp.countDocuments({
      owner: ownerId,
      completed: false,
      reminderDate: { $gt: end },
    }),
    FollowUp.countDocuments({
      owner: ownerId,
      completed: false,
      reminderDate: { $ne: null },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: { overdue, dueToday, upcoming, totalPending },
  });
});

export const getTimeline = asyncHandler(async (req, res) => {
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 30);

  const items = await FollowUp.find({ owner: req.user._id })
    .populate('lead', 'name email company')
    .sort('-createdAt')
    .limit(limit);

  res.status(200).json({
    success: true,
    data: items.map(formatFollowUp),
  });
});

export const getFollowUp = asyncHandler(async (req, res) => {
  const item = await FollowUp.findOne({ _id: req.params.id, owner: req.user._id }).populate(
    'lead',
    'name email company'
  );

  if (!item) {
    return res.status(404).json({ success: false, message: 'Follow-up not found' });
  }

  res.status(200).json({ success: true, data: formatFollowUp(item) });
});

export const createFollowUp = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ _id: req.body.lead, owner: req.user._id });
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  const followUp = await FollowUp.create({
    ...req.body,
    owner: req.user._id,
  });

  const populated = await FollowUp.findById(followUp._id).populate('lead', 'name email company');
  res.status(201).json({ success: true, data: formatFollowUp(populated) });
});

export const updateFollowUp = asyncHandler(async (req, res) => {
  let item = await FollowUp.findOne({ _id: req.params.id, owner: req.user._id });
  if (!item) {
    return res.status(404).json({ success: false, message: 'Follow-up not found' });
  }

  const updates = { ...req.body };
  if (updates.completed === true && !item.completed) {
    updates.completedAt = new Date();
  }
  if (updates.completed === false) {
    updates.completedAt = null;
  }

  item = await FollowUp.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate('lead', 'name email company');

  res.status(200).json({ success: true, data: formatFollowUp(item) });
});

export const completeFollowUp = asyncHandler(async (req, res) => {
  let item = await FollowUp.findOne({ _id: req.params.id, owner: req.user._id });
  if (!item) {
    return res.status(404).json({ success: false, message: 'Follow-up not found' });
  }

  item = await FollowUp.findByIdAndUpdate(
    req.params.id,
    { completed: true, completedAt: new Date() },
    { new: true }
  ).populate('lead', 'name email company');

  res.status(200).json({ success: true, data: formatFollowUp(item) });
});

export const deleteFollowUp = asyncHandler(async (req, res) => {
  const item = await FollowUp.findOne({ _id: req.params.id, owner: req.user._id });
  if (!item) {
    return res.status(404).json({ success: false, message: 'Follow-up not found' });
  }
  await item.deleteOne();
  res.status(200).json({ success: true, message: 'Follow-up deleted' });
});
