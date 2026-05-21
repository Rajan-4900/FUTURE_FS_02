const accentStyles = {
  blue: 'bg-blue-50 text-primary group-hover:bg-blue-100',
  emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
  amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
  violet: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100',
};

export default function StatCard({ label, value, change, icon: Icon, trend, accent = 'blue' }) {
  const trendColor =
    trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-muted';

  return (
    <div className="group rounded-xl border border-border/60 bg-surface p-5 card-shadow transition-shadow duration-150 hover:card-shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
          {change && <p className={`mt-1.5 text-xs ${trendColor}`}>{change}</p>}
        </div>
        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ${accentStyles[accent]}`}
          >
            <Icon size={20} strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  );
}
