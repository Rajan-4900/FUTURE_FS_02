const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md active:shadow-sm',
  secondary:
    'bg-white text-slate-700 border border-border hover:bg-slate-50 hover:border-slate-300 shadow-xs',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md active:shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ease-out hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
