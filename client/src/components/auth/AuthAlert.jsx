import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthAlert({ type = 'error', message }) {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 text-red-700 border-red-100',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" strokeWidth={1.75} />
      <span>{message}</span>
    </div>
  );
}
