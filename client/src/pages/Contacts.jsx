import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Search, Trash2, Pencil } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import { getContacts, createContact, updateContact, deleteContact } from '../api/contacts';
import { STATUS_LABELS } from '../utils/formatters';

const emptyForm = { name: '', email: '', phone: '', company: '', status: 'lead', notes: '' };

export default function Contacts() {
  const { openSidebar } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchContacts = () => {
    setLoading(true);
    getContacts()
      .then(({ data }) => setContacts(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (contact) => {
    setEditingId(contact._id);
    setForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      status: contact.status,
      notes: contact.notes,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateContact(editingId, form);
      } else {
        await createContact(form);
      }
      setModalOpen(false);
      fetchContacts();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;
    await deleteContact(id);
    fetchContacts();
  };

  return (
    <>
      <Header
        title="Contacts"
        subtitle="Manage leads and customer relationships"
        onMenuClick={openSidebar}
        action={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Add contact
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-6">
        <Card className="mb-6">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="px-5 py-3 font-medium md:px-6">Contact</th>
                    <th className="px-5 py-3 font-medium hidden md:table-cell">Email</th>
                    <th className="px-5 py-3 font-medium hidden lg:table-cell">Company</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right md:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-muted md:px-6">
                        {search ? 'No contacts match your search' : 'No contacts yet. Add your first one.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => (
                      <tr
                        key={c._id}
                        className="border-b border-border last:border-0 hover:bg-slate-50/50"
                      >
                        <td className="px-5 py-4 md:px-6">
                          <div className="flex items-center gap-3">
                            <Avatar name={c.name} />
                            <div>
                              <p className="font-medium text-slate-800">{c.name}</p>
                              <p className="text-xs text-muted md:hidden">{c.email || c.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted hidden md:table-cell">
                          {c.email || '—'}
                        </td>
                        <td className="px-5 py-4 text-muted hidden lg:table-cell">
                          {c.company || '—'}
                        </td>
                        <td className="px-5 py-4">
                          <Badge status={c.status}>{STATUS_LABELS[c.status]}</Badge>
                        </td>
                        <td className="px-5 py-4 text-right md:px-6">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => openEdit(c)}
                              className="rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
                              className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 card-shadow-md">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? 'Edit contact' : 'New contact'}
            </h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <Input
                label="Name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <Input
                label="Company"
                name="company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
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
