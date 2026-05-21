const LEGACY_MAP = {
  lead: 'new',
  prospect: 'contacted',
  customer: 'converted',
  inactive: 'new',
};

const VALID = ['new', 'contacted', 'proposal_sent', 'converted'];

export const normalizeLeadStatus = (status) => {
  if (VALID.includes(status)) return status;
  return LEGACY_MAP[status] || 'new';
};

export const formatLead = (lead) => {
  const doc = lead.toObject ? lead.toObject() : { ...lead };
  return { ...doc, status: normalizeLeadStatus(doc.status) };
};
