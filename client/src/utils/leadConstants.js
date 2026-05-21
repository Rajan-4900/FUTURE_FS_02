export const STATUS_LABELS = {
  lead: 'Lead',
  prospect: 'Prospect',
  customer: 'Customer',
  inactive: 'Inactive',
};

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

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
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
  status: 'lead',
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
  status: lead.status || 'lead',
  priority: lead.priority || 'medium',
  notes: lead.notes || '',
  followUpDate: lead.followUpDate
    ? new Date(lead.followUpDate).toISOString().split('T')[0]
    : '',
});
