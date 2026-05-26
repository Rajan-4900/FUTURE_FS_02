import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useFollowUpStats } from '../hooks/useFollowUpStats';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, RefreshCw } from 'lucide-react';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import KanbanBoard from '../components/pipeline/KanbanBoard';
import LeadFormModal from '../components/leads/LeadFormModal';
import LeadDetailPanel from '../components/leads/LeadDetailPanel';
import { useToast } from '../hooks/useToast';
import { getLeads, updateLeadStatus, createLead, updateLead, deleteLead } from '../api/leads';
import { emptyLeadForm, leadToForm, normalizeLeadStatus } from '../utils/leadConstants';

export default function Pipeline() {
  const { openSidebar } = useOutletContext();
  const toast = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyLeadForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const { refresh: refreshFollowUpStats } = useFollowUpStats(60000);

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const { data } = await getLeads({ limit: 100 });
      setLeads(
        data.data.map((l) => ({ ...l, status: normalizeLeadStatus(l.status) }))
      );
      if (silent) {
        toast.success('Pipeline leads updated.');
      }
    } catch {
      toast.error('Failed to reload pipeline leads.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

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
      toast.success(`Lead status updated to ${newStatus.replace('_', ' ')}.`);
    } catch {
      setLeads(previous);
      toast.error('Failed to update lead status in pipeline.');
    }
  };

  const handleSaveLead = async (payload) => {
    try {
      if (editingId) {
        await updateLead(editingId, payload);
        toast.success('Lead updated successfully.');
      } else {
        await createLead(payload);
        toast.success('Lead added to pipeline.');
      }
      fetchLeads(true);
    } catch {
      toast.error('Failed to save lead information.');
    }
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
    try {
      await deleteLead(id);
      toast.success('Lead successfully deleted.');
      setSelectedLead(null);
      fetchLeads(true);
    } catch {
      toast.error('Failed to delete lead.');
    }
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {['New', 'Contacted', 'Qualified', 'Proposal'].map((status) => (
                <div key={status} className="rounded-xl border border-border/60 bg-slate-50/50 p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="font-semibold text-slate-700 text-sm">{status}</span>
                    <Skeleton variant="circle" className="h-6 w-6 shrink-0" />
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/60 bg-white p-4 space-y-3">
                      <Skeleton variant="text" className="w-1/2 h-3.5" />
                      <Skeleton variant="text" className="w-3/4 h-2.5" />
                      <div className="flex gap-1.5 pt-1">
                        <Skeleton variant="rect" className="w-12 h-5 shrink-0" />
                        <Skeleton variant="rect" className="w-12 h-5 shrink-0" />
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-white p-4 space-y-3">
                      <Skeleton variant="text" className="w-2/3 h-3.5" />
                      <Skeleton variant="text" className="w-1/2 h-2.5" />
                      <div className="flex gap-1.5 pt-1">
                        <Skeleton variant="rect" className="w-12 h-5 shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
          onFollowUpChange={refreshFollowUpStats}
        />
      )}
    </DndProvider>
  );
}
