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

      const { data, error: fetchError } = await supabase
        .from('map_inspection_campaigns')
        .select('*, id:_id')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Map Supabase data to InspectionRound interface based on actual table schema
      const mappedRounds: InspectionRound[] = (Array.isArray(data) ? data : []).map((row: any) => {
        if (!row || typeof row !== 'object') {
          return null;
        }

        return {
          id: row.id || '',
          code: row.id || '', // Use id as code since campaign_code doesn't exist
          name: row.campaign_name || '',
          description: '', // No description field in table
          planId: row.plan_id || '',
          planName: '', // No plan_name field in table
          leadUnit: row.owner_dept || '',
          startDate: '', // No start_date field in table
          endDate: '', // No end_date field in table
          totalTargets: 0, // No targets field in table
          inspectedTargets: 0, // No inspected count field in table
          status: mapCampaignStatus(row.campaign_status),
          type: 'routine', // No campaign_type field in table, default to routine
          teamSize: 0, // No team_size field in table
          createdBy: row.created_by || '',
          createdAt: convertTimestamp(row.created_at || row.created_time),
        };
      }).filter((round): round is InspectionRound => round !== null);

      setRounds(mappedRounds);
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
      
      const timestamp = Date.now();
      
      // Direct Supabase update (will work if RLS is properly configured)
      const { data, error: updateError } = await supabase
        .from('map_inspection_campaigns')
        .update({
          campaign_status: newStatus,
          last_update_time: timestamp,
          updated_at: timestamp,
        })
        .eq('_id', roundId)
        .select()
        .single();

      if (updateError) {
        console.error('Direct Supabase update failed, trying server endpoint...', updateError);
        
        // Fallback to server endpoint if direct update fails (RLS issue)
        const response = await fetch(`${SERVER_URL}/inspection-rounds/${roundId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ status: newStatus, note }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server endpoint error response:', errorText);
          throw new Error(`Failed to update inspection round status: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
      } else {
      }

      // Update the local state with the new status
      setRounds(prevRounds => prevRounds.map(round => 
        round.id === roundId ? { ...round, status: newStatus } : round
      ));
      
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
