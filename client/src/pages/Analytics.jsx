import { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Handshake,
  Activity,
  Award,
  Calendar,
  Filter,
  RefreshCw,
} from 'lucide-react';
import Header from '../components/layout/Header';
import Card, { CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { getLeads } from '../api/leads';
import { getDeals } from '../api/deals';
import { formatCurrency } from '../utils/formatters';

// Recharts components
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#2563eb', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#3b82f6', // Light Blue
  '#14b8a6', // Teal
];

const SOURCE_LABELS = {
  website: 'Website',
  referral: 'Referral',
  linkedin: 'LinkedIn',
  cold_call: 'Cold Call',
  email: 'Email',
  event: 'Event',
  other: 'Other',
};

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  proposal_sent: 'Proposal Sent',
  converted: 'Converted',
};

export default function Analytics() {
  const { openSidebar } = useOutletContext();
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [timeframe, setTimeframe] = useState('6'); // Months: '3', '6', '12', 'all'
  const [sourceFilter, setSourceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const [leadsRes, dealsRes] = await Promise.all([
        getLeads({ limit: 100 }), // Maximum limit supported by the API controller is 100
        getDeals(),
      ]);
      setLeads(leadsRes.data.data || []);
      setDeals(dealsRes.data.data || []);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. Timeframe filter
      if (timeframe !== 'all') {
        const monthsAgo = parseInt(timeframe, 10);
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);
        const leadDate = new Date(lead.createdAt);
        if (leadDate < cutoffDate) return false;
      }

      // 2. Source filter
      if (sourceFilter !== 'all' && lead.leadSource !== sourceFilter) {
        return false;
      }

      // 3. Priority filter
      if (priorityFilter !== 'all' && lead.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [leads, timeframe, sourceFilter, priorityFilter]);

  // Filtered Deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // Timeframe filter on expected close or creation
      if (timeframe !== 'all') {
        const monthsAgo = parseInt(timeframe, 10);
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);
        const dealDate = new Date(deal.createdAt);
        if (dealDate < cutoffDate) return false;
      }
      return true;
    });
  }, [deals, timeframe]);

  // --- COMPUTE KPI STATISTICS ---
  const stats = useMemo(() => {
    const total = filteredLeads.length;
    const converted = filteredLeads.filter((l) => l.status === 'converted').length;
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0.0';

    const pipelineValue = filteredDeals
      .filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
      .reduce((sum, d) => sum + (d.value || 0), 0);

    const wonDeals = filteredDeals.filter((d) => d.stage === 'closed_won');
    const avgDealSize = wonDeals.length > 0
      ? wonDeals.reduce((sum, d) => sum + (d.value || 0), 0) / wonDeals.length
      : 0;

    return {
      totalLeads: total,
      conversionRate,
      pipelineValue,
      avgDealSize,
    };
  }, [filteredLeads, filteredDeals]);

  // --- CHART 1: Monthly Leads Trend ---
  const monthlyLeadsData = useMemo(() => {
    const counts = {};
    const monthsToShow = timeframe === 'all' ? 12 : parseInt(timeframe, 10);

    // Initialize list of last N months
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      counts[key] = { name: key, leads: 0, conversions: 0 };
    }

    filteredLeads.forEach((lead) => {
      const date = new Date(lead.createdAt);
      const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (counts[key]) {
        counts[key].leads += 1;
        if (lead.status === 'converted') {
          counts[key].conversions += 1;
        }
      } else if (timeframe === 'all') {
        counts[key] = { name: key, leads: 1, conversions: lead.status === 'converted' ? 1 : 0 };
      }
    });

    return Object.values(counts);
  }, [filteredLeads, timeframe]);

  // --- CHART 2: Conversion Rate Trend ---
  const monthlyConversionData = useMemo(() => {
    return monthlyLeadsData.map((data) => {
      const rate = data.leads > 0 ? parseFloat(((data.conversions / data.leads) * 100).toFixed(1)) : 0;
      return {
        name: data.name,
        Rate: rate,
      };
    });
  }, [monthlyLeadsData]);

  // --- CHART 3: Lead Source Breakdown ---
  const sourceBreakdownData = useMemo(() => {
    const sources = {};
    filteredLeads.forEach((lead) => {
      const src = lead.leadSource || 'other';
      sources[src] = (sources[src] || 0) + 1;
    });

    return Object.entries(sources).map(([key, val]) => ({
      name: SOURCE_LABELS[key] || key,
      value: val,
    }));
  }, [filteredLeads]);

  // --- CHART 4: Status Distribution ---
  const statusDistributionData = useMemo(() => {
    const statuses = { new: 0, contacted: 0, proposal_sent: 0, converted: 0 };
    filteredLeads.forEach((lead) => {
      const status = lead.status || 'new';
      if (statuses[status] !== undefined) {
        statuses[status] += 1;
      }
    });

    return Object.entries(statuses).map(([key, val]) => ({
      name: STATUS_LABELS[key] || key,
      value: val,
    }));
  }, [filteredLeads]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-white p-3 card-shadow text-xs">
          <p className="font-semibold text-slate-800 mb-1">{label}</p>
          {payload.map((p, index) => (
            <p key={index} style={{ color: p.color }} className="font-medium">
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomRateTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-white p-3 card-shadow text-xs">
          <p className="font-semibold text-slate-800 mb-1">{label}</p>
          <p className="font-medium text-primary">
            Conversion Rate: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Header
        title="CRM Analytics Dashboard"
        subtitle="Analyze leads generation, sources breakdown, stage conversion rates, and business insights."
        onMenuClick={openSidebar}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              aria-label="Refresh data"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </Button>
          </div>
        }
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
          
          {/* Filters Bar */}
          <Card className="p-4 md:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-muted" />
                <span className="text-sm font-semibold text-slate-700">Filters</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:flex sm:items-center">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-muted hidden md:inline" />
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full sm:w-auto rounded-lg border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  >
                    <option value="3">Last 3 Months</option>
                    <option value="6">Last 6 Months</option>
                    <option value="12">Last 12 Months</option>
                    <option value="all">All Time</option>
                  </select>
                </div>

                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full sm:w-auto rounded-lg border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                >
                  <option value="all">All Sources</option>
                  {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full sm:w-auto rounded-lg border border-border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </Card>

          {loading ? (
            <div className="flex justify-center py-24">
              <Spinner className="h-9 w-9" />
            </div>
          ) : (
            <>
              {/* KPI Stat Cards */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                    <Users size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total Leads</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalLeads}</p>
                  </div>
                </Card>

                <Card className="flex items-center gap-4">
                  <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Conversion Rate</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{stats.conversionRate}%</p>
                  </div>
                </Card>

                <Card className="flex items-center gap-4">
                  <div className="rounded-lg bg-violet-50 p-3 text-violet-600">
                    <Handshake size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pipeline Value</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(stats.pipelineValue)}</p>
                  </div>
                </Card>

                <Card className="flex items-center gap-4">
                  <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                    <Award size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Avg Deal Won</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(stats.avgDealSize)}</p>
                  </div>
                </Card>
              </section>

              {/* Main Charts Grid */}
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                
                {/* 1. Monthly Leads (Area Chart) */}
                <Card className="lg:col-span-8">
                  <CardHeader
                    title="Monthly Leads Generation"
                    subtitle="Track leads intake and converted leads trends monthly."
                  />
                  <div className="h-80 w-full mt-4">
                    {monthlyLeadsData.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-sm text-muted">
                        No data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyLeadsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                          <Area
                            type="monotone"
                            dataKey="leads"
                            name="Intake Leads"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorLeads)"
                          />
                          <Area
                            type="monotone"
                            dataKey="conversions"
                            name="Converted Leads"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorConv)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </Card>

                {/* 2. Lead Source Breakdown (Donut Chart) */}
                <Card className="lg:col-span-4">
                  <CardHeader
                    title="Lead Sources"
                    subtitle="Distribution by channel."
                  />
                  <div className="h-80 w-full mt-4 flex flex-col justify-between">
                    {sourceBreakdownData.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-sm text-muted">
                        No source data available
                      </div>
                    ) : (
                      <>
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={sourceBreakdownData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={4}
                                dataKey="value"
                              >
                                {sourceBreakdownData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value} leads`]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        {/* Custom visual legend */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 max-h-20 overflow-y-auto px-2">
                          {sourceBreakdownData.map((item, index) => (
                            <div key={item.name} className="flex items-center gap-1.5 truncate">
                              <span
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="truncate">{item.name} ({item.value})</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </Card>

              </section>

              <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                
                {/* 3. Status Distribution (Bar Chart) */}
                <Card className="lg:col-span-6">
                  <CardHeader
                    title="Lead Status Distribution"
                    subtitle="Current distribution of leads across stages."
                  />
                  <div className="h-80 w-full mt-4">
                    {statusDistributionData.every(d => d.value === 0) ? (
                      <div className="flex h-full items-center justify-center text-sm text-muted">
                        No status data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip formatter={(value) => [`${value} leads`]} />
                          <Bar dataKey="value" name="Leads" radius={[4, 4, 0, 0]}>
                            {statusDistributionData.map((entry, index) => {
                              const barColors = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'];
                              return <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </Card>

                {/* 4. Conversion Rate Trend (Line Chart) */}
                <Card className="lg:col-span-6">
                  <CardHeader
                    title="Monthly Conversion Rate Trend"
                    subtitle="Percentage of leads successfully converted monthly."
                  />
                  <div className="h-80 w-full mt-4">
                    {monthlyConversionData.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-sm text-muted">
                        No data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyConversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                          <Tooltip content={<CustomRateTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="Rate"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            activeDot={{ r: 6 }}
                            dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: '#fff' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </Card>

              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
