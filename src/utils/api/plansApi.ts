/**
 * Plans API
 * Fetch plans and inspection rounds from Supabase using REST API
 */

import { SUPABASE_REST_URL, getHeaders } from './config';
import { type Plan } from '@/app/data/kehoach-mock-data';
import { type InspectionRound } from '@/app/data/inspection-rounds-mock-data';

// --- Types ---
export interface PlanResponse {
  _id: string; // Primary key is _id
  id?: string;
  plan_id?: string;
  plan_name: string;
  plan_type: string;
  plan_status: string;
  legal_bases: any;
  application_scope: any;
  time_frame: any;
  created_by: string;
  creator_name: string;
  department_id: string;
  created_at: string;
  [key: string]: any;
}

export interface InspectionRoundResponse {
  id: string;
  campaign_name: string;
  campaign_code: string;
  plan_id: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  lead_unit: string;
  decision_meta: any;
  team_meta: any;
  stats_meta: any;
  created_by_name: string;
  created_by: string;
  created_at: string;
  description: string;
  [key: string]: any;
}

// --- Helpers ---

// Helper to calculate quarter from date
function calculateQuarter(dateString: string): string {
  try {
    const date = new Date(dateString);
    const month = date.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    const year = date.getFullYear();
    return `Q${quarter}/${year}`;
  } catch {
    return 'Q1/2026';
  }
}

function mapPlanType(type: string | null): 'periodic' | 'thematic' | 'urgent' {
  const typeMap: Record<string, 'periodic' | 'thematic' | 'urgent'> = {
    'periodic': 'periodic', 'dinh_ky': 'periodic', 'định_kỳ': 'periodic',
    'thematic': 'thematic', 'chuyen_de': 'thematic', 'chuyên_đề': 'thematic',
    'urgent': 'urgent', 'dot_xuat': 'urgent', 'đột_xuất': 'urgent',
  };
  return typeMap[type?.toLowerCase()?.replace(/\s/g, '_') || ''] || 'periodic';
}

function mapPlanStatus(status: string | null): Plan['status'] {
  const statusMap: Record<string, Plan['status']> = {
    'draft': 'draft', 'nhap': 'draft', 'nháp': 'draft',
    'pending_approval': 'pending_approval', 'cho_duyet': 'pending_approval', 'chờ_duyệt': 'pending_approval',
    'approved': 'approved', 'da_duyet': 'approved', 'đã_duyệt': 'approved',
    'active': 'active', 'dang_thuc_hien': 'active', 'đang_thực_hiện': 'active',
    'completed': 'completed', 'hoan_thanh': 'completed', 'hoàn_thành': 'completed',
    'paused': 'paused', 'tam_dung': 'paused', 'tạm_dừng': 'paused',
    'rejected': 'rejected', 'tu_choi': 'rejected', 'từ_chối': 'rejected',
    'cancelled': 'cancelled', 'huy': 'cancelled', 'hủy': 'cancelled',
  };
  return statusMap[status?.toLowerCase()?.replace(/\s/g, '_') || ''] || 'draft';
}

function mapRoundStatus(status: string | null): InspectionRound['status'] {
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

function mapRoundType(type: string | null): InspectionRound['type'] {
  const typeMap: Record<string, InspectionRound['type']> = {
    'routine': 'routine', 'dinh_ky': 'routine',
    'targeted': 'targeted', 'chuyen_de': 'targeted',
    'sudden': 'sudden', 'dot_xuat': 'sudden',
    'followup': 'followup', 'tai_kiem_tra': 'followup',
  };
  return typeMap[type?.toLowerCase() || ''] || 'routine';
}

// --- Mappers ---

function mapRowToPlan(row: PlanResponse): Plan | null {
  if (!row) return null;
  
  // PRIMARY KEY FIX: Use _id as the main ID
  const id = row._id || row.id || row.plan_id;
  if (!id) return null;

  const appScope = row.application_scope || {};
  const timeframe = row.time_frame || {};
  const legal = row.legal_bases || {};

  const start = timeframe.start_date || timeframe.startDate || new Date().toISOString();
  
  return {
    id: id,
    code: row.plan_code || id,
    name: row.plan_name || '',
    planType: mapPlanType(row.plan_type),
    quarter: calculateQuarter(start),
    topic: legal.topic || legal.title || '',
    scope: appScope.scope || appScope.description || '',
    scopeLocation: appScope.location || appScope.scopeLocation || '',
    responsibleUnit: row.departments?.name || row.department_id || '',
    region: appScope.region || '',
    leadUnit: row.department_id || '',
    objectives: legal.objectives || '',
    status: mapPlanStatus(row.plan_status),
    priority: 'medium',
    startDate: start,
    endDate: timeframe.end_date || timeframe.endDate || new Date().toISOString(),
    createdBy: row.creator_name || row.created_by || '',
    createdAt: row.created_at || new Date().toISOString(),
    description: legal.description || '',
    stats: { totalTargets: 0, totalTasks: 0, completedTasks: 0, progress: 0 }
  };
}

function mapRowToRound(row: InspectionRoundResponse): InspectionRound {
  const teamMeta = row.team_meta || {};
  const statsMeta = row.stats_meta || {};

  return {
    id: row.id,
    name: row.campaign_name || 'Đợt kiểm tra chưa có tên',
    code: row.campaign_code || row.id.substring(0, 8).toUpperCase(),
    planId: row.plan_id,
    planName: '', 
    type: mapRoundType(row.type),
    status: mapRoundStatus(row.status),
    startDate: row.start_date || new Date().toISOString(),
    endDate: row.end_date || new Date().toISOString(),
    leadUnit: row.lead_unit || teamMeta.leadUnit || 'Chưa xác định',
    team: teamMeta.team || [],
    teamSize: teamMeta.teamSize || 0,
    totalTargets: statsMeta.totalTargets || 0,
    inspectedTargets: statsMeta.inspectedTargets || 0,
    passedCount: statsMeta.passedCount || 0,
    warningCount: statsMeta.warningCount || 0,
    violationCount: statsMeta.violationCount || 0,
    createdBy: row.created_by_name || row.created_by || 'Hệ thống',
    createdAt: row.created_at || new Date().toISOString(),
    notes: row.description || '',
  };
}

// --- API Functions ---

export async function fetchPlansApi(): Promise<Plan[]> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_plans?select=*,departments(name)&order=created_at.desc`;
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data: PlanResponse[] = await response.json();
    return data.map(mapRowToPlan).filter((p): p is Plan => p !== null);
  } catch (error) {
    console.error('fetchPlansApi Error:', error);
    throw error;
  }
}

export async function fetchPlanByIdApi(id: string): Promise<Plan | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_plans?_id=eq.${id}&select=*`;
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data: PlanResponse[] = await response.json();
    if (!data || data.length === 0) return null;
    
    return mapRowToPlan(data[0]);
  } catch (error) {
    console.error('fetchPlanByIdApi Error:', error);
    throw error;
  }
}

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

export async function createPlanApi(plan: Partial<Plan>): Promise<Plan | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_plans`;
    
    // Map Frontend Plan to Backend Payload
    const payload = {
      plan_name: plan.name,
      plan_type: plan.planType,
      plan_status: plan.status || 'draft',
      department_id: plan.responsibleUnit,
      created_by: 'user_id_placeholder', // TODO: Get actual user ID
      creator_name: plan.createdBy || 'Người dùng',
      
      // JSON fields
      legal_bases: {
        topic: plan.topic,
        objectives: plan.objectives,
        description: plan.topic
      },
      time_frame: {
        start_date: plan.startDate,
        end_date: plan.endDate
      },
      application_scope: {
        scope: plan.scope,
        location: plan.scopeLocation
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
        'Prefer': 'return=representation' // Return the created object
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errText}`);
    }
    
    const data: PlanResponse[] = await response.json();
    if (!data || data.length === 0) return null;
    
    return mapRowToPlan(data[0]);
  } catch (error) {
    console.error('createPlanApi Error:', error);
    throw error;
  }
}
