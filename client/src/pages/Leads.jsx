import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Search, Filter, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import LeadTable from '../components/leads/LeadTable';
import LeadMobileCards from '../components/leads/LeadMobileCards';
import LeadFormModal from '../components/leads/LeadFormModal';
import LeadDetailPanel from '../components/leads/LeadDetailPanel';
import { useFollowUpStats } from '../hooks/useFollowUpStats';
import { getLeads, createLead, updateLead, deleteLead } from '../api/leads';
import { emptyLeadForm, leadToForm, STATUS_OPTIONS } from '../utils/leadConstants';
import { SkeletonTable } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../context/ToastContext';

const PAGE_SIZE = 10;

export default function Leads() {
  const { openSidebar } = useOutletContext();
  const { toast } = useToast();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: PAGE_SIZE });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyLeadForm);
  const [editingId, setEditingId] = useState(null);

  const [selectedLead, setSelectedLead] = useState(null);
  const { refresh: refreshFollowUpStats } = useFollowUpStats(60000);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchLeads = useCallback(
    (page = 1) => {
      setLoading(true);
      getLeads({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        status: statusFilter,
      })
        .then(({ data }) => {
          setLeads(data.data);
          setPagination(data.pagination);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    },
    [debouncedSearch, statusFilter]
  );

  useEffect(() => {
    fetchLeads(1);
  }, [fetchLeads]);

  const handlePageChange = (page) => fetchLeads(page);

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyLeadForm);
    setFormOpen(true);
  };

  const openEdit = (lead) => {
    setEditingId(lead._id);
    setFormData(leadToForm(lead));
    setFormOpen(true);
    setSelectedLead(null);
  };

  const handleSave = async (payload) => {
    try {
      if (editingId) {
        await updateLead(editingId, payload);
        toast('Lead updated successfully', 'success');
      } else {
        await createLead(payload);
        toast('New lead added to your pipeline', 'success');
      }
      fetchLeads(pagination.page);
    } catch {
      toast('Failed to save lead details', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead? This action cannot be undone.')) return;
    try {
      await deleteLead(id);
      toast('Lead removed successfully', 'success');
      setSelectedLead(null);
      fetchLeads(pagination.page);
    } catch {
      toast('Failed to delete lead', 'error');
    }
  };

  return (
    <>
      <Header
        title="Leads"
        subtitle="Manage your sales pipeline and follow-ups"
        onMenuClick={openSidebar}
        action={
          <Button onClick={openCreate}>
            <Plus size={16} />
            <span className="hidden sm:inline">Add lead</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-4">
          <Card className="p-4 md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="search"
                  placeholder="Search by name, email, company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={18} className="shrink-0 text-muted" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {loading ? (
            <SkeletonTable rows={PAGE_SIZE} cols={5} />
          ) : (
            <Card padding={false}>
              {leads.length === 0 ? (
                <EmptyState
                  title="No leads found"
                  description={
                    debouncedSearch || statusFilter !== 'all'
                      ? 'Try adjusting your search query or dropdown filters to find leads.'
                      : 'Create your first lead to get started building your pipeline.'
                  }
                  icon={AlertCircle}
                  actionText={!debouncedSearch && statusFilter === 'all' ? 'Add new lead' : undefined}
                  onAction={!debouncedSearch && statusFilter === 'all' ? openCreate : undefined}
                />
              ) : (
                <>
                  <LeadTable
                    leads={leads}
                    onView={setSelectedLead}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                  <LeadMobileCards
                    leads={leads}
                    onView={setSelectedLead}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                  <Pagination
                    page={pagination.page}
                    pages={pagination.pages}
                    total={pagination.total}
                    limit={pagination.limit}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </Card>
          )}
        </div>
      </main>

      <LeadFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={formData}
        title={editingId ? 'Edit lead' : 'Add lead'}
      />

      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onEdit={() => openEdit(selectedLead)}
          onDelete={() => handleDelete(selectedLead._id)}
          onFollowUpChange={refreshFollowUpStats}
        />
      )}
    </>
  );
}
