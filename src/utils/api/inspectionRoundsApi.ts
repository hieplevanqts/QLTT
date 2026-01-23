/**
 * Inspection Rounds API
 * Fetch and manage inspection rounds (campaigns)
 */

import { SUPABASE_REST_URL, getHeaders } from './config';
import { type InspectionRound } from '@/app/types/inspections';
import { calculateQuarter } from './sharedUtils';

// --- Types ---
export interface InspectionRoundResponse {
  _id: string;
  campaign_name: string;
  campaign_code: string;
  plan_id: string;
  campaign_status: number;
  start_time: string;
  end_time: string;
  lead_unit: string;
  department_id: string;
  decision_meta: any;
  team_meta: any;
  stats_meta: any;
  created_by_name: string;
  user_id: string;
  created_at: string;
  description: string;
  priority: number;
  [key: string]: any;
}

// --- Helpers ---
function mapRoundStatus(status: string | number | null): InspectionRound['status'] {
  if (typeof status === 'number') {
    const mapping: Record<number, InspectionRound['status']> = {
      0: 'draft',
      1: 'pending_approval',
      2: 'approved',
      3: 'active',
      4: 'completed',
      5: 'paused',
      6: 'cancelled',
      7: 'rejected'
    };
    return mapping[status] || 'draft';
  }

  const statusMap: Record<string, InspectionRound['status']> = {
    'draft': 'draft', 'nhap': 'draft',
    'pending_approval': 'pending_approval', 'cho_duyet': 'pending_approval',
    'approved': 'approved', 'da_duyet': 'approved',
    'active': 'active', 'dang_trien_khai': 'active',
    'paused': 'paused', 'tam_dung': 'paused',
    'in_progress': 'in_progress', 'dang_kiem_tra': 'in_progress',
    'completed': 'completed', 'hoan_thanh': 'completed',
    'cancelled': 'cancelled', 'huy': 'cancelled',
    'rejected': 'rejected', 'tu_choi': 'rejected',
  };
  return statusMap[status?.toLowerCase() || ''] || 'draft';
}

function mapRowToRound(row: InspectionRoundResponse): InspectionRound {
  const teamMeta = row.team_meta || {};
  const statsMeta = row.stats_meta || {};
  const decisionMeta = row.decision_meta || {};

  const total = statsMeta.totalTargets || 0;
  const inspected = statsMeta.inspectedTargets || 0;

  const start = row.start_time || row.start_date || new Date().toISOString();

  return {
    id: row._id,
    name: row.campaign_name || '',
    code: row.campaign_code || (row._id ? row._id.substring(0, 8).toUpperCase() : ''),
    planId: row.plan_id,
    planCode: decisionMeta.planCode || '',
    planName: decisionMeta.planName || '', 
    quarter: calculateQuarter(start),
    type: 'routine', 
    status: mapRoundStatus(row.campaign_status),
    startDate: start,
    endDate: row.end_time || row.end_date || new Date().toISOString(),
    leadUnit: row.owner_dept || row.lead_unit || teamMeta.leadUnit || '',
    leadUnitId: row.department_id,
    teamLeader: teamMeta.teamLeader || '',
    team: teamMeta.team || [],
    teamSize: teamMeta.teamSize || 0,
    totalTargets: total,
    inspectedTargets: inspected,
    passedCount: statsMeta.passedCount || 0,
    warningCount: statsMeta.warningCount || 0,
    violationCount: statsMeta.violationCount || 0,
    createdBy: row.created_by_name || '',
    createdById: row.user_id,
    createdAt: row.created_at || new Date().toISOString(),
    notes: row.description || '',
    formTemplate: decisionMeta.formTemplate || '',
    scope: decisionMeta.scope || '',
    scopeDetails: decisionMeta.scopeDetails || { provinces: [], districts: [], wards: [] },
    stats: {
      totalSessions: total, 
      completedSessions: inspected,
      storesInspected: inspected,
      storesPlanned: total,
      violationsFound: statsMeta.violationCount || 0,
      violationRate: total > 0 ? Math.round(((statsMeta.violationCount || 0) / total) * 100) : 0,
      progress: total > 0 ? Math.round((inspected / total) * 100) : 0
    }
  };
}

// --- API Functions ---

export async function fetchInspectionRoundsApi(planId?: string): Promise<InspectionRound[]> {
  try {
    let url = `${SUPABASE_REST_URL}/map_inspection_campaigns?select=*&order=created_at.desc`;
    if (planId) {
      url += `&plan_id=eq.${planId}`;
    }
    
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data: InspectionRoundResponse[] = await response.json();
    return data.map(mapRowToRound);
  } catch (error) {
    console.error('fetchInspectionRoundsApi Error:', error);
    throw error;
  }
}

export async function fetchInspectionRoundByIdApi(id: string): Promise<InspectionRound | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_campaigns?_id=eq.${id}&select=*`;
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data: InspectionRoundResponse[] = await response.json();
    if (!data || data.length === 0) return null;
    
    return mapRowToRound(data[0]);
  } catch (error) {
    console.error('fetchInspectionRoundByIdApi Error:', error);
    throw error;
  }
}

export async function createInspectionRoundApi(round: Partial<InspectionRound>): Promise<InspectionRound | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_campaigns`;
    
    const payload = {
      campaign_name: round.name,
      plan_id: round.planId || undefined,
      campaign_status: 0, 
      department_id: round.leadUnitId || undefined, 
      owner_dept: round.leadUnit || '',
      start_time: round.startDate,
      end_time: round.endDate,
      description: round.notes || '',
      priority: 0, 
      campaign_code: round.code,
      partner: '',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errText}`);
    }
    
    const data: InspectionRoundResponse[] = await response.json();
    if (!data || data.length === 0) return null;
    
    return mapRowToRound(data[0]);
  } catch (error) {
    console.error('createInspectionRoundApi Error:', error);
    throw error;
  }
}

export async function updateInspectionRoundApi(id: string, updates: Partial<InspectionRound>): Promise<InspectionRound | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_campaigns?_id=eq.${id}`;
    
    const payload: any = {};
    if (updates.status) {
      const statusMapReverse: Record<string, number> = {
        'draft': 0,
        'pending_approval': 1,
        'approved': 2,
        'active': 3,
        'completed': 4,
        'paused': 5,
        'cancelled': 6,
        'rejected': 7,
        'in_progress': 3
      };
      if (updates.status in statusMapReverse) {
        payload.campaign_status = statusMapReverse[updates.status];
      }
    }

    if (updates.name) payload.campaign_name = updates.name;
    if (updates.notes) payload.description = updates.notes;
    if (updates.startDate) payload.start_time = updates.startDate;
    if (updates.endDate) payload.end_time = updates.endDate;
    if (updates.planId) payload.plan_id = updates.planId;
    if (updates.leadUnitId) payload.department_id = updates.leadUnitId;
    if (updates.leadUnit) payload.owner_dept = updates.leadUnit;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errText}`);
    }
    
    const data: InspectionRoundResponse[] = await response.json();
    if (!data || data.length === 0) return null;
    
    return mapRowToRound(data[0]);
  } catch (error) {
    console.error('updateInspectionRoundApi Error:', error);
    throw error;
  }
}

export async function deleteInspectionRoundApi(id: string): Promise<boolean> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_campaigns?_id=eq.${id}`;
    const response = await fetch(url, { method: 'DELETE', headers: getHeaders() });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errText}`);
    }
    return true;
  } catch (error) {
    console.error('deleteInspectionRoundApi Error:', error);
    throw error;
  }
}
