/**
 * Plans API
 * Fetch plans and inspection rounds from Supabase using REST API
 */

import { SUPABASE_REST_URL, getHeaders } from './config';
import { type Plan } from '@/app/types/plans';
import { type InspectionRound } from '@/app/types/inspections';

// --- Types ---
export interface PlanResponse {
  _id: string; // Primary key is _id
  id?: string;
  plan_id?: string;
  plan_name: string;
  plan_type: string | null;
  plan_status: string | null;
  legal_bases: any;
  application_scope: any;
  time_frame: any;
  created_by: string | null;
  creator_name: string | null;
  owner_dept: string | null;
  department_id: string | null;
  site_id?: number | null;
  code: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent' | null;
  type: string; // 'active' | 'passive'
  start_time: string | null;
  end_time: string | null;
  status: number;
  year: string | null;
  quarter: string | null;
  partner: string;
  province_id: string;
  ward_id: string;
  description: string;
  target: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  [key: string]: any;
}

export interface InspectionRoundResponse {
  _id: string;
  campaign_name: string;
  campaign_code: string;
  plan_id: string;
  // type: string; // Removed or mapped from something else? Table has no 'type' column in provided schema, but maybe it's preserved or inferred.
  // Schema provided: assigned_team, user_id, owner_dept, site_id, etc.
  campaign_status: number; // changed to smallint
  start_time: string; // changed from start_date
  end_time: string; // changed from end_date
  lead_unit: string;
  department_id: string; // new lead unit id
  decision_meta: any;
  team_meta: any;
  stats_meta: any;
  created_by_name: string; // join result likely
  user_id: string; // created_by
  created_at: string;
  description: string; // notes
  priority: number;
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

// --- Mappers ---

function mapRowToPlan(row: PlanResponse): Plan | null {
  if (!row) return null;
  
  // PRIMARY KEY FIX: Use _id as the main ID
  const id = row._id || row.id || row.plan_id;
  if (!id) return null;

  const appScope = row.application_scope || {};
  const timeframe = row.time_frame || {};
  const legal = row.legal_bases || {};

  const start = row.start_time || timeframe.start_date || timeframe.startDate || new Date().toISOString();
  // Map PostgreSQL priority enum to frontend Priority type
  const mapPriority = (p: string | null): 'low' | 'medium' | 'high' | 'critical' => {
     if (p === 'urgent') return 'critical';
     if (p === 'critical') return 'critical';
     if (p === 'high') return 'high';
     if (p === 'medium') return 'medium';
     if (p === 'low') return 'low';
     return 'medium';
  };

  return {
    id: id,
    code: row.code || row.plan_code || id,
    name: row.plan_name || '',
    planType: mapPlanType(row.plan_type),
    quarter: row.quarter || calculateQuarter(start),
    topic: row.description || legal.topic || legal.title || '', // description is now a top level column
    scope: appScope.scope || appScope.description || '',
    scopeLocation: appScope.location || appScope.scopeLocation || '',
    responsibleUnit: row.departments?.name || row.owner_dept || '',
    region: appScope.region || '',
    leadUnit: row.department_id || '',
    provinceId: row.province_id,
    wardId: row.ward_id,
    objectives: legal.objectives || '',
    status: mapPlanStatus(row.plan_status),
    priority: mapPriority(row.priority),
    startDate: start,
    endDate: row.end_time || timeframe.end_date || timeframe.endDate || new Date().toISOString(),
    createdBy: row.users?.full_name || row.creator_name || "",
    createdById: row.created_by || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    description: row.description || legal.description || '',
    stats: { totalTargets: 0, totalTasks: 0, completedTasks: 0, progress: 0 }
  };
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
    name: row.campaign_name || 'Đợt kiểm tra chưa có tên',
    code: row.campaign_code || (row._id ? row._id.substring(0, 8).toUpperCase() : ''),
    planId: row.plan_id,
    planCode: decisionMeta.planCode || '',
    planName: decisionMeta.planName || '', 
    quarter: calculateQuarter(start),
    type: 'routine', // Default as type col is missing in provided schema, or use mapRoundType(row.type) if available
    status: mapRoundStatus(row.campaign_status),
    startDate: start,
    endDate: row.end_time || row.end_date || new Date().toISOString(),
    leadUnit: row.owner_dept || row.lead_unit || teamMeta.leadUnit || 'Chưa xác định',
    leadUnitId: row.department_id,
    teamLeader: teamMeta.teamLeader || '',
    team: teamMeta.team || [],
    teamSize: teamMeta.teamSize || 0,
    totalTargets: total,
    inspectedTargets: inspected,
    passedCount: statsMeta.passedCount || 0,
    warningCount: statsMeta.warningCount || 0,
    violationCount: statsMeta.violationCount || 0,
    createdBy: row.created_by_name || 'Người dùng',
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

export async function fetchPlansApi(): Promise<Plan[]> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_plans?select=*,departments(name)&order=created_at.desc`;
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    
    if (!response.ok) {
        const errText = await response.text();
        console.error('fetchPlansApi Response Error:', errText);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: PlanResponse[] = await response.json();
    
    // Fetch user names manually since join is missing
    const userIds = [...new Set(data.map(item => item.created_by).filter(Boolean))];
    let userMap: Record<string, string> = {};
    
    if (userIds.length > 0) {
      try {
        const usersUrl = `${SUPABASE_REST_URL}/users?_id=in.(${userIds.join(',')})&select=_id,full_name`;
        const usersRes = await fetch(usersUrl, { method: 'GET', headers: getHeaders() });
        if (usersRes.ok) {
          const usersData: any[] = await usersRes.json();
          userMap = usersData.reduce((acc, user) => {
            acc[user._id] = user.full_name;
            return acc;
          }, {});
        }
      } catch (err) {
        console.error('Error fetching user names:', err);
      }
    }

    return data.map(item => {
      const plan = mapRowToPlan(item);
      if (plan && item.created_by && userMap[item.created_by]) {
        plan.createdBy = userMap[item.created_by];
      }
      return plan;
    }).filter((p): p is Plan => p !== null);
  } catch (error) {
    console.error('fetchPlansApi Error:', error);
    throw error;
  }
}

export async function fetchPlanByIdApi(id: string): Promise<Plan | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_plans?_id=eq.${id}&select=*,departments(name)`;
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data: PlanResponse[] = await response.json();
    if (!data || data.length === 0) return null;
    
    const plan = mapRowToPlan(data[0]);
    
    // Fetch creator name manually
    if (plan && data[0].created_by) {
      try {
        const userUrl = `${SUPABASE_REST_URL}/users?_id=eq.${data[0].created_by}&select=full_name`;
        const userRes = await fetch(userUrl, { method: 'GET', headers: getHeaders() });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData && userData.length > 0) {
            plan.createdBy = userData[0].full_name;
          }
        }
      } catch (err) {
        console.error('Error fetching user name:', err);
      }
    }
    
    return plan;
  } catch (error) {
    console.error('fetchPlanByIdApi Error:', error);
    throw error;
  }
}

export async function fetchInspectionRoundsApi(planId?: string): Promise<InspectionRound[]> {
  try {
    // FIX: Use _id or id depending on the table schema
    // Campaigns usually use 'id' but let's be careful. PlanId is 'plan_id'.
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


export async function createPlanApi(plan: Partial<Plan>): Promise<Plan | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_plans`;
    
    // Map Frontend Plan to Backend Payload
    const payload = {
      // Required fields
      plan_name: plan.name,
      _id: undefined, // Let DB generate default
      province_id: (plan as any).provinceId || '79', // Default to HCM if missing - CRITICAL constraint
      ward_id: (plan as any).wardId || '26740', // Default to a valid ward if missing - CRITICAL constraint
      
      // Mapped fields
      plan_type: plan.planType,
      plan_status: plan.status || 'draft',
      
      department_id: plan.leadUnit || plan.responsibleUnit,
      created_by: plan.createdById || undefined,
      creator_name: plan.createdBy || 'Người dùng',
      
      priority: plan.priority === 'critical' ? 'urgent' : plan.priority || 'medium', // Map critical to urgent enum
      start_time: plan.startDate,
      end_time: plan.endDate,
      year: plan.startDate ? new Date(plan.startDate).getFullYear().toString() : new Date().getFullYear().toString(),
      quarter: plan.quarter || calculateQuarter(plan.startDate || new Date().toISOString()),
      
      description: plan.topic || '', // Map topic to description
      
      // Defaults/Legacy
      type: 'active',
      status: 1,
      target: '',
      partner: '',
      
      // Keep JSONB for backward compat or extra data
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

export async function updatePlanApi(id: string, updates: Partial<Plan>): Promise<Plan | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_plans?_id=eq.${id}`;
    
    // Map Frontend updates to Backend schema
    const payload: any = {};
    
    if (updates.status) {
      // Map frontend status back to backend status
      const reverseStatusMap: Record<string, string> = {
        'draft': 'draft',
        'pending_approval': 'pending_approval',
        'approved': 'approved',
        'active': 'active',
        'completed': 'completed',
        'paused': 'paused',
        'rejected': 'rejected',
        'cancelled': 'cancelled'
      };
      payload.plan_status = reverseStatusMap[updates.status] || updates.status;
    }
    
    if (updates.name) payload.plan_name = updates.name;
    if (updates.planType) payload.plan_type = updates.planType;
    if (updates.leadUnit || updates.responsibleUnit) payload.department_id = updates.leadUnit || updates.responsibleUnit;
    if (updates.topic) {
      payload.description = updates.topic;
      payload.legal_bases = payload.legal_bases || {};
      payload.legal_bases.topic = updates.topic;
    }
    
    if (updates.startDate) {
      payload.start_time = updates.startDate;
      payload.year = new Date(updates.startDate).getFullYear().toString();
    }
    if (updates.endDate) payload.end_time = updates.endDate;
    if (updates.quarter) payload.quarter = updates.quarter;
    if (updates.priority) {
      payload.priority = updates.priority === 'critical' ? 'urgent' : updates.priority;
    }
    
    // Add other fields as needed
    
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
    
    const data: PlanResponse[] = await response.json();
    if (!data || data.length === 0) return null;
    
    return mapRowToPlan(data[0]);
  } catch (error) {
    console.error('updatePlanApi Error:', error);
    throw error;
  }
}

export async function deletePlanApi(id: string): Promise<boolean> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_plans?_id=eq.${id}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errText}`);
    }
    
    return true;
  } catch (error) {
    console.error('deletePlanApi Error:', error);
    throw error;
  }
}

export async function createInspectionRoundApi(round: Partial<InspectionRound>): Promise<InspectionRound | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_campaigns`;
    
    const payload = {
      campaign_name: round.name,
      plan_id: round.planId || undefined,
      campaign_status: 0, // Draft
      
      department_id: round.leadUnitId || undefined, // You might need to resolve this if only name is passed, or ensure Create provides ID
      owner_dept: round.leadUnit || '',
      
      start_time: round.startDate,
      end_time: round.endDate,
      
      description: round.notes || '',
      priority: 0, // Default medium/low? Need mapping
      
      // Defaults
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
    
    // Map Frontend updates to Backend schema
    const payload: any = {};
    
    if (updates.status) {
       // Map string status to number if needed, or if backend accepts string (it likely takes int now based on recent schema)
       // Let's assume we need to map back to int. 
       // 0: draft, 1: pending, 2: approved, 3: active, 4: completed, 5: paused, 6: cancelled, 7: rejected
       const statusMapReverse: Record<string, number> = {
          'draft': 0,
          'pending_approval': 1,
          'approved': 2,
          'active': 3,
          'completed': 4,
          'paused': 5,
          'cancelled': 6,
          'rejected': 7,
          'in_progress': 3 // Map in_progress to active for now? Or separate?
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
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
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


