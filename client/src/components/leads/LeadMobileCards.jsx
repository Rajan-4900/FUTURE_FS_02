import { Eye, Pencil, Trash2, Calendar } from 'lucide-react';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { formatDate } from '../../utils/formatters';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/leadConstants';

export default function LeadMobileCards({ leads, onView, onEdit, onDelete }) {
  return (
    <div className="divide-y divide-border md:hidden">
      {leads.map((lead) => (
        <div
          key={lead._id}
          className="p-4 transition-colors duration-150 hover:bg-slate-50/50"
        >
          <div className="flex items-start gap-3">
            <Avatar name={lead.name} />
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onView(lead)}
                className="text-left font-medium text-slate-900 hover:text-primary"
              >
                {lead.name}
              </button>
              <p className="text-sm text-muted">{lead.company || 'No company'}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge status={lead.status}>{STATUS_LABELS[lead.status]}</Badge>
                <Badge status={lead.priority}>{PRIORITY_LABELS[lead.priority]}</Badge>
              </div>
              {lead.followUpDate && (
                <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                  <Calendar size={12} />
                  Follow-up {formatDate(lead.followUpDate)}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-1 border-t border-border pt-3">
            <button
              type="button"
              onClick={() => onView(lead)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              <Eye size={14} className="inline mr-1" />
              View
            </button>
            <button
              type="button"
              onClick={() => onEdit(lead)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              <Pencil size={14} className="inline mr-1" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(lead._id)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} className="inline mr-1" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
