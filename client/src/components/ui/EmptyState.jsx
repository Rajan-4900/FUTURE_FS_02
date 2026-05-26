import Button from './Button';

export default function EmptyState({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 lg:p-16 border border-dashed border-border/80 rounded-2xl bg-white/50 backdrop-blur-sm max-w-xl mx-auto my-6 ${className}`}>
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary mb-5 shadow-sm ring-4 ring-primary/2">
          <Icon size={24} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-base font-semibold tracking-tight text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} size="sm">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
