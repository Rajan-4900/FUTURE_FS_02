import { PIPELINE_COLUMNS } from '../../utils/leadConstants';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ leads, onDropLead, onCardClick }) {
  const leadsByStatus = PIPELINE_COLUMNS.reduce((acc, col) => {
    acc[col.id] = leads.filter((l) => l.status === col.id);
    return acc;
  }, {});

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:gap-5 lg:overflow-x-auto">
      {PIPELINE_COLUMNS.map((column) => (
        <div key={column.id} className="snap-start shrink-0 flex-1 min-w-[280px]">
          <KanbanColumn
            column={column}
            leads={leadsByStatus[column.id] || []}
            onDropLead={onDropLead}
            onCardClick={onCardClick}
          />
        </div>
      ))}
    </div>
  );
}
