import { useState, useEffect, useCallback } from 'react';
import { getFollowUpStats } from '../api/followUps';

export function useFollowUpStats(refreshInterval = 60000) {
  const [stats, setStats] = useState({ overdue: 0, dueToday: 0, upcoming: 0, totalPending: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    getFollowUpStats()
      .then(({ data }) => setStats(data.data))
      .catch(() => setStats({ overdue: 0, dueToday: 0, upcoming: 0, totalPending: 0 }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, refreshInterval);
    return () => clearInterval(id);
  }, [refresh, refreshInterval]);

  return { stats, loading, refresh };
}
