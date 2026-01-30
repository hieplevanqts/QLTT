import { useState, useEffect } from 'react';
import { type InspectionRound, type InspectionRoundStatus } from '@/utils/data/inspection-rounds-mock-data';
import { fetchInspectionRoundByIdApi, updateInspectionRoundApi, deleteInspectionRoundApi } from '@/utils/api/inspectionRoundsApi';

interface UseSupabaseInspectionRoundReturn {
  round: InspectionRound | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateStatus: (status: string, notes?: string) => Promise<void>;
  deleteRound: () => Promise<void>;
}

export function useSupabaseInspectionRound(id?: string): UseSupabaseInspectionRoundReturn {
  const [round, setRound] = useState<InspectionRound | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRound = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchInspectionRoundByIdApi(id);
      setRound(data);
    } catch (err: any) {
      console.error('Error fetching inspection round from API:', err);
      setError(err.message || 'Không thể tải thông tin đợt kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRound();
  }, [id]);

  const updateStatus = async (status: string, notes?: string) => {
    if (!id) return;
    try {
      await updateInspectionRoundApi(id, { status: status as InspectionRoundStatus });
      await fetchRound();
    } catch (err: any) {
      console.error('Error updating round status:', err);
      throw err;
    }
  };

  const deleteRound = async () => {
    if (!id) return;
    try {
      await deleteInspectionRoundApi(id);
    } catch (err: any) {
      console.error('Error deleting round:', err);
      throw err;
    }
  };

  return {
    round,
    loading,
    error,
    refetch: fetchRound,
    updateStatus,
    deleteRound,
  };
}
