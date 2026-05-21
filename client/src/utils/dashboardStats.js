import { STATUS_LABELS, STAGE_LABELS } from './formatters';

const OPEN_DEAL_STAGES = ['qualification', 'proposal', 'negotiation'];

export function computeLeadStats(contacts = [], deals = []) {
  const totalLeads = contacts.filter((c) => c.status !== 'inactive').length;
  const convertedLeads = contacts.filter((c) => c.status === 'customer').length;
  const pendingFollowups = contacts.filter((c) =>
    ['lead', 'prospect'].includes(c.status)
  ).length;
  const revenuePotential = deals
    .filter((d) => OPEN_DEAL_STAGES.includes(d.stage))
    .reduce((sum, d) => sum + (d.value || 0), 0);

  const byStatus = {
    lead: 0,
    prospect: 0,
    customer: 0,
    inactive: 0,
  };
  contacts.forEach((c) => {
    if (byStatus[c.status] !== undefined) byStatus[c.status]++;
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

export function buildRecentActivity(contacts = [], deals = [], limit = 8) {
  const contactItems = contacts.map((c) => ({
    id: c._id,
    type: 'contact',
    title: c.name,
    subtitle: c.company || c.email || 'No company',
    status: c.status,
    statusLabel: STATUS_LABELS[c.status],
    date: new Date(c.updatedAt || c.createdAt),
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

  return [...contactItems, ...dealItems]
    .sort((a, b) => b.date - a.date)
    .slice(0, limit);
}
