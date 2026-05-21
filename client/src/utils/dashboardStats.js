import { STAGE_LABELS } from './formatters';
import { STATUS_LABELS, normalizeLeadStatus } from './leadConstants';

const OPEN_DEAL_STAGES = ['qualification', 'proposal', 'negotiation'];

export function computeLeadStats(leads = [], deals = []) {
  const normalized = leads.map((l) => ({ ...l, status: normalizeLeadStatus(l.status) }));

  const totalLeads = normalized.length;
  const convertedLeads = normalized.filter((l) => l.status === 'converted').length;
  const pendingFollowups = normalized.filter((l) =>
    ['new', 'contacted', 'proposal_sent'].includes(l.status)
  ).length;
  const revenuePotential = deals
    .filter((d) => OPEN_DEAL_STAGES.includes(d.stage))
    .reduce((sum, d) => sum + (d.value || 0), 0);

  const byStatus = {
    new: 0,
    contacted: 0,
    proposal_sent: 0,
    converted: 0,
  };
  normalized.forEach((l) => {
    if (byStatus[l.status] !== undefined) byStatus[l.status]++;
  });

  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  return {
    totalLeads,
    convertedLeads,
    pendingFollowups,
    revenuePotential,
    byStatus,
    conversionRate,
  };
}

export function buildRecentActivity(leads = [], deals = [], limit = 8) {
  const leadItems = leads.map((l) => ({
    id: l._id,
    type: 'contact',
    title: l.name,
    subtitle: l.company || l.email || 'No company',
    status: normalizeLeadStatus(l.status),
    statusLabel: STATUS_LABELS[normalizeLeadStatus(l.status)] || l.status,
    date: new Date(l.updatedAt || l.createdAt),
  }));

  const dealItems = deals.map((d) => ({
    id: d._id,
    type: 'deal',
    title: d.title,
    subtitle: d.contact?.name || 'No contact linked',
    status: d.stage,
    statusLabel: STAGE_LABELS[d.stage],
    date: new Date(d.updatedAt || d.createdAt),
  }));

  return [...leadItems, ...dealItems]
    .sort((a, b) => b.date - a.date)
    .slice(0, limit);
}
