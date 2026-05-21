import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { TYPE_OPTIONS, emptyFollowUpForm } from '../../utils/followUpConstants';
import { getApiError } from '../../utils/validateForm';
import { getLeads } from '../../api/leads';

export default function FollowUpFormModal({
  open,
  onClose,
  onSave,
  leads: leadsProp = [],
  initialData,
  title = 'Add follow-up',
  lockLead = false,
  lockedLeadName = '',
}) {
  const [form, setForm] = useState(emptyFollowUpForm);
  const [leads, setLeads] = useState(leadsProp);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    setForm(initialData || emptyFollowUpForm);
    setError('');

    if (lockLead && leadsProp.length > 0) {
      setLeads(leadsProp);
      return;
    }

    setLoadingLeads(true);
    getLeads({ limit: 100 })
      .then(({ data }) => setLeads(data.data || []))
      .catch(() => setLeads(leadsProp))
      .finally(() => setLoadingLeads(false));
  }, [open, initialData, lockLead, leadsProp]);

  if (!open) return null;

  const leadOptions = leads.map((l) => ({
    value: String(l._id),
    label: l.name || l.email || 'Unnamed lead',
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const leadId = lockLead ? String(leadsProp[0]?._id || form.lead) : form.lead;

    if (!leadId) {
      setError('Please select a lead');
      return;
    }
    if (!form.note.trim()) {
      setError('Note content is required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSave({
        ...form,
        lead: leadId,
        reminderDate: form.reminderDate ? new Date(form.reminderDate).toISOString() : null,
      });
      onClose();
    } catch (err) {
      setError(getApiError(err, 'Failed to save follow-up'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-2xl bg-white card-shadow-md sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          {/* Selects outside overflow container so dropdowns render correctly */}
          <div className="shrink-0 space-y-4 border-b border-border bg-slate-50/50 px-5 py-4">
            {lockLead ? (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Lead</label>
                <div className="rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-slate-800">
                  {lockedLeadName || leadsProp[0]?.name || 'Selected lead'}
                </div>
              </div>
            ) : (
              <Select
                label="Lead"
                name="lead"
                value={form.lead}
                onChange={(e) => setForm({ ...form, lead: e.target.value })}
                options={leadOptions}
                placeholder={loadingLeads ? 'Loading leads...' : 'Select a lead'}
                disabled={saving || loadingLeads}
                required
              />
            )}

            {!loadingLeads && !lockLead && leadOptions.length === 0 && (
              <p className="text-xs text-amber-700">
                No leads found. Add a lead first from the Leads page.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Type"
                name="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                options={TYPE_OPTIONS}
                disabled={saving}
                required
              />
              <Input
                label="Reminder date"
                type="datetime-local"
                name="reminderDate"
                value={form.reminderDate}
                onChange={(e) => setForm({ ...form, reminderDate: e.target.value })}
                disabled={saving}
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <Input
              label="Title (optional)"
              name="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Call back about proposal"
              disabled={saving}
            />

            <Textarea
              label="Notes"
              name="note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={4}
              required
              disabled={saving}
            />
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-border px-5 py-4">
            <Button variant="secondary" type="button" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || (loadingLeads && !lockLead)}>
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
