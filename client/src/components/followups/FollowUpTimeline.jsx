import { Check, Trash2, Clock, AlertCircle } from 'lucide-react';
import { formatDate, formatDateTime } from '../../utils/formatters';
import {
  FOLLOWUP_TYPES,
  STATUS_LABELS,
  STATUS_STYLES,
} from '../../utils/followUpConstants';

function StatusIcon({ status }) {
  if (status === 'overdue') return <AlertCircle size={14} className="text-red-500" />;
  if (status === 'completed') return <Check size={14} className="text-emerald-500" />;
  return <Clock size={14} className="text-slate-400" />;
}

export default function FollowUpTimeline({
  items,
  onComplete,
  onDelete,
  compact = false,
  showLead = true,
}) {
  if (!items?.length) {
    return (
      <p className="py-8 text-center text-sm text-muted">No follow-up activity yet.</p>
    );
  }

  return (
    <ol className="relative space-y-0">
      {items.map((item, index) => (
        <li key={item._id} className="relative flex gap-4 pb-6 last:pb-0">
          {index < items.length - 1 && (
            <span
              className="absolute left-[15px] top-8 h-full w-px bg-border"
              aria-hidden
            />
          )}
          <div
            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white ${
              item.status === 'overdue' ? 'border-red-200' : 'border-border'
            }`}
          >
            <StatusIcon status={item.status} />
          </div>
          <div
            className={`min-w-0 flex-1 rounded-xl border bg-white p-4 card-shadow transition-colors duration-150 hover:border-slate-300 ${
              item.status === 'overdue' ? 'border-red-100 bg-red-50/30' : 'border-border/80'
            } ${compact ? 'p-3' : ''}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">
                    {item.title || FOLLOWUP_TYPES[item.type]}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${STATUS_STYLES[item.status]}`}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>
                {showLead && item.lead?.name && (
                  <p className="mt-0.5 text-xs text-primary">{item.lead.name}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                {!item.completed && (
                  <button
                    type="button"
                    onClick={() => onComplete?.(item._id)}
                    className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-600"
                    title="Mark complete"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete?.(item._id)}
                  className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
              {item.note}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
              <span>{FOLLOWUP_TYPES[item.type]}</span>
              {item.reminderDate && (
                <span>Reminder {formatDateTime(item.reminderDate)}</span>
              )}
              <span>Logged {formatDate(item.createdAt)}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
