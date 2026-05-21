import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../api/auth';

export default function Settings() {
  const { openSidebar } = useOutletContext();
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', company: user?.company || '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const { data } = await updateProfile(form);
      updateUser(data.user);
      setMessage('Profile updated successfully.');
    } catch {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header
        title="Settings"
        subtitle="Manage your account preferences"
        onMenuClick={openSidebar}
      />

      <main className="flex-1 p-4 md:p-6 max-w-2xl">
        <Card>
          <h2 className="text-base font-semibold text-slate-900">Profile</h2>
          <p className="mt-1 text-sm text-muted">Update your personal information.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {message && (
              <div
                className={`rounded-lg px-4 py-3 text-sm ${message.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
              >
                {message}
              </div>
            )}
            <Input
              label="Full name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div className="space-y-1.5 opacity-60">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                value={user?.email || ''}
                disabled
                className="w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600"
              />
            </div>
            <Input
              label="Company"
              name="company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <div className="pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-6">
          <h2 className="text-base font-semibold text-slate-900">Account</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted">Role</span>
              <span className="font-medium text-slate-800 capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted">User ID</span>
              <span className="font-mono text-xs text-slate-600">{user?.id}</span>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
