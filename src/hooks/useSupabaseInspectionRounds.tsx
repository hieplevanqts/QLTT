import { useState, useEffect } from 'react';
import { type InspectionRound, type InspectionRoundStatus } from '@/app/types/inspections';
export type { InspectionRound, InspectionRoundStatus };
import { 
  fetchInspectionRoundsApi, 
  updateInspectionRoundApi, 
  deleteInspectionRoundApi,
  fetchInspectionRoundByIdApi, 
  createInspectionRoundApi 
} from '@/utils/api/inspectionRoundsApi';

interface UseSupabaseInspectionRoundsReturn {
  rounds: InspectionRound[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateRoundStatus: (id: string, status: string) => Promise<void>;
  deleteRound: (id: string) => Promise<void>;
  getRoundById: (id: string) => Promise<InspectionRound | null>;
  createRound: (round: Partial<InspectionRound>) => Promise<InspectionRound | null>;
  updateRound: (id: string, round: Partial<InspectionRound>) => Promise<InspectionRound | null>;
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

  const updateRoundStatus = async (id: string, status: string) => {
    try {
      await updateInspectionRoundApi(id, { status: status as InspectionRoundStatus });
      await fetchRounds();
    } catch (err: any) {
      console.error('Error updating round status:', err);
      throw err;
    }
  };

  const deleteRound = async (id: string) => {
    try {
      await deleteInspectionRoundApi(id);
      await fetchRounds();
    } catch (err: any) {
      console.error('Error deleting round:', err);
      throw err;
    }
  };

  const getRoundById = async (id: string) => {
    try {
      return await fetchInspectionRoundByIdApi(id);
    } catch (err) {
      console.error('Error fetching round by id:', err);
      return null;
    }
  };

  const createRound = async (round: Partial<InspectionRound>) => {
    try {
      const newRound = await createInspectionRoundApi(round);
      await fetchRounds(); // Refresh list
      return newRound;
    } catch (err) {
      console.error('Error creating round:', err);
      throw err;
    }
  };

  const updateRound = async (id: string, round: Partial<InspectionRound>) => {
    try {
      const updated = await updateInspectionRoundApi(id, round);
      await fetchRounds(); // Refresh list
      return updated;
    } catch (err) {
      console.error('Error updating round:', err);
      throw err;
    }
  };

  return {
    rounds,
    loading,
    error,
    refetch: fetchRounds,
    updateRoundStatus,
    deleteRound,
    getRoundById,
    createRound,
    updateRound,
  };
}
