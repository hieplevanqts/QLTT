import { useState, useEffect } from 'react';
import { type InspectionRound } from '@/app/data/inspection-rounds-mock-data';
import { fetchInspectionRoundsApi } from '@/utils/api/plansApi';

interface UseSupabaseInspectionRoundsReturn {
  rounds: InspectionRound[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSupabaseInspectionRounds(planId?: string, enabled: boolean = true): UseSupabaseInspectionRoundsReturn {
  const [rounds, setRounds] = useState<InspectionRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRounds = async () => {
    // If planId is provided but invalid (empty), don't fetch
    if (planId !== undefined && !planId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchInspectionRoundsApi(planId);
      setRounds(data);
    } catch (err: any) {
      console.error('Error fetching inspection rounds from API:', err);
      setError(err.message || 'Không thể tải danh sách đợt kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchRounds();
    }
  }, [planId, enabled]);

  return {
    rounds,
    loading,
    error,
    refetch: fetchRounds,
  };
}
