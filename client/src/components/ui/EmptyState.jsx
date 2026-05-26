import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-14 sm:py-20">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 mb-5 shadow-xs transition-transform duration-300 hover:scale-105 hover:rotate-2">
          <Icon size={24} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-800 tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
