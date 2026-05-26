import Lead from '../models/Lead.js';
import Deal from '../models/Deal.js';
import asyncHandler from '../utils/asyncHandler.js';
import { normalizeLeadStatus } from '../utils/normalizeLeadStatus.js';

const SOURCE_LABELS = {
  website: 'Website',
  referral: 'Referral',
  linkedin: 'LinkedIn',
  cold_call: 'Cold Call',
  email: 'Email',
  event: 'Event',
  other: 'Other',
};

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  proposal_sent: 'Proposal Sent',
  converted: 'Converted',
};

export const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const timeframe = req.query.timeframe || '6'; // Months

  // 1. Fetch raw data belonging to the owner
  const leads = await Lead.find({ owner: ownerId });
  const deals = await Deal.find({ owner: ownerId });

  // 2. Filter leads by timeframe
  const filteredLeads = leads.filter((lead) => {
    if (timeframe !== 'all') {
      const monthsAgo = parseInt(timeframe, 10);
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);
      const leadDate = new Date(lead.createdAt);
      if (leadDate < cutoffDate) return false;
    }
    return true;
  });

  // 3. Filter deals by timeframe
  const filteredDeals = deals.filter((deal) => {
    if (timeframe !== 'all') {
      const monthsAgo = parseInt(timeframe, 10);
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);
      const dealDate = new Date(deal.createdAt);
      if (dealDate < cutoffDate) return false;
    }
    return true;
  });

  // 4. Compute KPI Metrics
  const totalLeads = filteredLeads.length;
  const convertedLeads = filteredLeads.filter((l) => normalizeLeadStatus(l.status) === 'converted').length;
  const conversionRate = totalLeads > 0 ? parseFloat(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0;

  const pipelineValue = filteredDeals
    .filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    .reduce((sum, d) => sum + (d.value || 0), 0);

  const wonDeals = filteredDeals.filter((d) => d.stage === 'closed_won');
  const avgDealSize = wonDeals.length > 0
    ? parseFloat((wonDeals.reduce((sum, d) => sum + (d.value || 0), 0) / wonDeals.length).toFixed(2))
    : 0;

  // 5. Monthly Leads Trend
  const monthlyLeadsData = [];
  const monthsToShow = timeframe === 'all' ? 12 : parseInt(timeframe, 10);

  // Initialize a continuous map for the past N months
  const monthlyCounts = {};
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyCounts[key] = { name: key, leads: 0, conversions: 0 };
  }

  filteredLeads.forEach((lead) => {
    const date = new Date(lead.createdAt);
    const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (monthlyCounts[key]) {
      monthlyCounts[key].leads += 1;
      if (normalizeLeadStatus(lead.status) === 'converted') {
        monthlyCounts[key].conversions += 1;
      }
    }
  });

  const monthlyLeadsTrend = Object.values(monthlyCounts);

  // 6. Monthly Conversion Rate Trend
  const monthlyConversionRateTrend = monthlyLeadsTrend.map((data) => {
    const rate = data.leads > 0 ? parseFloat(((data.conversions / data.leads) * 100).toFixed(1)) : 0;
    return {
      name: data.name,
      Rate: rate,
    };
  });

  // 7. Lead Source Breakdown
  const sources = {};
  filteredLeads.forEach((lead) => {
    const src = lead.leadSource || 'other';
    sources[src] = (sources[src] || 0) + 1;
  });

  const leadSourcesBreakdown = Object.entries(sources).map(([key, val]) => ({
    name: SOURCE_LABELS[key] || key,
    value: val,
  }));

  // 8. Status Distribution
  const statuses = { new: 0, contacted: 0, proposal_sent: 0, converted: 0 };
  filteredLeads.forEach((lead) => {
    const status = normalizeLeadStatus(lead.status) || 'new';
    if (statuses[status] !== undefined) {
      statuses[status] += 1;
    }
  });

  const statusDistribution = Object.entries(statuses).map(([key, val]) => ({
    name: STATUS_LABELS[key] || key,
    value: val,
  }));

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalLeads,
        convertedLeads,
        conversionRate,
        pipelineValue,
        avgDealSize,
      },
      charts: {
        monthlyLeadsTrend,
        monthlyConversionRateTrend,
        leadSourcesBreakdown,
        statusDistribution,
      },
    },
  });
});
