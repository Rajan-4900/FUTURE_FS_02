export const FOLLOWUP_TYPES = {
  note: 'Note',
  reminder: 'Reminder',
  call: 'Call',
  email: 'Email',
  meeting: 'Meeting',
};

export const TYPE_OPTIONS = Object.entries(FOLLOWUP_TYPES).map(([value, label]) => ({
  value,
  label,
}));

export const STATUS_LABELS = {
  overdue: 'Overdue',
  due_today: 'Due today',
  upcoming: 'Upcoming',
  completed: 'Completed',
  note: 'Note',
};

export const STATUS_STYLES = {
  overdue: 'bg-red-50 text-red-700 border-red-100',
  due_today: 'bg-amber-50 text-amber-700 border-amber-100',
  upcoming: 'bg-blue-50 text-blue-700 border-blue-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  note: 'bg-slate-50 text-slate-600 border-slate-100',
};

export const emptyFollowUpForm = {
  lead: '',
  type: 'reminder',
  title: '',
  note: '',
  reminderDate: '',
};
