import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import LeadTable from '../components/leads/LeadTable';
import LeadMobileCards from '../components/leads/LeadMobileCards';
import LeadFormModal from '../components/leads/LeadFormModal';
import LeadDetailPanel from '../components/leads/LeadDetailPanel';
import { getLeads, createLead, updateLead, deleteLead } from '../api/leads';
import { emptyLeadForm, leadToForm, STATUS_OPTIONS } from '../utils/leadConstants';

const PAGE_SIZE = 10;

export default function Leads() {
  const { openSidebar } = useOutletContext();
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
    if (editingId) {
      await updateLead(editingId, payload);
    } else {
      await createLead(payload);
    }
    fetchLeads(pagination.page);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead? This action cannot be undone.')) return;
    await deleteLead(id);
    setSelectedLead(null);
    fetchLeads(pagination.page);
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
            <div className="flex justify-center py-24">
              <Spinner className="h-9 w-9" />
            </div>
          ) : (
            <Card padding={false}>
              {leads.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="font-medium text-slate-700">No leads found</p>
                  <p className="mt-1 text-sm text-muted">
                    {debouncedSearch || statusFilter !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Add your first lead to get started'}
                  </p>
                  {!debouncedSearch && statusFilter === 'all' && (
                    <Button className="mt-4" onClick={openCreate}>
                      <Plus size={16} />
                      Add lead
                    </Button>
                  )}
                </div>
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

      <LeadDetailPanel
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onEdit={() => openEdit(selectedLead)}
        onDelete={() => handleDelete(selectedLead._id)}
      />
    </>
  );
}
