import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import FollowUpStatCards from '../components/followups/FollowUpStatCards';
import FollowUpTimeline from '../components/followups/FollowUpTimeline';
import FollowUpFormModal from '../components/followups/FollowUpFormModal';
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
    await createFollowUp(payload);
    fetchItems(pagination.page);
    refreshStats();
  };

  const handleComplete = async (id) => {
    await completeFollowUp(id);
    fetchItems(pagination.page);
    refreshStats();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this follow-up?')) return;
    await deleteFollowUp(id);
    fetchItems(pagination.page);
    refreshStats();
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
              <div className="flex justify-center py-16">
                <Spinner />
              </div>
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
