export default function Skeleton({ className = '' }) {
  return <div className={`shimmer-loader rounded-md ${className}`} />;
}

export function SkeletonMetricsGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/60 bg-white p-5 card-shadow flex items-center justify-between gap-4"
        >
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full overflow-hidden border border-border/50 rounded-xl bg-white card-shadow">
      <div className="border-b border-border bg-slate-50/50 px-6 py-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-1/4' : 'w-1/6'}`} />
        ))}
      </div>
      <div className="divide-y divide-border px-6">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="py-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className={`flex-1 ${c === 0 ? 'flex items-center gap-3' : ''}`}>
                {c === 0 && <Skeleton className="h-9 w-9 rounded-full shrink-0" />}
                <Skeleton className={`h-3.5 ${c === 0 ? 'w-2/3' : 'w-1/2'}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="rounded-xl border border-border/60 bg-white p-6 card-shadow space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4.5 w-1/4" />
          <Skeleton className="h-3.5 w-1/3" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="h-64 flex items-end gap-3 pt-6 border-b border-slate-100 pb-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t"
            style={{
              height: `${Math.max(15, Math.floor(Math.random() * 85))}%`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-300">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export function SkeletonTimeline() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            {i < 3 && <div className="w-0.5 grow bg-slate-100 mt-2" />}
          </div>
          <div className="flex-1 space-y-2 pt-1 pb-4">
            <div className="flex justify-between">
              <Skeleton className="h-3.5 w-1/4" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
