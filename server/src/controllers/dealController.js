import Deal from '../models/Deal.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDeals = asyncHandler(async (req, res) => {
  const deals = await Deal.find({ owner: req.user._id })
    .populate('contact', 'name email company')
    .sort('-createdAt');

  res.status(200).json({ success: true, count: deals.length, data: deals });
});

export const getDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ _id: req.params.id, owner: req.user._id }).populate(
    'contact',
    'name email company'
  );

  if (!deal) {
    return res.status(404).json({ success: false, message: 'Deal not found' });
  }

  res.status(200).json({ success: true, data: deal });
});

export const createDeal = asyncHandler(async (req, res) => {
  req.body.owner = req.user._id;
  const deal = await Deal.create(req.body);
  res.status(201).json({ success: true, data: deal });
});

export const updateDeal = asyncHandler(async (req, res) => {
  let deal = await Deal.findOne({ _id: req.params.id, owner: req.user._id });

  if (!deal) {
    return res.status(404).json({ success: false, message: 'Deal not found' });
  }

  deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('contact', 'name email company');

  res.status(200).json({ success: true, data: deal });
});

export const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findOne({ _id: req.params.id, owner: req.user._id });

  if (!deal) {
    return res.status(404).json({ success: false, message: 'Deal not found' });
  }

  await deal.deleteOne();
  res.status(200).json({ success: true, message: 'Deal removed' });
});

export const getDealStats = asyncHandler(async (req, res) => {
  const deals = await Deal.find({ owner: req.user._id });

  const stats = {
    total: deals.length,
    totalValue: deals.reduce((sum, d) => sum + d.value, 0),
    byStage: {
      qualification: 0,
      proposal: 0,
      negotiation: 0,
      closed_won: 0,
      closed_lost: 0,
    },
  };

  deals.forEach((deal) => {
    stats.byStage[deal.stage]++;
  });

  res.status(200).json({ success: true, data: stats });
});
