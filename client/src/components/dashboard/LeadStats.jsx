import { STATUS_LABELS } from '../../utils/formatters';

const STATUS_COLORS = {
  lead: 'bg-slate-400',
  prospect: 'bg-blue-500',
  customer: 'bg-emerald-500',
  inactive: 'bg-slate-300',
};

export default function LeadStats({ byStatus, total, conversionRate }) {
  const items = Object.entries(STATUS_LABELS).map(([key, label]) => ({
    key,
    label,
    count: byStatus?.[key] || 0,
  }));

  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Conversion rate
          </p>
          <p className="mt-0.5 text-xl font-semibold text-slate-900">{conversionRate}%</p>
        </div>
        <p className="text-sm text-muted">
          <span className="font-medium text-slate-700">{byStatus?.customer || 0}</span> of{' '}
          {total} converted
        </p>
      </div>

      <div className="space-y-4">
        {items.map(({ key, label, count }) => (
          <div key={key}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{label}</span>
              <span className="text-muted">{count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${STATUS_COLORS[key]}`}
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
