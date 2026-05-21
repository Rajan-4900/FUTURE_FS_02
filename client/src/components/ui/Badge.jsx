const statusStyles = {
  new: 'bg-slate-100 text-slate-700',
  contacted: 'bg-blue-50 text-blue-700',
  proposal_sent: 'bg-violet-50 text-violet-700',
  converted: 'bg-emerald-50 text-emerald-700',
  lead: 'bg-slate-100 text-slate-700',
  prospect: 'bg-blue-50 text-blue-700',
  customer: 'bg-emerald-50 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-500',
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-red-50 text-red-700',
  qualification: 'bg-amber-50 text-amber-700',
  proposal: 'bg-blue-50 text-blue-700',
  negotiation: 'bg-violet-50 text-violet-700',
  closed_won: 'bg-emerald-50 text-emerald-700',
  closed_lost: 'bg-red-50 text-red-600',
};

export default function Badge({ children, status }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[status] || 'bg-slate-100 text-slate-600'}`}
    >
      {children}
    </span>
  );
}
