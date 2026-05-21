export default function Textarea({ label, error, className = '', id, rows = 3, ...props }) {
  const textareaId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full resize-y rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
