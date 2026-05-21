import { useEffect, useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Clock,
  DollarSign,
  Plus,
  ArrowRight,
} from 'lucide-react';
import Header from '../components/layout/Header';
import StatCard from '../components/dashboard/StatCard';
import LeadStats from '../components/dashboard/LeadStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import PipelineBar from '../components/dashboard/PipelineBar';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { getLeads } from '../api/leads';
import { getDeals, getDealStats } from '../api/deals';
import { formatCurrency } from '../utils/formatters';
import { computeLeadStats, buildRecentActivity } from '../utils/dashboardStats';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { openSidebar } = useOutletContext();
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [dealStats, setDealStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getLeads({ limit: 50 }), getDeals(), getDealStats()])
      .then(([leadsRes, dealsRes, statsRes]) => {
        setContacts(leadsRes.data.data);
        setDeals(dealsRes.data.data);
        setDealStats(statsRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const leadStats = useMemo(() => computeLeadStats(contacts, deals), [contacts, deals]);
  const recentActivity = useMemo(
    () => buildRecentActivity(contacts, deals),
    [contacts, deals]
  );

  return (
    <>
      <Header
        title={`Good ${getGreeting()}, ${user?.name?.split(' ')[0] || 'there'}`}
        subtitle="Overview of your leads, pipeline, and recent activity."
        onMenuClick={openSidebar}
        action={
          <Link to="/leads" className="hidden sm:block">
            <Button size="sm">
              <Plus size={16} />
              New lead
            </Button>
          </Link>
        }
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner className="h-9 w-9" />
          </div>
        ) : (
          <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
            {/* Stat cards — responsive grid */}
            <section aria-label="Key metrics">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Total leads"
                  value={leadStats.totalLeads}
                  change={`${contacts.length} contacts in pipeline`}
                  icon={Users}
                  accent="blue"
                />
                <StatCard
                  label="Converted leads"
                  value={leadStats.convertedLeads}
                  change={`${leadStats.conversionRate}% conversion rate`}
                  icon={UserCheck}
                  accent="emerald"
                  trend={leadStats.convertedLeads > 0 ? 'up' : undefined}
                />
                <StatCard
                  label="Pending follow-ups"
                  value={leadStats.pendingFollowups}
                  change="Leads & prospects awaiting action"
                  icon={Clock}
                  accent="amber"
                />
                <StatCard
                  label="Revenue potential"
                  value={formatCurrency(leadStats.revenuePotential)}
                  change="Open deals in pipeline"
                  icon={DollarSign}
                  accent="violet"
                />
              </div>
            </section>

            {/* Lead stats + Pipeline */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
              <Card className="lg:col-span-5">
                <CardHeader
                  title="Lead statistics"
                  subtitle="Breakdown by contact status"
                />
                <LeadStats
                  byStatus={leadStats.byStatus}
                  total={leadStats.totalLeads}
                  conversionRate={leadStats.conversionRate}
                />
              </Card>

              <Card className="lg:col-span-7">
                <CardHeader
                  title="Deal pipeline"
                  subtitle="Opportunities by stage"
                  action={
                    <Link
                      to="/deals"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors duration-150 hover:text-primary-hover"
                    >
                      View deals
                      <ArrowRight size={14} />
                    </Link>
                  }
                />
                <PipelineBar stats={dealStats} />
              </Card>
            </section>

            {/* Recent activity + Quick actions */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
              <Card className="lg:col-span-8" padding={false}>
                <div className="border-b border-border px-5 py-5 md:px-6">
                  <CardHeader
                    title="Recent activity"
                    subtitle="Latest updates across contacts and deals"
                    action={
                      <Link
                        to="/leads"
                        className="text-sm font-medium text-primary transition-colors duration-150 hover:underline"
                      >
                        View all
                      </Link>
                    }
                  />
                </div>
                <div className="px-4 md:px-5">
                  <RecentActivity items={recentActivity} />
                </div>
              </Card>

              <Card className="lg:col-span-4">
                <CardHeader title="Quick actions" subtitle="Common tasks" />
                <div className="space-y-2">
                  <QuickAction
                    to="/leads"
                    title="Add new lead"
                    description="Create a lead"
                  />
                  <QuickAction
                    to="/deals"
                    title="Create deal"
                    description="Log an opportunity"
                  />
                  <QuickAction
                    to="/leads"
                    title="Review follow-ups"
                    description={`${leadStats.pendingFollowups} pending`}
                  />
                </div>
              </Card>
            </section>
          </div>
        )}
      </main>
    </>
  );
}

function QuickAction({ to, title, description }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-lg border border-border px-4 py-3.5 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50"
    >
      <div>
        <p className="text-sm font-medium text-slate-800">{title}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <ArrowRight size={16} className="shrink-0 text-muted" />
    </Link>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
