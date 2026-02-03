/**
 * Inspection Rounds API
 * Fetch and manage inspection rounds (campaigns)
 */

import { SUPABASE_REST_URL, getHeaders } from './config';
import { type InspectionRound } from '@/types/inspections';
import { calculateQuarter } from './sharedUtils';

// --- Types ---
export interface InspectionRoundResponse {
  _id: string;
  campaign_name: string;
  campaign_code: string;
  plan_id: string;
  campaign_status: string | number;
  start_time: string;
  end_time: string;
  lead_unit: string;
  department_id: string;
  decision_meta: any;
  team_meta: any;
  stats_meta: any;
  created_by_name: string;
  user_id: string;
  province_id?: string;
  ward_id?: string;
  created_at: string;
  priority: number;
  attachments?: any; // JSON field
  map_inspection_plans?: {
    plan_name: string;
    code: string;
  };
  [key: string]: any;
}

// --- Helpers ---
function mapRoundStatus(status: string | number | null): InspectionRound['status'] {
  // Handle numeric status codes (prefer types from DB)
  const statusCode = typeof status === 'string' ? parseInt(status, 10) : status;

  if (typeof statusCode === 'number' && !isNaN(statusCode)) {
    const mapping: Record<number, InspectionRound['status']> = {
      1: 'draft',
      2: 'pending_approval',
      3: 'approved',
      4: 'active',
      5: 'completed',
      6: 'rejected',
      7: 'paused',     // Keep these if they exist in DB, or map to closest
      8: 'cancelled'
    };
    return mapping[statusCode] || 'draft';
  }

  // Handle string status labels (similar to Plans)
  const statusStr = String(status || '').toLowerCase().replace(/\s/g, '_');
  const statusMap: Record<string, InspectionRound['status']> = {
    'draft': 'draft', 'nhap': 'draft', 'nháp': 'draft',
    'pending_approval': 'pending_approval', 'cho_duyet': 'pending_approval', 'chờ_duyệt': 'pending_approval',
    'approved': 'approved', 'da_duyet': 'approved', 'đã_duyệt': 'approved',
    'active': 'active', 'dang_trien_khai': 'active', 'đang_triển_khai': 'active', 'dang_thuc_hien': 'active', 'đang_thực_hiện': 'active',
    'paused': 'paused', 'tam_dung': 'paused', 'tạm_dừng': 'paused',
    'in_progress': 'in_progress', 'dang_kiem_tra': 'in_progress', 'đang_kiểm_tra': 'in_progress',
    'completed': 'completed', 'hoan_thanh': 'completed', 'hoàn_thành': 'completed', 'reporting': 'completed',
    'cancelled': 'cancelled', 'huy': 'cancelled', 'hủy': 'cancelled',
    'rejected': 'rejected', 'tu_choi': 'rejected', 'từ_chối': 'rejected',
  };
  return statusMap[statusStr] || 'draft';
}

function mapRowToRound(row: InspectionRoundResponse): InspectionRound {
  const teamMeta = row.team_meta || {};
  const statsMeta = row.stats_meta || {};
  const decisionMeta = row.decision_meta || {};

  const total = statsMeta.totalTargets || 0;
  const inspected = statsMeta.inspectedTargets || 0;

  const start = row.start_time || row.start_date || new Date().toISOString();

  return {
    id: row._id || (row as any).id || '',
    name: row.campaign_name || '',
    code: row.campaign_code || (row._id ? row._id.substring(0, 8).toUpperCase() : ''),
    campaign_code: row.campaign_code,
    planId: row.plan_id,
    planCode: decisionMeta.planCode || row.map_inspection_plans?.code || '',
    planName: decisionMeta.planName || row.map_inspection_plans?.plan_name || '', 
    quarter: calculateQuarter(start),
    type: 'routine', 
    status: mapRoundStatus(row.campaign_status),
    startDate: start,
    endDate: row.end_time || row.end_date || new Date().toISOString(),
    leadUnit: row.owner_dept || row.lead_unit || teamMeta.leadUnit || '',
    leadUnitId: row.department_id,
    departmentId: row.department_id,
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
    provinceId: row.province_id,
    wardId: row.ward_id,
    createdAt: row.created_at || new Date().toISOString(),
    notes: '',
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
    },
    priority: row.priority === 4 ? 'urgent' : 
              row.priority === 3 ? 'high' : 
              row.priority === 2 ? 'medium' : 'low'
  };
}

// --- API Functions ---

import { store } from '@/store/store';

export async function fetchInspectionRoundsApi(planId?: string): Promise<InspectionRound[]> {
  try {
    const state = store.getState();
    const path = state.auth.user?.app_metadata?.department?.path || '';

    // Switch to v_campaigns_by_department
    // Explicitly use the foreign key to resolve ambiguous relationship
    let url = `${SUPABASE_REST_URL}/v_campaigns_by_department?select=*,map_inspection_plans!fk_campaigns_plan(plan_name,code)&order=created_at.desc`;
    if (planId) {
      url += `&plan_id=eq.${planId}`;
    }
    
    if (path) {
      url += `&department_path=like.${path}*`;
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
    const url = `${SUPABASE_REST_URL}/map_inspection_campaigns?_id=eq.${id}&select=*,map_inspection_plans(plan_name,code)`;
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
      campaign_status: 1, // Default state is Nháp (1)
      department_id: round.leadUnitId || undefined, 
      owner_dept: round.leadUnit || '',
      start_time: round.startDate,
      end_time: round.endDate,
      priority: round.priority === 'urgent' ? 4 : 
                round.priority === 'high' ? 3 : 
                round.priority === 'medium' ? 2 : 1,
      campaign_code: round.code,
      province_id: round.provinceId || undefined,
      ward_id: round.wardId || undefined,
      partner: '',
      attachments: round.attachments || []
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
      const reverseStatusMap: Record<string, number> = {
        'draft': 1,
        'pending_approval': 2,
        'approved': 3,
        'active': 4,
        'in_progress': 4,
        'completed': 5,
        'rejected': 6,
        'paused': 7,
        'cancelled': 8,
        'reporting': 5
      };
      payload.campaign_status = reverseStatusMap[updates.status] || updates.status;
    }

    if (updates.name) payload.campaign_name = updates.name;
    if (updates.code) payload.campaign_code = updates.code;
    if (updates.startDate) payload.start_time = updates.startDate;
    if (updates.endDate) payload.end_time = updates.endDate;
    if (updates.planId) payload.plan_id = updates.planId;
    if (updates.leadUnitId) payload.department_id = updates.leadUnitId;
    if (updates.leadUnit) {
      payload.owner_dept = updates.leadUnit;
    }
    
    if (updates.provinceId) payload.province_id = updates.provinceId;
    if (updates.wardId) payload.ward_id = updates.wardId;
    if (updates.priority) {
      payload.priority = updates.priority === 'urgent' ? 4 : 
                        updates.priority === 'high' ? 3 : 
                        updates.priority === 'medium' ? 2 : 1;
    }
    
    if (updates.attachments) payload.attachments = updates.attachments;
    
    // Removal of notes mapping as column doesn't exist in map_inspection_campaigns
    
    // Some tables might not have updated_at, removing for maximum compatibility 
    // unless explicitly needed. payload.updated_at = new Date().toISOString();

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    console.log('updateInspectionRoundApi: PATCH Payload:', JSON.stringify(payload));
    console.log('updateInspectionRoundApi: PATCH Response status:', response.status);
    
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
    console.log('deleteInspectionRoundApi: Fetching URL:', url);
    const response = await fetch(url, { method: 'DELETE', headers: getHeaders() });
    console.log('deleteInspectionRoundApi: Response status:', response.status);
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
