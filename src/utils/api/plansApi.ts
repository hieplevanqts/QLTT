/**
 * Plans API
 * Fetch and manage inspection plans
 */

import { SUPABASE_REST_URL, getHeaders } from './config';
import { type Plan } from '@/types/plans';
import { calculateQuarter } from './sharedUtils';

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
  province_id: string; // UUID not null
  ward_id: string;     // UUID not null
  provinces?: { name: string } | null;
  wards?: { name: string } | null;
  description: string;
  target: string;
  attachments?: any; // JSON field
  created_at: number | string | null; // bigint can come as number or string
  updated_at: number | string | null;
  deleted_at: string | null;
  [key: string]: any;
}

// --- Helpers ---

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

// --- Mappers ---

function mapRowToPlan(row: PlanResponse): Plan | null {
  if (!row) return null;
  
  const id = row._id || row.id || row.plan_id;
  if (!id) return null;

  const appScope = row.application_scope || {};
  const timeframe = row.time_frame || {};
  const legal = row.legal_bases || {};

  const start = row.start_time || timeframe.start_date || timeframe.startDate || new Date().toISOString();
  
  const mapPriority = (p: any): 'low' | 'medium' | 'high' | 'critical' => {
     const val = typeof p === 'string' ? parseInt(p, 10) : p;
     if (val === 4) return 'critical';
     if (val === 3) return 'high';
     if (val === 2) return 'medium';
     if (val === 1) return 'low';
     
     // Fallback for old string data
     if (p === 'urgent' || p === 'critical') return 'critical';
     if (p === 'high') return 'high';
     if (p === 'medium') return 'medium';
     if (p === 'low') return 'low';
     
     return 'medium';
  };

  return {
    id: id,
    code: row.code || "",
    name: row.plan_name || '',
    planType: mapPlanType(row.plan_type),
    quarter: row.quarter || calculateQuarter(start),
    topic: row.description || legal.topic || legal.title || '',
    scope: appScope.scope || appScope.description || '',
    region: appScope.region || '',
    responsibleUnit: row.departments?.name || row.owner_dept || '',
    leadUnit: row.department_id || '',
    provinceId: row.province_id || undefined,
    wardId: row.ward_id || undefined,
    scopeLocation: (() => {
      const wardName = row.wards?.name;
      const provinceName = row.provinces?.name;
      if (wardName && provinceName) return `${wardName} - ${provinceName}`;
      if (wardName) return wardName;
      if (provinceName) return provinceName;
      return appScope.location || appScope.scopeLocation || '';
    })(),
    objectives: legal.objectives || '',
    status: mapPlanStatus(row.plan_status),
    priority: mapPriority(row.priority),
    startDate: start,
    endDate: row.end_time || timeframe.end_date || timeframe.endDate || new Date().toISOString(),
    createdBy: row.users?.full_name || "",
    createdById: row.created_by || undefined,
    createdAt: (() => {
      if (!row.created_at) return new Date().toISOString();
      if (typeof row.created_at === 'number') return new Date(row.created_at).toISOString();
      return row.created_at;
    })(),
    description: row.description || legal.description || '',
    stats: { totalTargets: 0, totalTasks: 0, completedTasks: 0, progress: 0 }
  };
}

// --- API Functions ---

import { store } from '@/store/store';
import { fetchDepartmentById } from '@/utils/api/departmentsApi';

export async function fetchPlansApi(): Promise<Plan[]> {
  try {
    const state = store.getState();
    const user = state.auth.user;
    
    let path = user?.app_metadata?.department?.path || '';

    // Fetch dynamic path from division if department_id exists
    if ((user as any)?.department_id) {
      try {
        const division = await fetchDepartmentById((user as any).department_id);
        if (division) {
          path = division.path;  
        }
      } catch (error) {
        console.error('Error fetching division path:', error);
      }
    }
    
    // Switch to v_plans_by_department and filter by department_path
    // We remove departments(name) embedding as it likely won't work on a view unless manually defined.
    // We assume the view 'v_plans_by_department' contains the necessary department name fields (e.g. owner_dept).
    let url = `${SUPABASE_REST_URL}/v_plans_by_department?select=*&order=created_at.desc`;
    
    if (path) {
      url += `&department_path=like.${path}*`;
    }

    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: PlanResponse[] = await response.json();
    
    // Fetch user names
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
      } catch (err) {}
    }

    // Manual Province/Ward fetch
    const provinceIds = [...new Set(data.map(item => item.province_id).filter(Boolean))];
    const wardIds = [...new Set(data.map(item => item.ward_id).filter(Boolean))];
    const departmentIds = [...new Set(data.map(item => item.department_id).filter(Boolean))];
    
    let provinceMap: Record<string, string> = {};
    let wardMap: Record<string, string> = {};
    let departmentMap: Record<string, string> = {};

    if (provinceIds.length > 0) {
      try {
        const pRes = await fetch(`${SUPABASE_REST_URL}/provinces?_id=in.(${provinceIds.join(',')})&select=_id,name`, { headers: getHeaders() });
        if (pRes.ok) {
          const pData = await pRes.json();
          provinceMap = pData.reduce((acc: any, p: any) => ({ ...acc, [p._id]: p.name }), {});
        }
      } catch (err) {}
    }

    if (wardIds.length > 0) {
      try {
        const wRes = await fetch(`${SUPABASE_REST_URL}/wards?_id=in.(${wardIds.join(',')})&select=_id,name`, { headers: getHeaders() });
        if (wRes.ok) {
          const wData = await wRes.json();
          wardMap = wData.reduce((acc: any, w: any) => ({ ...acc, [w._id]: w.name }), {});
        }
      } catch (err) {}
    }

    if (departmentIds.length > 0) {
      try {
        const dRes = await fetch(`${SUPABASE_REST_URL}/departments?_id=in.(${departmentIds.join(',')})&select=_id,name`, { headers: getHeaders() });
        if (dRes.ok) {
           const dData = await dRes.json();
           departmentMap = dData.reduce((acc: any, d: any) => ({ ...acc, [d._id]: d.name }), {});
        }
      } catch (err) {}
    }

    return data.map(item => {
      const itemWithNames = {
        ...item,
        provinces: item.province_id && provinceMap[item.province_id] ? { name: provinceMap[item.province_id] } : null,
        wards: item.ward_id && wardMap[item.ward_id] ? { name: wardMap[item.ward_id] } : null,
        departments: item.department_id && departmentMap[item.department_id] ? { name: departmentMap[item.department_id] } : null
      };

      const plan = mapRowToPlan(itemWithNames);
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
    
    if (plan && data[0].created_by) {
      try {
        const userRes = await fetch(`${SUPABASE_REST_URL}/users?_id=eq.${data[0].created_by}&select=full_name`, { headers: getHeaders() });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData?.[0]) plan.createdBy = userData[0].full_name;
        }
      } catch (err) {}
    }

    if (plan) {
      if (data[0].province_id && data[0].ward_id) {
         try {
           const [pRes, wRes] = await Promise.all([
             fetch(`${SUPABASE_REST_URL}/provinces?_id=eq.${data[0].province_id}&select=name`, { headers: getHeaders() }),
             fetch(`${SUPABASE_REST_URL}/wards?_id=eq.${data[0].ward_id}&select=name`, { headers: getHeaders() })
           ]);
           if (pRes.ok && wRes.ok) {
             const [pD, wD] = await Promise.all([pRes.json(), wRes.json()]);
             if (pD?.[0] && wD?.[0]) plan.scopeLocation = `${wD[0].name} - ${pD[0].name}`;
           }
         } catch (err) {}
      }
    }
    
    return plan;
  } catch (error) {
    console.error('fetchPlanByIdApi Error:', error);
    throw error;
  }
}

export async function createPlanApi(plan: Partial<Plan>): Promise<Plan | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_plans?select=*`;
    
    const payload = {
      plan_name: plan.name,
      code: plan.code, // Added field to map properly to DB
      province_id: (plan as any).provinceId || '79',
      ward_id: (plan as any).wardId || '26740',
      plan_type: plan.planType,
      plan_status: plan.status || 'draft',
      department_id: plan.leadUnit || plan.responsibleUnit,
      created_by: plan.createdById || undefined,
      creator_name: plan.createdBy || 'Người dùng',
      priority: plan.priority === 'urgent' || plan.priority === 'critical' ? 4 : 
                plan.priority === 'high' ? 3 : 
                plan.priority === 'medium' ? 2 : 1,
      start_time: plan.startDate,
      end_time: plan.endDate,
      year: plan.startDate ? new Date(plan.startDate).getFullYear().toString() : new Date().getFullYear().toString(),
      quarter: plan.quarter || calculateQuarter(plan.startDate || new Date().toISOString()),
      description: plan.topic || '',
      type: 'active',
      status: 1,
      target: '',
      partner: '',
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
      },
      attachments: plan.attachments || []
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
    const payload: any = {};
    
    if (updates.status) {
      const reverseStatusMap: Record<string, string> = {
        'draft': 'draft', 'pending_approval': 'pending_approval', 'approved': 'approved',
        'active': 'active', 'completed': 'completed', 'paused': 'paused',
        'rejected': 'rejected', 'cancelled': 'cancelled'
      };
      payload.plan_status = reverseStatusMap[updates.status] || updates.status;
    }
    
    if (updates.name) payload.plan_name = updates.name;
    if (updates.code) payload.code = updates.code;
    if (updates.planType) payload.plan_type = updates.planType;
    if (updates.leadUnit || updates.responsibleUnit) payload.department_id = updates.leadUnit || updates.responsibleUnit;
    if (updates.topic) {
      payload.description = updates.topic;
      payload.legal_bases = { topic: updates.topic };
    }
    if (updates.startDate) {
      payload.start_time = updates.startDate;
      payload.year = new Date(updates.startDate).getFullYear().toString();
    }
    if (updates.endDate) payload.end_time = updates.endDate;
    if (updates.quarter) payload.quarter = updates.quarter;
    if (updates.priority) {
      payload.priority = updates.priority === 'urgent' || updates.priority === 'critical' ? 4 : 
                        updates.priority === 'high' ? 3 : 
                        updates.priority === 'medium' ? 2 : 1;
    }
    if (updates.attachments) payload.attachments = updates.attachments;
    
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
    const response = await fetch(url, { method: 'DELETE', headers: getHeaders() });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return true;
  } catch (error) {
    console.error('deletePlanApi Error:', error);
    throw error;
  }
}
