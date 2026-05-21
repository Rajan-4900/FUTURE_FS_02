import Lead from '../models/Lead.js';
import asyncHandler from '../utils/asyncHandler.js';

const buildFilter = (ownerId, { search, status }) => {
  const filter = { owner: ownerId };

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: regex }, { email: regex }, { company: regex }, { phone: regex }];
  }

  return filter;
};

export const getLeads = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = buildFilter(req.user._id, req.query);

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort('-createdAt').skip(skip).limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: leads,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  });
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  res.status(200).json({ success: true, data: lead });
});

export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, data: lead });
});

export const updateLead = asyncHandler(async (req, res) => {
  let lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: lead });
});

export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  await lead.deleteOne();
  res.status(200).json({ success: true, message: 'Lead deleted successfully' });
});
