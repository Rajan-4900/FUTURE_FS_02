export default function Select({
  label,
  error,
  options = [],
  placeholder,
  className = '',
  id,
  name,
  value,
  onChange,
  disabled,
  required,
}) {
  const selectId = id || name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full appearance-auto rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-slate-800 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${error ? 'border-red-400' : ''} ${className}`}
      >
        {placeholder ? (
          <option value="">{placeholder}</option>
        ) : null}
        {options.map(({ value: optValue, label: optLabel }) => (
          <option key={optValue} value={optValue} className="bg-white text-slate-800">
            {optLabel}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
