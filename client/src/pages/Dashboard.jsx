import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Users, Handshake, DollarSign, TrendingUp, Plus } from 'lucide-react';
import Header from '../components/layout/Header';
import StatCard from '../components/dashboard/StatCard';
import PipelineBar from '../components/dashboard/PipelineBar';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { getContacts } from '../api/contacts';
import { getDeals, getDealStats } from '../api/deals';
import { formatCurrency, STAGE_LABELS, STATUS_LABELS } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { openSidebar } = useOutletContext();
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [contactCount, setContactCount] = useState(0);
  const [deals, setDeals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getContacts(), getDeals(), getDealStats()])
      .then(([contactsRes, dealsRes, statsRes]) => {
        setContactCount(contactsRes.data.count ?? contactsRes.data.data.length);
        setContacts(contactsRes.data.data.slice(0, 5));
        setDeals(dealsRes.data.data.slice(0, 5));
        setStats(statsRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const wonDeals = stats?.byStage?.closed_won || 0;

  return (
    <>
      <Header
        title={`Good ${getGreeting()}, ${user?.name?.split(' ')[0] || 'there'}`}
        subtitle="Here's what's happening in your pipeline today."
        onMenuClick={openSidebar}
      />

      <main className="flex-1 p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total contacts" value={contactCount} icon={Users} />
              <StatCard
                label="Active deals"
                value={stats?.total ?? deals.length}
                icon={Handshake}
              />
              <StatCard
                label="Pipeline value"
                value={formatCurrency(stats?.totalValue || 0)}
                icon={DollarSign}
              />
              <StatCard
                label="Deals won"
                value={wonDeals}
                change={wonDeals > 0 ? 'Closed successfully' : 'No wins yet'}
                icon={TrendingUp}
                trend={wonDeals > 0 ? 'up' : undefined}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader title="Deal pipeline" subtitle="Distribution across stages" />
                <PipelineBar stats={stats} />
              </Card>

              <Card>
                <CardHeader
                  title="Quick actions"
                  action={
                    <Link to="/contacts">
                      <Button variant="secondary" size="sm">
                        <Plus size={16} />
                        Contact
                      </Button>
                    </Link>
                  }
                />
                <div className="space-y-2">
                  <Link
                    to="/deals"
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-slate-50 transition-colors duration-150"
                  >
                    <span className="font-medium text-slate-700">Add new deal</span>
                    <Plus size={16} className="text-muted" />
                  </Link>
                  <Link
                    to="/contacts"
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-slate-50 transition-colors duration-150"
                  >
                    <span className="font-medium text-slate-700">Import contacts</span>
                    <Users size={16} className="text-muted" />
                  </Link>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card padding={false}>
                <div className="p-5 md:p-6">
                  <CardHeader
                    title="Recent contacts"
                    action={
                      <Link to="/contacts" className="text-sm text-primary hover:underline">
                        View all
                      </Link>
                    }
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-t border-border text-left text-xs text-muted">
                        <th className="px-5 py-3 font-medium md:px-6">Name</th>
                        <th className="px-5 py-3 font-medium hidden sm:table-cell">Company</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-5 py-8 text-center text-muted md:px-6">
                            No contacts yet
                          </td>
                        </tr>
                      ) : (
                        contacts.map((c) => (
                          <tr key={c._id} className="border-t border-border hover:bg-slate-50/50">
                            <td className="px-5 py-3 font-medium text-slate-800 md:px-6">
                              {c.name}
                            </td>
                            <td className="px-5 py-3 text-muted hidden sm:table-cell">
                              {c.company || '—'}
                            </td>
                            <td className="px-5 py-3 md:px-6">
                              <Badge status={c.status}>{STATUS_LABELS[c.status]}</Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card padding={false}>
                <div className="p-5 md:p-6">
                  <CardHeader
                    title="Recent deals"
                    action={
                      <Link to="/deals" className="text-sm text-primary hover:underline">
                        View all
                      </Link>
                    }
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-t border-border text-left text-xs text-muted">
                        <th className="px-5 py-3 font-medium md:px-6">Deal</th>
                        <th className="px-5 py-3 font-medium">Value</th>
                        <th className="px-5 py-3 font-medium hidden sm:table-cell">Stage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deals.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-5 py-8 text-center text-muted md:px-6">
                            No deals yet
                          </td>
                        </tr>
                      ) : (
                        deals.map((d) => (
                          <tr key={d._id} className="border-t border-border hover:bg-slate-50/50">
                            <td className="px-5 py-3 font-medium text-slate-800 md:px-6">
                              {d.title}
                            </td>
                            <td className="px-5 py-3 text-slate-700">
                              {formatCurrency(d.value)}
                            </td>
                            <td className="px-5 py-3 hidden sm:table-cell">
                              <Badge status={d.stage}>{STAGE_LABELS[d.stage]}</Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
