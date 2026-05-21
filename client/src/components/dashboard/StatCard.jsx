export default function StatCard({ label, value, change, icon: Icon, trend }) {
  const trendColor =
    trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-muted';

  return (
    <div className="rounded-xl bg-surface card-shadow border border-border/60 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          {change && <p className={`mt-1 text-xs ${trendColor}`}>{change}</p>}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
            <Icon size={20} strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  );
}
