import { Menu } from 'lucide-react';

export default function Header({ title, subtitle, onMenuClick, action }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface/95 px-4 backdrop-blur-sm md:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="icon-shell icon-shell-sm text-slate-600 transition-colors duration-150 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={16} strokeWidth={2} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-sm text-muted hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
