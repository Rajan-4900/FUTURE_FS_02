import { AlertCircle, Calendar, Clock } from 'lucide-react';

export default function FollowUpStatCards({ stats, activeFilter, onFilter }) {
  const cards = [
    {
      key: 'overdue',
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      accent: 'text-red-600 bg-red-50',
      alert: stats.overdue > 0,
    },
    {
      key: 'due_today',
      label: 'Due today',
      value: stats.dueToday,
      icon: Calendar,
      accent: 'text-amber-600 bg-amber-50',
    },
    {
      key: 'upcoming',
      label: 'Upcoming',
      value: stats.upcoming,
      icon: Clock,
      accent: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map(({ key, label, value, icon: Icon, accent, alert }) => (
        <button
          key={key}
          type="button"
          onClick={() => onFilter(key)}
          className={`rounded-xl border bg-white p-5 text-left card-shadow transition-all duration-150 hover:card-shadow-md ${
            activeFilter === key ? 'border-primary ring-2 ring-primary/20' : 'border-border/60'
          } ${alert ? 'border-red-200' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">{label}</p>
              <p className={`mt-1 text-2xl font-semibold ${alert ? 'text-red-600' : 'text-slate-900'}`}>
                {value}
              </p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
              <Icon size={20} strokeWidth={1.75} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
