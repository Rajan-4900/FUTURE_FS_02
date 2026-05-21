import { STAGE_LABELS } from '../../utils/formatters';

const STAGE_COLORS = {
  qualification: 'bg-amber-400',
  proposal: 'bg-blue-400',
  negotiation: 'bg-violet-400',
  closed_won: 'bg-emerald-500',
  closed_lost: 'bg-slate-300',
};

export default function PipelineBar({ stats }) {
  const stages = Object.entries(stats?.byStage || {}).filter(([, count]) => count > 0);
  const total = stages.reduce((sum, [, count]) => sum + count, 0) || 1;

  return (
    <div className="space-y-4">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
        {stages.map(([stage, count]) => (
          <div
            key={stage}
            className={`${STAGE_COLORS[stage]} transition-all duration-300`}
            style={{ width: `${(count / total) * 100}%` }}
            title={`${STAGE_LABELS[stage]}: ${count}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Object.entries(STAGE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${STAGE_COLORS[key]}`} />
            <div>
              <p className="text-xs text-muted">{label}</p>
              <p className="text-sm font-medium text-slate-800">{stats?.byStage?.[key] || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
