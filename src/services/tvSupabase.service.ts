import { supabase } from '@/lib/supabase';
import { projectId } from '@/utils/supabase/info';
import type { TvFilters } from '@/types/tv.types';
import type { Evidence, Hotspot, Lead, Task } from '@/services/tvMockData';

const SUPABASE_URL = `https://${projectId}.supabase.co`;

const buildPublicAssetUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalized = path.replace(/^public\//, '');
  return `${SUPABASE_URL}/storage/v1/object/public/${normalized}`;
};

const toRiskScore = (score?: number | null) => {
  if (typeof score !== 'number') return 0;
  return Math.max(0, Math.min(100, Math.round(score * 10)));
};

const mapComplaintStatus = (status?: number | null) => {
  if (status === 1) return 'Mới' as const;
  if (status === 2) return 'Đang xử lý' as const;
  return 'Đã xác minh' as const;
};

const mapPriority = (severity?: string | null) => {
  const value = (severity || '').toLowerCase();
  if (value.includes('p1') || value.includes('cao') || value.includes('high')) return 'P1' as const;
  if (value.includes('p2') || value.includes('trung') || value.includes('medium')) return 'P2' as const;
  return 'P3' as const;
};

const mapTaskStatus = (isOverdue: boolean, status?: string | null) => {
  if (isOverdue) return 'Quá hạn' as const;
  if (!status) return 'Đang xử lý' as const;
  return status as Task['status'];
};

const applyLocationFilter = <T>(query: any, filters: TvFilters, provinceField: string, wardField: string) => {
  if (filters.ward) {
    return query.eq(wardField, filters.ward);
  }
  if (filters.province) {
    return query.eq(provinceField, filters.province);
  }
  return query;
};

const applyTopicFilter = (query: any, filters: TvFilters, topicField: string) => {
  if (filters.topic) {
    return query.eq(topicField, filters.topic);
  }
  return query;
};

export async function fetchTvTopics(): Promise<string[]> {
  const { data, error } = await supabase
    .from('violationCategory')
    .select('name')
    .eq('isActive', true)
    .order('name', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map(row => row.name).filter(Boolean);
}

export async function fetchTvData(filters: TvFilters) {
  const since = new Date(Date.now() - filters.timeRangeDays * 24 * 60 * 60 * 1000).toISOString();

  let complaintsQuery = supabase
    .from('tv_complaints_enriched')
    .select('*')
    .gte('created_at', since)
    .order('created_at', { ascending: false });
  complaintsQuery = applyLocationFilter(complaintsQuery, filters, 'province_name', 'ward_name');
  complaintsQuery = applyTopicFilter(complaintsQuery, filters, 'category_name');

  let hotspotQuery = supabase
    .from('tv_hotspots')
    .select('*')
    .order('last_complaint_at', { ascending: false });
  hotspotQuery = applyLocationFilter(hotspotQuery, filters, 'province', 'ward');
  hotspotQuery = applyTopicFilter(hotspotQuery, filters, 'category_name');

  let tasksQuery = supabase
    .from('tv_risk_cases')
    .select('*')
    .order('created_at', { ascending: false });
  tasksQuery = applyLocationFilter(tasksQuery, filters, 'province', 'ward');
  tasksQuery = applyTopicFilter(tasksQuery, filters, 'category');

  let evidencesQuery = supabase
    .from('tv_evidence_reviews')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  evidencesQuery = applyLocationFilter(evidencesQuery, filters, 'province', 'ward');

  const [
    complaintsResult,
    hotspotsResult,
    tasksResult,
    evidencesResult,
  ] = await Promise.all([
    complaintsQuery,
    hotspotQuery,
    tasksQuery,
    evidencesQuery,
  ]);

  if (complaintsResult.error) throw complaintsResult.error;
  if (hotspotsResult.error) throw hotspotsResult.error;
  if (tasksResult.error) throw tasksResult.error;
  if (evidencesResult.error) throw evidencesResult.error;

  const leads: Lead[] = (complaintsResult.data || []).map((row: any) => {
    const images = Array.isArray(row.images) ? row.images.map(buildPublicAssetUrl).filter(Boolean) : [];
    return {
      id: row.complaint_id,
      title: row.category_name || row.map_point_title || 'Phản ánh',
      created_at: row.created_at,
      dia_ban: {
        id: row.ward_id || row.province_id || row.complaint_id,
        province: row.province_name || 'N/A',
        district: '',
        ward: row.ward_name || '',
        lat: Number(row.lat) || 0,
        lng: Number(row.lng) || 0,
      },
      chuyen_de: row.category_name || 'Khác',
      lat: Number(row.lat) || 0,
      lng: Number(row.lng) || 0,
      status: mapComplaintStatus(row.status),
      risk_score: toRiskScore(row.avg_score),
      images,
    };
  });

  const hotspots: Hotspot[] = (hotspotsResult.data || []).map((row: any) => ({
    id: row.map_point_id || row.id,
    title: row.title || row.map_point_title || 'Điểm nóng',
    created_at: row.last_complaint_at || new Date().toISOString(),
    dia_ban: {
      id: row.ward_id || row.province_id || row.map_point_id,
      province: row.province || 'N/A',
      district: '',
      ward: row.ward || '',
      lat: Number(row.lat) || 0,
      lng: Number(row.lng) || 0,
    },
    chuyen_de: row.category_name || 'Khác',
    lat: Number(row.lat) || 0,
    lng: Number(row.lng) || 0,
    severity: row.severity || 'P3',
    risk_score: toRiskScore(row.avg_score),
  }));

  const tasks: Task[] = (tasksResult.data || []).map((row: any) => ({
    id: row.id,
    title: row.title || 'Nhiệm vụ',
    created_at: row.created_at || new Date().toISOString(),
    due_date: row.due_at || row.created_at || new Date().toISOString(),
    dia_ban: {
      id: row.ward_id || row.province_id || row.id,
      province: row.province || 'N/A',
      district: '',
      ward: row.ward || '',
      lat: Number(row.lat) || 0,
      lng: Number(row.lng) || 0,
    },
    chuyen_de: row.category || row.severity || 'Khác',
    lat: Number(row.lat) || 0,
    lng: Number(row.lng) || 0,
    priority: row.priority || mapPriority(row.severity),
    status: mapTaskStatus(!!row.is_overdue, row.status),
    is_overdue: !!row.is_overdue,
  }));

  const evidences: Evidence[] = (evidencesResult.data || []).map((row: any) => ({
    id: row.evidence_id || row.review_id,
    title: row.file_name || row.evidence_id || 'Chứng cứ',
    created_at: row.created_at || new Date().toISOString(),
    dia_ban: {
      id: row.ward_id || row.province_id || row.evidence_id,
      province: row.province || 'N/A',
      district: '',
      ward: row.ward || '',
      lat: Number(row.lat) || 0,
      lng: Number(row.lng) || 0,
    },
    chuyen_de: 'Chứng cứ',
    lat: Number(row.lat) || 0,
    lng: Number(row.lng) || 0,
    status: row.status === 'pending' ? 'Chờ duyệt' : row.status === 'approved' ? 'Đã duyệt' : 'Từ chối',
    image_url: buildPublicAssetUrl(row.file_url),
    type: row.file_type && row.file_type.toLowerCase().includes('video') ? 'video' : 'image',
  }));

  return {
    hotspots,
    leads,
    tasks,
    evidences,
  };
}
