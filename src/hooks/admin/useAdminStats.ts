import { useEffect, useState } from 'react';

export function useAdminStats() {
  const [stats, setStats] = useState({
    totalItems: 0,
    activeLoans: 0,
    pending: 0,
  });

  useEffect(() => {
    // simulasi API
    setTimeout(() => {
      setStats({
        totalItems: 1234,
        activeLoans: 56,
        pending: 12,
      });
    }, 300);
  }, []);

  return stats;
}
