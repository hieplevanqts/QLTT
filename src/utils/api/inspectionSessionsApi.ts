import { SUPABASE_REST_URL, getHeaders } from './config';

export interface InspectionSessionResponse {
  _id: string;
  campaign_id: string | null;
  status: number;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
  updated_at: string;
  session_name: string | null;
  description: string | null;
  result: number | null;
  reopen_reason: string | null;
  merchant_id: string | null;
  type: 'proactive' | 'passive';
  name: string;
  priority: number | null;
  deadline_time: string;
  user_id: string | null;
  department_id: string | null;
  note: string;
  result_text: string | null;
  // Joins - Supabase might return these as object or array of objects depending on relationship config
  users?: { full_name: string } | { full_name: string }[] | null;
  merchants?: { business_name: string; address: string } | { business_name: string; address: string }[] | null;
  map_inspection_campaigns?: { campaign_name: string } | { campaign_name: string }[] | null;
  [key: string]: any;
}

export interface InspectionSession {
  id: string;
  campaignId: string | null;
  campaignName?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'closed' | 'cancelled' | 'reopened';
  startTime: string | null;
  endTime: string | null;
  name: string;
  description: string | null;
  result: number | null;
  resultText: string | null;
  merchantId: string | null;
  merchantName: string;
  merchantAddress: string;
  type: 'proactive' | 'passive';
  priority: number;
  deadlineTime: string;
  userId: string | null;
  userName: string;
  departmentId: string | null;
  note: string;
  createdAt: string;
}

function mapSessionStatus(status: number): InspectionSession['status'] {
  const mapping: Record<number, InspectionSession['status']> = {
    1: 'not_started',
    2: 'in_progress',
    3: 'completed',
    4: 'closed',
    5: 'reopened',
    6: 'cancelled'
  };
  return mapping[status] || 'not_started';
}

function mapPriority(p: any): number {
  if (typeof p === 'number') return p;
  const map: Record<string, number> = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'urgent': 4,
    'critical': 4
  };
  return map[String(p).toLowerCase()] || 2;
}

function mapRowToSession(row: InspectionSessionResponse): InspectionSession {
  // Helper to safely get first item or object
  const getJoinedData = (data: any) => Array.isArray(data) ? data[0] : data;

  const campaign = getJoinedData(row.map_inspection_campaigns);
  const user = getJoinedData(row.users);
  const merchant = getJoinedData(row.merchants);

  return {
    id: row._id,
    campaignId: row.campaign_id,
    campaignName: campaign?.campaign_name || '--',
    status: mapSessionStatus(row.status),
    startTime: row.start_time,
    endTime: row.end_time,
    name: row.name || row.session_name || '--',
    description: row.description,
    result: row.result,
    resultText: row.result_text || '--',
    merchantId: row.merchant_id,
    merchantName: merchant?.business_name || '--',
    merchantAddress: merchant?.address || '--',
    type: row.type,
    priority: row.priority || 2,
    deadlineTime: row.deadline_time,
    userId: row.user_id,
    userName: user?.full_name || '--',
    departmentId: row.department_id,
    note: row.note,
    createdAt: row.created_at,
  };
}

import { store } from '@/store/store';

export async function fetchInspectionSessionsApi(campaignId?: string): Promise<InspectionSession[]> {
  try {
    const state = store.getState();
    const path = state.auth.user?.app_metadata?.department?.path || '';

    let url = `${SUPABASE_REST_URL}/v_sessions_by_department?select=*,users(full_name),merchants!fk_inspection_merchant(business_name,address),map_inspection_campaigns(campaign_name)&order=created_at.desc`;
    if (campaignId) {
      url += `&campaign_id=eq.${campaignId}`;
    }
    
    if (path) {
      url += `&department_path=like.${path}*`;
    }
    
    const response = await fetch(url, { method: 'GET', headers: getHeaders() });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data: InspectionSessionResponse[] = await response.json();
    return data.map(mapRowToSession);
  } catch (error) {
    console.error('fetchInspectionSessionsApi Error:', error);
    throw error;
  }
}

export async function updateInspectionSessionApi(id: string, updates: Partial<InspectionSessionResponse>): Promise<InspectionSession | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_sessions?_id=eq.${id}`;
    
    const payload = { ...updates };
    if (payload.priority) {
      payload.priority = mapPriority(payload.priority);
    }

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
    
    const data: InspectionSessionResponse[] = await response.json();
    if (!data || data.length === 0) return null;
    
    return mapRowToSession(data[0]);
  } catch (error) {
    console.error('updateInspectionSessionApi Error:', error);
    throw error;
  }
}

export async function createInspectionSessionApi(session: Partial<InspectionSessionResponse>): Promise<InspectionSession | null> {
  try {
    const url = `${SUPABASE_REST_URL}/map_inspection_sessions`;
    
    const payload = {
      ...session,
      status: session.status || 1, // Default to 'not_started'
      priority: mapPriority(session.priority || 'medium'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
    
    const data: InspectionSessionResponse[] = await response.json();
    if (!data || data.length === 0) return null;
    
    return mapRowToSession(data[0]);
  } catch (error) {
    console.error('createInspectionSessionApi Error:', error);
    throw error;
  }
}
