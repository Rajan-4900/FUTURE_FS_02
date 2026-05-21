import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, RefreshCw } from 'lucide-react';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import KanbanBoard from '../components/pipeline/KanbanBoard';
import LeadFormModal from '../components/leads/LeadFormModal';
import LeadDetailPanel from '../components/leads/LeadDetailPanel';
import { getLeads, updateLeadStatus, createLead, updateLead, deleteLead } from '../api/leads';
import { emptyLeadForm, leadToForm, normalizeLeadStatus } from '../utils/leadConstants';

export default function Pipeline() {
  const { openSidebar } = useOutletContext();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyLeadForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const { data } = await getLeads({ limit: 100 });
      setLeads(
        data.data.map((l) => ({ ...l, status: normalizeLeadStatus(l.status) }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDropLead = async (leadId, newStatus) => {
    const previous = leads;
    setLeads((current) =>
      current.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      const { data } = await updateLeadStatus(leadId, newStatus);
      setLeads((current) =>
        current.map((l) => (l._id === leadId ? data.data : l))
      );
    } catch (err) {
      setLeads(previous);
      console.error(err);
    }
  };

  const handleSaveLead = async (payload) => {
    if (editingId) {
      await updateLead(editingId, payload);
    } else {
      await createLead(payload);
    }
    fetchLeads(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyLeadForm);
    setFormOpen(true);
  };

  const openEdit = (lead) => {
    setEditingId(lead._id);
    setFormData(leadToForm(lead));
    setSelectedLead(null);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await deleteLead(id);
    setSelectedLead(null);
    fetchLeads(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Header
        title="Pipeline"
        subtitle="Drag leads across stages to update their status"
        onMenuClick={openSidebar}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fetchLeads(true)}
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus size={16} />
              <span className="hidden sm:inline">Add lead</span>
            </Button>
          </div>
        }
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px]">
          {loading ? (
            <div className="flex justify-center py-24">
              <Spinner className="h-9 w-9" />
            </div>
          ) : (
            <KanbanBoard
              leads={leads}
              onDropLead={handleDropLead}
              onCardClick={setSelectedLead}
            />
          )}
        </div>
      </main>

      <LeadFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveLead}
        initialData={formData}
        title={editingId ? 'Edit lead' : 'Add lead to pipeline'}
      />

      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onEdit={() => openEdit(selectedLead)}
          onDelete={() => handleDelete(selectedLead._id)}
        />
      )}
    </DndProvider>
  );
}
