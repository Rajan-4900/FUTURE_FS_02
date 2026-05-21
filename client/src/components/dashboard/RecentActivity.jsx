import { Link } from 'react-router-dom';
import { UserPlus, Handshake, Clock } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';

const typeConfig = {
  contact: { icon: UserPlus, href: '/contacts', label: 'Contact' },
  deal: { icon: Handshake, href: '/deals', label: 'Deal' },
};

export default function RecentActivity({ items }) {
  if (!items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock size={32} className="text-slate-300" strokeWidth={1.5} />
        <p className="mt-3 text-sm font-medium text-slate-600">No recent activity</p>
        <p className="mt-1 text-xs text-muted">Add contacts or deals to see updates here.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((item) => {
        const config = typeConfig[item.type];
        const Icon = config.icon;

        return (
          <li key={`${item.type}-${item.id}`}>
            <Link
              to={config.href}
              className="flex items-start gap-3 px-1 py-4 transition-colors duration-150 hover:bg-slate-50/80 sm:gap-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors duration-150 group-hover:bg-slate-200">
                <Icon size={16} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                  <Badge status={item.status}>{item.statusLabel}</Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">{item.subtitle}</p>
                <p className="mt-1 text-xs text-muted">
                  {config.label} · {formatDate(item.date)}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
