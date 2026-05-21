import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import KanbanLeadCard from './KanbanLeadCard';
import { ItemTypes } from './pipelineTypes';

export default function KanbanColumn({ column, leads, onDropLead, onCardClick }) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.LEAD,
      drop: (item) => {
        if (item.status !== column.id) {
          onDropLead(item.id, column.id);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [column.id, onDropLead]
  );

  const isActive = isOver && canDrop;

  return (
    <div className="flex h-full min-w-[280px] max-w-[320px] flex-1 flex-col sm:min-w-[260px]">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">{column.title}</h3>
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ${column.accent}`}
          >
            {leads.length}
          </span>
        </div>
      </div>

      <div
        ref={drop}
        className={`flex min-h-[200px] flex-1 flex-col gap-3 rounded-xl border-2 border-dashed p-3 transition-colors duration-200 sm:min-h-[420px] ${
          isActive
            ? 'border-primary/50 bg-primary/5'
            : 'border-transparent bg-slate-100/60'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {leads.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-xs text-muted"
            >
              Drop leads here
            </motion.p>
          ) : (
            leads.map((lead) => (
              <KanbanLeadCard key={lead._id} lead={lead} onClick={onCardClick} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
