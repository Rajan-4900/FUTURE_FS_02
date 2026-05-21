export default function AuthCard({ children, title, subtitle }) {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-border/80 bg-surface p-8 card-shadow-md sm:p-10">
      <div className="mb-8 text-center sm:text-left">
        <div className="mb-6 flex justify-center sm:justify-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
            F
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
