export default function FollowUpBadge({ count, variant = 'danger' }) {
  if (!count || count <= 0) return null;

  const styles = {
    danger: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-white',
  };

  return (
    <span
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${styles[variant]}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
