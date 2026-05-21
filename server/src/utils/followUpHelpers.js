export const getFollowUpStatus = (followUp) => {
  if (followUp.completed) return 'completed';
  if (!followUp.reminderDate) return 'note';
  const reminder = new Date(followUp.reminderDate);
  const now = new Date();
  if (reminder < now) return 'overdue';
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (reminder <= today) return 'due_today';
  return 'upcoming';
};

export const formatFollowUp = (doc) => {
  const followUp = doc.toObject ? doc.toObject() : { ...doc };
  return {
    ...followUp,
    status: getFollowUpStatus(followUp),
  };
};
