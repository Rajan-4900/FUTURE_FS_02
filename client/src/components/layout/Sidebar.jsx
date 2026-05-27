import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Handshake, Settings, LogOut, X, Columns3, Bell, LineChart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFollowUpStats } from '../../hooks/useFollowUpStats';
import FollowUpBadge from '../followups/FollowUpBadge';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/leads', icon: Users, label: 'Leads' },
  { to: '/pipeline', icon: Columns3, label: 'Pipeline' },
  { to: '/follow-ups', icon: Bell, label: 'Follow-ups', badge: 'overdue' },
  { to: '/deals', icon: Handshake, label: 'Deals' },
  { to: '/analytics', icon: LineChart, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ onNavigate, onClose }) {
  const { user, logout } = useAuth();
  const { stats } = useFollowUpStats(60000);

  const handleNav = () => onNavigate?.();

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-slate-300">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-700/50 px-5">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.svg"
            alt="Future CRM logo"
            className="h-8 w-8 rounded-lg shadow-sm"
          />
          <div>
            <p className="text-sm font-semibold text-white tracking-tight">Future CRM</p>
            <p className="text-[11px] text-slate-500">Admin panel</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Menu
        </p>
        {navItems.map(({ to, icon: Icon, label, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={handleNav}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
                )}
                <Icon size={18} strokeWidth={1.75} />
                <span className="flex-1">{label}</span>
                {badge === 'overdue' && <FollowUpBadge count={stats.overdue} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-slate-700/50 p-4">
        <div className="mb-3 flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-xs font-semibold text-white ring-2 ring-slate-600/30">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition-all duration-200 hover:bg-slate-800/50 hover:text-slate-200"
        >
          <LogOut size={18} strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
