import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Pencil, Handshake } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { TableRowSkeleton, MobileCardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../hooks/useToast';
import { getDeals, createDeal, updateDeal, deleteDeal } from '../api/deals';
import { getLeads } from '../api/leads';
import { formatCurrency, formatDate, STAGE_LABELS } from '../utils/formatters';

const emptyForm = {
  title: '',
  value: '',
  stage: 'qualification',
  contact: '',
  expectedCloseDate: '',
  notes: '',
};

export default function Deals() {
  const { openSidebar } = useOutletContext();
  const toast = useToast();
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([getDeals(), getLeads({ limit: 100 })])
      .then(([dealsRes, leadsRes]) => {
        setDeals(dealsRes.data.data);
        setContacts(leadsRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (deal) => {
    setEditingId(deal._id);
    setForm({
      title: deal.title,
      value: deal.value,
      stage: deal.stage,
      contact: deal.contact?._id || '',
      expectedCloseDate: deal.expectedCloseDate
        ? new Date(deal.expectedCloseDate).toISOString().split('T')[0]
        : '',
      notes: deal.notes,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      value: Number(form.value),
      contact: form.contact || null,
      expectedCloseDate: form.expectedCloseDate || null,
    };
    try {
      if (editingId) {
        await updateDeal(editingId, payload);
        toast.success('Deal updated successfully.');
      } else {
        await createDeal(payload);
        toast.success('Deal added successfully.');
      }
      setModalOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to save deal information.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this deal?')) return;
    try {
      await deleteDeal(id);
      toast.success('Deal deleted successfully.');
      fetchData();
    } catch {
      toast.error('Failed to delete deal.');
    }
  };

  return (
    <>
      <Header
        title="Deals"
        subtitle="Track opportunities through your pipeline"
        onMenuClick={openSidebar}
        action={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Add deal
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-6">
        {loading ? (
          <Card padding={false}>
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="px-5 py-3 font-medium md:px-6">Deal</th>
                    <th className="px-5 py-3 font-medium">Value</th>
                    <th className="px-5 py-3 font-medium hidden sm:table-cell">Contact</th>
                    <th className="px-5 py-3 font-medium">Stage</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Close date</th>
                    <th className="px-5 py-3 font-medium text-right md:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRowSkeleton cols={6} />
                  <TableRowSkeleton cols={6} />
                  <TableRowSkeleton cols={6} />
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-border sm:hidden">
              <MobileCardSkeleton />
              <MobileCardSkeleton />
            </div>
          </Card>
        ) : (
          <Card padding={false}>
            {deals.length === 0 ? (
              <EmptyState
                icon={Handshake}
                title="No deals found"
                description="Create your first business deal to begin tracking sales progress and target goals."
                actionLabel="Add deal"
                onAction={openCreate}
              />
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted">
                        <th className="px-5 py-3 font-medium md:px-6">Deal</th>
                        <th className="px-5 py-3 font-medium">Value</th>
                        <th className="px-5 py-3 font-medium hidden sm:table-cell">Contact</th>
                        <th className="px-5 py-3 font-medium">Stage</th>
                        <th className="px-5 py-3 font-medium hidden md:table-cell">Close date</th>
                        <th className="px-5 py-3 font-medium text-right md:px-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deals.map((d) => (
                        <tr
                          key={d._id}
                          className="border-b border-border last:border-0 hover:bg-slate-50/50"
                        >
                          <td className="px-5 py-4 font-medium text-slate-800 md:px-6">
                            {d.title}
                          </td>
                          <td className="px-5 py-4 text-slate-700">{formatCurrency(d.value)}</td>
                          <td className="px-5 py-4 text-muted hidden sm:table-cell">
                            {d.contact?.name || '—'}
                          </td>
                          <td className="px-5 py-4">
                            <Badge status={d.stage}>{STAGE_LABELS[d.stage]}</Badge>
                          </td>
                          <td className="px-5 py-4 text-muted hidden md:table-cell">
                            {formatDate(d.expectedCloseDate)}
                          </td>
                          <td className="px-5 py-4 text-right md:px-6">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => openEdit(d)}
                                className="rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-slate-700"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(d._id)}
                                className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked Card View */}
                <div className="block sm:hidden divide-y divide-border">
                  {deals.map((d) => (
                    <div key={d._id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors duration-150">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{d.title}</h4>
                          <p className="text-xs text-muted mt-0.5">Contact: {d.contact?.name || '—'}</p>
                        </div>
                        <Badge status={d.stage}>{STAGE_LABELS[d.stage]}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div>
                          <span className="text-slate-500">Value: </span>
                          <span className="font-bold text-slate-800">{formatCurrency(d.value)}</span>
                        </div>
                        {d.expectedCloseDate && (
                          <div className="text-slate-500">
                            Close: <span className="font-medium">{formatDate(d.expectedCloseDate)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 border-t border-border/60 pt-3 mt-2">
                        <button
                          onClick={() => openEdit(d)}
                          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 touch-manipulation"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(d._id)}
                          className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 touch-manipulation"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        )}
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 card-shadow-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? 'Edit deal' : 'New deal'}
            </h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <Input
                label="Deal title"
                name="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Value ($)"
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                  min="0"
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Stage</label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {Object.entries(STAGE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Contact</label>
                <select
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">No contact linked</option>
                  {contacts.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Expected close date"
                type="date"
                name="expectedCloseDate"
                value={form.expectedCloseDate}
                onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })}
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
