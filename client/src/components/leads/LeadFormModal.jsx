import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  SOURCE_OPTIONS,
  emptyLeadForm,
} from '../../utils/leadConstants';
import { getApiError } from '../../utils/validateForm';

export default function LeadFormModal({ open, onClose, onSave, initialData, title }) {
  const [form, setForm] = useState(initialData || emptyLeadForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(initialData || emptyLeadForm);
      setError('');
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        email: form.email.trim(),
        followUpDate: form.followUpDate || null,
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(getApiError(err, 'Failed to save lead'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col rounded-t-2xl bg-white card-shadow-md sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 md:px-6">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition-colors duration-150 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-5 md:px-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              disabled={saving}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={saving}
              />
              <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={saving}
              />
            </div>
            <Input
              label="Company"
              name="company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              disabled={saving}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Lead source"
                name="leadSource"
                value={form.leadSource}
                onChange={(e) => setForm({ ...form, leadSource: e.target.value })}
                options={SOURCE_OPTIONS}
                disabled={saving}
              />
              <Select
                label="Status"
                name="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                options={STATUS_OPTIONS}
                disabled={saving}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Priority"
                name="priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                options={PRIORITY_OPTIONS}
                disabled={saving}
              />
              <Input
                label="Follow-up date"
                type="date"
                name="followUpDate"
                value={form.followUpDate}
                onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                disabled={saving}
              />
            </div>
            <Textarea
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
              disabled={saving}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5">
            <Button variant="secondary" type="button" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save lead'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
