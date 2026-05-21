import { getInitials } from '../../utils/formatters';

export default function Avatar({ name, size = 'md' }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-10 w-10 text-sm',
  };

  return (
    <div
      className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-slate-200 font-medium text-slate-600`}
    >
      {getInitials(name)}
    </div>
  );
}
