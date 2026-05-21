import { X, Pencil, Trash2, Mail, Phone, Building2, Calendar, Tag } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { formatDate } from '../../utils/formatters';
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  SOURCE_LABELS,
} from '../../utils/leadConstants';

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={16} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 text-sm text-slate-800 break-words">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function LeadDetailPanel({ lead, onClose, onEdit, onDelete }) {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-border px-5 py-5">
          <div className="flex items-center gap-3">
            <Avatar name={lead.name} size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{lead.name}</h2>
              <p className="text-sm text-muted">{lead.company || 'No company'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition-colors duration-150 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3">
              <Badge status={lead.status}>{STATUS_LABELS[lead.status] || lead.status}</Badge>
          <Badge status={lead.priority}>{PRIORITY_LABELS[lead.priority]}</Badge>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          <DetailRow icon={Mail} label="Email" value={lead.email} />
          <DetailRow icon={Phone} label="Phone" value={lead.phone} />
          <DetailRow icon={Building2} label="Company" value={lead.company} />
          <DetailRow icon={Tag} label="Lead source" value={SOURCE_LABELS[lead.leadSource]} />
          <DetailRow icon={Calendar} label="Follow-up date" value={formatDate(lead.followUpDate)} />

          {lead.notes && (
            <div className="border-t border-border py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Notes</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {lead.notes}
              </p>
            </div>
          )}

          <p className="border-t border-border py-4 text-xs text-muted">
            Created {formatDate(lead.createdAt)} · Updated {formatDate(lead.updatedAt)}
          </p>
        </div>

        <div className="flex gap-3 border-t border-border p-5">
          <Button variant="secondary" className="flex-1" onClick={onEdit}>
            <Pencil size={16} />
            Edit
          </Button>
          <Button variant="danger" className="flex-1" onClick={onDelete}>
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
