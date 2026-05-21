export default function Select({ label, error, options, className = '', id, ...props }) {
  const selectId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-slate-800 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      >
        {options.map(({ value, label: optLabel }) => (
          <option key={value} value={value}>
            {optLabel}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
