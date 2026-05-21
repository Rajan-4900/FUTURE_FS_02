import { Eye, Pencil, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { formatDate } from '../../utils/formatters';
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  SOURCE_LABELS,
} from '../../utils/leadConstants';

export default function LeadTable({ leads, onView, onEdit, onDelete }) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50">
          <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted">
            <th className="px-5 py-3.5 md:px-6">Lead</th>
            <th className="px-5 py-3.5">Company</th>
            <th className="px-5 py-3.5 hidden lg:table-cell">Source</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 hidden xl:table-cell">Priority</th>
            <th className="px-5 py-3.5 hidden lg:table-cell">Follow-up</th>
            <th className="px-5 py-3.5 text-right md:px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="border-b border-border last:border-0 transition-colors duration-150 hover:bg-slate-50/80"
            >
              <td className="px-5 py-4 md:px-6">
                <button
                  type="button"
                  onClick={() => onView(lead)}
                  className="flex items-center gap-3 text-left transition-colors duration-150 hover:text-primary"
                >
                  <Avatar name={lead.name} />
                  <div>
                    <p className="font-medium text-slate-800">{lead.name}</p>
                    <p className="text-xs text-muted">{lead.email || lead.phone || '—'}</p>
                  </div>
                </button>
              </td>
              <td className="px-5 py-4 text-slate-600">{lead.company || '—'}</td>
              <td className="px-5 py-4 text-muted hidden lg:table-cell">
                {SOURCE_LABELS[lead.leadSource]}
              </td>
              <td className="px-5 py-4">
                <Badge status={lead.status}>{STATUS_LABELS[lead.status]}</Badge>
              </td>
              <td className="px-5 py-4 hidden xl:table-cell">
                <Badge status={lead.priority}>{PRIORITY_LABELS[lead.priority]}</Badge>
              </td>
              <td className="px-5 py-4 text-muted hidden lg:table-cell">
                {formatDate(lead.followUpDate)}
              </td>
              <td className="px-5 py-4 text-right md:px-6">
                <div className="flex justify-end gap-1">
                  <ActionBtn onClick={() => onView(lead)} label="View">
                    <Eye size={16} />
                  </ActionBtn>
                  <ActionBtn onClick={() => onEdit(lead)} label="Edit">
                    <Pencil size={16} />
                  </ActionBtn>
                  <ActionBtn onClick={() => onDelete(lead._id)} label="Delete" danger>
                    <Trash2 size={16} />
                  </ActionBtn>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActionBtn({ children, onClick, label, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`rounded-lg p-2 transition-colors duration-150 ${
        danger
          ? 'text-muted hover:bg-red-50 hover:text-red-600'
          : 'text-muted hover:bg-slate-100 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  );
}
