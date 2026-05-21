export const PIPELINE_COLUMNS = [
  { id: 'new', title: 'New', accent: 'bg-slate-100 text-slate-600' },
  { id: 'contacted', title: 'Contacted', accent: 'bg-blue-50 text-blue-700' },
  { id: 'proposal_sent', title: 'Proposal Sent', accent: 'bg-violet-50 text-violet-700' },
  { id: 'converted', title: 'Converted', accent: 'bg-emerald-50 text-emerald-700' },
];

export const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  proposal_sent: 'Proposal Sent',
  converted: 'Converted',
  // legacy mapping labels (display only)
  lead: 'New',
  prospect: 'Contacted',
  customer: 'Converted',
  inactive: 'New',
};

export const LEGACY_STATUS_MAP = {
  lead: 'new',
  prospect: 'contacted',
  customer: 'converted',
  inactive: 'new',
};

export const normalizeLeadStatus = (status) =>
  LEGACY_STATUS_MAP[status] || status || 'new';

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const SOURCE_LABELS = {
  website: 'Website',
  referral: 'Referral',
  linkedin: 'LinkedIn',
  cold_call: 'Cold call',
  email: 'Email',
  event: 'Event',
  other: 'Other',
};

export const STATUS_OPTIONS = PIPELINE_COLUMNS.map((col) => ({
  value: col.id,
  label: col.title,
}));

export const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const SOURCE_OPTIONS = Object.entries(SOURCE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const emptyLeadForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  leadSource: 'website',
  status: 'new',
  priority: 'medium',
  notes: '',
  followUpDate: '',
};

export const leadToForm = (lead) => ({
  name: lead.name || '',
  email: lead.email || '',
  phone: lead.phone || '',
  company: lead.company || '',
  leadSource: lead.leadSource || 'website',
  status: normalizeLeadStatus(lead.status),
  priority: lead.priority || 'medium',
  notes: lead.notes || '',
  followUpDate: lead.followUpDate
    ? new Date(lead.followUpDate).toISOString().split('T')[0]
    : '',
});
