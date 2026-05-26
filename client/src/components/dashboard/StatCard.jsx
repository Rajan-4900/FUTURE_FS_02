const accentStyles = {
  blue: 'bg-blue-50 text-primary group-hover:bg-blue-100/80',
  emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100/80',
  amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100/80',
  violet: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100/80',
};

export default function StatCard({ label, value, change, icon: Icon, trend, accent = 'blue' }) {
  const trendColor =
    trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-muted';

  return (
    <div className="group rounded-xl border border-border/60 bg-surface p-5 card-shadow transition-all duration-200 ease-out hover:card-shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-muted tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          {change && <p className={`mt-1.5 text-xs leading-relaxed ${trendColor}`}>{change}</p>}
        </div>
        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${accentStyles[accent]}`}
          >
            <Icon size={20} strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  );
}
