import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { Building2, Calendar } from 'lucide-react';
import Badge from '../ui/Badge';
import { ItemTypes } from './pipelineTypes';
import { formatDate } from '../../utils/formatters';
import { PRIORITY_LABELS } from '../../utils/leadConstants';

export default function KanbanLeadCard({ lead, onClick }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.LEAD,
      item: { id: lead._id, status: lead.status },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [lead._id, lead.status]
  );

  return (
    <motion.div
      ref={drag}
      layout
      layoutId={lead._id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0, scale: isDragging ? 0.98 : 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => onClick?.(lead)}
      className={`cursor-grab rounded-xl border border-border/80 bg-white p-4 card-shadow transition-shadow duration-150 active:cursor-grabbing hover:card-shadow-md ${
        isDragging ? 'ring-2 ring-primary/30' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-slate-900 leading-snug">{lead.name}</p>
        <Badge status={lead.priority}>{PRIORITY_LABELS[lead.priority]}</Badge>
      </div>
      {lead.company && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <Building2 size={12} />
          {lead.company}
        </p>
      )}
      {lead.followUpDate && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
          <Calendar size={12} />
          {formatDate(lead.followUpDate)}
        </p>
      )}
    </motion.div>
  );
}
