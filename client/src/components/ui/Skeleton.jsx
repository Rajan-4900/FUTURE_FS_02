export default function Skeleton({
  variant = 'rect',
  className = '',
  ...props
}) {
  const baseClass = 'animate-pulse bg-slate-200/80 rounded';
  const variantClasses = {
    circle: 'rounded-full',
    rect: 'rounded-xl',
    text: 'h-4 w-3/4 rounded-sm',
  };

  return (
    <div
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/60 bg-surface p-5 card-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" className="w-1/2 h-3.5" />
          <Skeleton variant="text" className="w-1/3 h-7" />
          <Skeleton variant="text" className="w-2/3 h-3" />
        </div>
        <Skeleton variant="circle" className="h-11 w-11 shrink-0" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="border-b border-border last:border-0">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          {i === 0 ? (
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" className="h-9 w-9 shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <Skeleton variant="text" className="w-24 h-3.5" />
                <Skeleton variant="text" className="w-32 h-2.5" />
              </div>
            </div>
          ) : (
            <Skeleton variant="text" className={`h-3 ${i === cols - 1 ? 'w-12 ml-auto' : 'w-20'}`} />
          )}
        </td>
      ))}
    </tr>
  );
}

export function MobileCardSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-start gap-3">
        <Skeleton variant="circle" className="h-9 w-9 shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton variant="text" className="w-24 h-4" />
          <Skeleton variant="text" className="w-32 h-3" />
          <div className="flex gap-1.5 pt-1">
            <Skeleton variant="rect" className="w-14 h-5" />
            <Skeleton variant="rect" className="w-14 h-5" />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-border/60 pt-3">
        <Skeleton variant="rect" className="w-16 h-7" />
        <Skeleton variant="rect" className="w-16 h-7" />
      </div>
    </div>
  );
}
