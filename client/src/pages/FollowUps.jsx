import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, CalendarCheck2 } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import FollowUpStatCards from '../components/followups/FollowUpStatCards';
import FollowUpTimeline from '../components/followups/FollowUpTimeline';
import FollowUpFormModal from '../components/followups/FollowUpFormModal';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../hooks/useToast';
import {
  getFollowUps,
  createFollowUp,
  completeFollowUp,
  deleteFollowUp,
} from '../api/followUps';
import { getLeads } from '../api/leads';
import { emptyFollowUpForm } from '../utils/followUpConstants';
import { useFollowUpStats } from '../hooks/useFollowUpStats';

const PAGE_SIZE = 15;

export default function FollowUps() {
  const { openSidebar } = useOutletContext();
  const toast = useToast();
  const { stats, refresh: refreshStats } = useFollowUpStats(30000);
  const [items, setItems] = useState([]);
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: PAGE_SIZE });
  const [filter, setFilter] = useState('overdue');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchItems = useCallback(
    (page = 1, status = filter) => {
      setLoading(true);
      const params = { page, limit: PAGE_SIZE };
      if (status && status !== 'all') params.status = status;

      getFollowUps(params)
        .then(({ data }) => {
          setItems(data.data);
          setPagination(data.pagination);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    },
    [filter]
  );

  useEffect(() => {
    getLeads({ limit: 100 }).then(({ data }) => setLeads(data.data));
  }, []);

  useEffect(() => {
    fetchItems(1, filter);
  }, [filter, fetchItems]);

  const handleFilter = (status) => {
    setFilter(status);
  };

  const handleSave = async (payload) => {
    try {
      await createFollowUp(payload);
      toast.success('Follow-up task scheduled successfully.');
      fetchItems(pagination.page);
      refreshStats();
    } catch {
      toast.error('Failed to create follow-up task.');
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeFollowUp(id);
      toast.success('Follow-up task completed.');
      fetchItems(pagination.page);
      refreshStats();
    } catch {
      toast.error('Failed to update task status.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this follow-up?')) return;
    try {
      await deleteFollowUp(id);
      toast.success('Follow-up task removed.');
      fetchItems(pagination.page);
      refreshStats();
    } catch {
      toast.error('Failed to delete task.');
    }
  };

  return (
    <>
      <Header
        title="Follow-ups"
        subtitle="Reminders, notes, and activity history"
        onMenuClick={openSidebar}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Add follow-up
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <FollowUpStatCards stats={stats} activeFilter={filter} onFilter={handleFilter} />

          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'completed', label: 'Completed' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleFilter(key)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  filter === key
                    ? 'bg-primary text-white'
                    : 'bg-white text-slate-600 border border-border hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Card>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Activity timeline</h2>
              {stats.overdue > 0 && (
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                  {stats.overdue} overdue
                </span>
              )}
            </div>

            {loading ? (
              <div className="space-y-6 py-4">
                <div className="flex gap-4">
                  <Skeleton variant="circle" className="h-8 w-8 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-1/4 h-3.5" />
                    <Skeleton variant="text" className="w-1/2 h-3" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Skeleton variant="circle" className="h-8 w-8 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-1/3 h-3.5" />
                    <Skeleton variant="text" className="w-1/2 h-3" />
                  </div>
                </div>
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                icon={CalendarCheck2}
                title="All caught up!"
                description="No follow-up tasks scheduled for this view. Create a new task to schedule client calls, proposals, or emails."
                actionLabel="Schedule task"
                onAction={() => setModalOpen(true)}
              />
            ) : (
              <>
                <FollowUpTimeline
                  items={items}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  total={pagination.total}
                  limit={pagination.limit}
                  onPageChange={(p) => fetchItems(p)}
                />
              </>
            )}
          </Card>
        </div>
      </main>

      <FollowUpFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        leads={leads}
        initialData={emptyFollowUpForm}
        title="Schedule follow-up"
      />
    </>
  );
}
