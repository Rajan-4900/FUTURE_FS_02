export default function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div
      className={`rounded-xl bg-surface card-shadow border border-border/60 ${padding ? 'p-5 md:p-6' : ''} ${hover ? 'transition-all duration-200 ease-out hover:card-shadow-md hover:-translate-y-0.5' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-[13px] text-muted mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
