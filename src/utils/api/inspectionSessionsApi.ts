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
  // Joins
  users?: { full_name: string } | null;
  merchants?: { business_name: string; address: string } | null;
  map_inspection_campaigns?: { campaign_name: string } | null;
  [key: string]: any;
}

export interface InspectionSession {
  id: string;
  campaignId: string | null;
  campaignName?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'closed' | 'cancelled';
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
    4: 'closed'
  };
  return mapping[status] || 'not_started';
}

function mapRowToSession(row: InspectionSessionResponse): InspectionSession {
  return {
    id: row._id,
    campaignId: row.campaign_id,
    campaignName: row.map_inspection_campaigns?.campaign_name || '--',
    status: mapSessionStatus(row.status),
    startTime: row.start_time,
    endTime: row.end_time,
    name: row.name || row.session_name || '--',
    description: row.description,
    result: row.result,
    resultText: row.result_text || '--',
    merchantId: row.merchant_id,
    merchantName: row.merchants?.business_name || '--',
    merchantAddress: row.merchants?.address || '--',
    type: row.type,
    priority: row.priority || 1,
    deadlineTime: row.deadline_time,
    userId: row.user_id,
    userName: row.users?.full_name || '--',
    departmentId: row.department_id,
    note: row.note,
    createdAt: row.created_at,
  };
}

export async function fetchInspectionSessionsApi(campaignId?: string): Promise<InspectionSession[]> {
  try {
    let url = `${SUPABASE_REST_URL}/map_inspection_sessions?select=*,users(full_name),merchants(business_name,address)&order=created_at.desc`;
    if (campaignId) {
      url += `&campaign_id=eq.${campaignId}`;
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
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updates)
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
