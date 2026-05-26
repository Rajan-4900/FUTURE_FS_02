import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import Button from '../ui/Button';
import FollowUpTimeline from '../followups/FollowUpTimeline';
import FollowUpFormModal from '../followups/FollowUpFormModal';
import {
  getFollowUps,
  createFollowUp,
  completeFollowUp,
  deleteFollowUp,
} from '../../api/followUps';
import { toDatetimeLocal } from '../../utils/formatters';

export default function LeadFollowUpSection({ lead, onActivityChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchItems = useCallback(() => {
    if (!lead?._id) return;
    setLoading(true);
    getFollowUps({ lead: lead._id, limit: 20 })
      .then(({ data }) => setItems(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [lead._id]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSave = async (payload) => {
    await createFollowUp({ ...payload, lead: lead._id });
    fetchItems();
    onActivityChange?.();
  };

  const handleComplete = async (id) => {
    await completeFollowUp(id);
    fetchItems();
    onActivityChange?.();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this follow-up?')) return;
    await deleteFollowUp(id);
    fetchItems();
    onActivityChange?.();
  };

  const overdueCount = items.filter((i) => i.status === 'overdue').length;

  return (
    <div className="border-t border-border py-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Follow-up history
          </p>
          {overdueCount > 0 && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {overdueCount} overdue reminder{overdueCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)}>
          <Plus size={14} />
          Add
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted py-4">Loading...</p>
      ) : (
        <FollowUpTimeline
          items={items}
          onComplete={handleComplete}
          onDelete={handleDelete}
          compact
          showLead={false}
        />
      )}

      <FollowUpFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        lockLead
        lockedLeadName={lead.name}
        leads={[lead]}
        initialData={{
          lead: String(lead._id),
          type: 'reminder',
          title: '',
          note: '',
          reminderDate: lead.followUpDate ? toDatetimeLocal(lead.followUpDate) : '',
        }}
        title="Add follow-up"
      />
    </div>
  );
}
