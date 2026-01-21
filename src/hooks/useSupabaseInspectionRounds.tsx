import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Server endpoint for bypassing RLS
const SERVER_URL = `${supabaseUrl}/functions/v1/make-server-b36723fe`;

export interface InspectionRound {
  id: string;
  code: string;
  name: string;
  description?: string;
  planId: string;
  planName: string;
  leadUnit: string;
  startDate: string;
  endDate: string;
  totalTargets: number;
  inspectedTargets: number;
  status: 'draft' | 'preparing' | 'in_progress' | 'reporting' | 'completed' | 'cancelled' | 
    'pending_approval' | 'approved' | 'rejected' | 'paused' | 'active';
  type: 'routine' | 'targeted' | 'sudden' | 'followup';
  teamSize: number;
  createdBy: string;
  createdAt: string;
}

interface UseSupabaseInspectionRoundsReturn {
  rounds: InspectionRound[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateRoundStatus: (roundId: string, newStatus: InspectionRound['status'], note?: string) => Promise<void>;
  createRound: (data: {
    id: string;
    campaignName: string;
    planId?: string;
    ownerDept: string;
    createdBy: string;
    campaignStatus?: string;
  }) => Promise<void>;
}

export function useSupabaseInspectionRounds(): UseSupabaseInspectionRoundsReturn {
  const [rounds, setRounds] = useState<InspectionRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRounds = async () => {
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
      console.error('Error fetching inspection rounds from Supabase:', err);
      setError(err.message || 'Không thể tải danh sách đợt kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const updateRoundStatus = async (roundId: string, newStatus: InspectionRound['status'], note?: string) => {
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
      console.error('=== updateRoundStatus ERROR ===');
      console.error('Error updating inspection round status:', err);
      console.error('Error stack:', err.stack);
      throw err; // Re-throw to allow caller to handle the error
    }
  };

  const createRound = async (data: {
    id: string;
    campaignName: string;
    planId?: string;
    ownerDept: string;
    createdBy: string;
    campaignStatus?: string;
  }) => {
    try {
      // Call server endpoint to bypass RLS
      const response = await fetch(`${SERVER_URL}/inspection-rounds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create inspection round');
      }

      const result = await response.json();
      const insertData = result.data;

      // Add the new round to the local state
      const newRound: InspectionRound = {
        id: insertData.id,
        code: insertData.id,
        name: insertData.campaign_name,
        description: '',
        planId: insertData.plan_id || '',
        planName: '',
        leadUnit: insertData.owner_dept,
        startDate: '',
        endDate: '',
        totalTargets: 0,
        inspectedTargets: 0,
        status: mapCampaignStatus(insertData.campaign_status),
        type: 'routine',
        teamSize: 0,
        createdBy: insertData.created_by,
        createdAt: convertTimestamp(insertData.created_at),
      };

      setRounds(prevRounds => [newRound, ...prevRounds]);

    } catch (err: any) {
      console.error('Error creating inspection round:', err);
      throw err; // Re-throw to allow caller to handle the error
    }
  };

  return {
    rounds,
    loading,
    error,
    refetch: fetchRounds,
    updateRoundStatus,
    createRound,
  };
}

// Helper function to convert bigint timestamp to ISO string
function convertTimestamp(timestamp: number | null | undefined): string {
  if (!timestamp) return new Date().toISOString();
  
  // Check if timestamp is in milliseconds or seconds
  const ts = timestamp > 10000000000 ? timestamp : timestamp * 1000;
  
  try {
    return new Date(ts).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

// Helper function to map campaign status
function mapCampaignStatus(status: string | null): InspectionRound['status'] {
  const statusMap: Record<string, InspectionRound['status']> = {
    'draft': 'draft',
    'nhap': 'draft',
    'nháp': 'draft',
    'preparing': 'preparing',
    'chuan_bi': 'preparing',
    'chuẩn_bị': 'preparing',
    'in_progress': 'in_progress',
    'dang_kiem_tra': 'in_progress',
    'đang_kiểm_tra': 'in_progress',
    'dang_thuc_hien': 'in_progress',
    'reporting': 'reporting',
    'bao_cao': 'reporting',
    'báo_cáo': 'reporting',
    'hoan_thanh_bao_cao': 'reporting',
    'completed': 'completed',
    'hoan_thanh': 'completed',
    'hoàn_thành': 'completed',
    'cancelled': 'cancelled',
    'huy': 'cancelled',
    'hủy': 'cancelled',
    'da_huy': 'cancelled',
    'pending_approval': 'pending_approval',
    'đang_chờ_duyệt': 'pending_approval',
    'approved': 'approved',
    'đã_duyệt': 'approved',
    'rejected': 'rejected',
    'đã_từ_chối': 'rejected',
    'paused': 'paused',
    'tạm_dừng': 'paused',
    'active': 'active',
    'đang_hoạt_động': 'active',
  };
  return statusMap[status?.toLowerCase()?.replace(/\s/g, '_') || ''] || 'draft';
}

// Helper function to map campaign type
function mapCampaignType(type: string | null): InspectionRound['type'] {
  const typeMap: Record<string, InspectionRound['type']> = {
    'routine': 'routine',
    'định_kỳ': 'routine',
    'targeted': 'targeted',
    'đích_tường': 'targeted',
    'sudden': 'sudden',
    'bất_ngờ': 'sudden',
    'followup': 'followup',
    'theo_dõi': 'followup',
  };
  return typeMap[type?.toLowerCase()?.replace(/\s/g, '_') || ''] || 'routine';
}
