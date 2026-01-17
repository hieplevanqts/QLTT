import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { type Plan } from '@/app/data/kehoach-mock-data';

interface UseSupabasePlansReturn {
  plans: Plan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSupabasePlans(): UseSupabasePlansReturn {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure plans is always an array (memoized to avoid recalculation)
  const safePlans = useMemo(() => {
    return Array.isArray(plans) ? plans : [];
  }, [plans]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('map_inspection_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Map Supabase data to Plan interface
      const mappedPlans: Plan[] = (Array.isArray(data) ? data : []).map((row: any) => {
        if (!row || typeof row !== 'object') {
          // Skip invalid rows
          console.warn('Invalid row data:', row);
          return null;
        }
        
        // Parse JSONB fields - ensure they are objects
        const applicationScope = (row.application_scope && typeof row.application_scope === 'object') ? row.application_scope : {};
        const timeFrame = (row.time_frame && typeof row.time_frame === 'object') ? row.time_frame : {};
        const legalBases = (row.legal_bases && typeof row.legal_bases === 'object') ? row.legal_bases : {};

        // Extract dates from time_frame JSONB
        const startDate = timeFrame.start_date || timeFrame.startDate || new Date().toISOString();
        const endDate = timeFrame.end_date || timeFrame.endDate || new Date().toISOString();
        
        // Calculate quarter from start date
        const quarter = calculateQuarter(startDate);

        // Extract scope information
        const scopeLocation = applicationScope.location || applicationScope.scopeLocation || '';
        const scope = applicationScope.scope || applicationScope.description || '';

        // Extract topic from legal bases or use plan name
        const topic = legalBases.topic || legalBases.title || '';

        return {
          id: row.id,
          code: row.id, // Using id as code since there's no separate code field
          name: row.plan_name || 'Chưa có tên',
          planType: mapPlanType(row.plan_type),
          quarter: quarter,
          topic: topic,
          scope: scope,
          scopeLocation: scopeLocation,
          responsibleUnit: row.owner_dept || 'Chưa xác định',
          region: applicationScope.region || '',
          leadUnit: row.owner_dept || '',
          objectives: legalBases.objectives || '',
          status: mapStatus(row.plan_status),
          priority: 'medium' as const, // Default priority since not in DB
          startDate: startDate,
          endDate: endDate,
          createdBy: row.creator_name || row.created_by || 'Hệ thống',
          createdAt: convertTimestamp(row.created_at || row.created_time),
          // Additional metadata
          description: legalBases.description || '',
          // Stats - default values since not in DB
          stats: {
            totalTargets: 0,
            totalTasks: 0,
            completedTasks: 0,
            progress: 0,
          },
        };
      }).filter((plan): plan is Plan => plan !== null); // Filter out null values

      setPlans(mappedPlans);
    } catch (err: any) {
      console.error('Error fetching plans from Supabase:', err);
      setError(err.message || 'Không thể tải danh sách kế hoạch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans: safePlans,
    loading,
    error,
    refetch: fetchPlans,
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

// Helper function to calculate quarter from date
function calculateQuarter(dateString: string): string {
  try {
    const date = new Date(dateString);
    const month = date.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    const year = date.getFullYear();
    return `Q${quarter}/${year}`;
  } catch {
    return 'Q1/2024';
  }
}

// Helper functions to map Supabase values to Plan interface
function mapPlanType(type: string | null): 'periodic' | 'thematic' | 'urgent' {
  const typeMap: Record<string, 'periodic' | 'thematic' | 'urgent'> = {
    'periodic': 'periodic',
    'dinh_ky': 'periodic',
    'định_kỳ': 'periodic',
    'thematic': 'thematic',
    'chuyen_de': 'thematic',
    'chuyên_đề': 'thematic',
    'urgent': 'urgent',
    'dot_xuat': 'urgent',
    'đột_xuất': 'urgent',
  };
  return typeMap[type?.toLowerCase()?.replace(/\s/g, '_') || ''] || 'periodic';
}

function mapPriority(priority: string | null): 'low' | 'medium' | 'high' | 'critical' {
  const priorityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    'low': 'low',
    'thap': 'low',
    'thấp': 'low',
    'medium': 'medium',
    'trung_binh': 'medium',
    'trung_bình': 'medium',
    'high': 'high',
    'cao': 'high',
    'critical': 'critical',
    'khan_cap': 'critical',
    'khẩn_cấp': 'critical',
  };
  return priorityMap[priority?.toLowerCase()?.replace(/\s/g, '_') || ''] || 'medium';
}

function mapStatus(status: string | null): Plan['status'] {
  const statusMap: Record<string, Plan['status']> = {
    'draft': 'draft',
    'nhap': 'draft',
    'nháp': 'draft',
    'pending_approval': 'pending_approval',
    'cho_duyet': 'pending_approval',
    'chờ_duyệt': 'pending_approval',
    'cho_phe_duyet': 'pending_approval',
    'approved': 'approved',
    'da_duyet': 'approved',
    'đã_duyệt': 'approved',
    'da_phe_duyet': 'approved',
    'đã_phê_duyệt': 'approved',
    'active': 'active',
    'dang_thuc_hien': 'active',
    'đang_thực_hiện': 'active',
    'completed': 'completed',
    'hoan_thanh': 'completed',
    'hoàn_thành': 'completed',
    'paused': 'paused',
    'tam_dung': 'paused',
    'tạm_dừng': 'paused',
    'rejected': 'rejected',
    'tu_choi': 'rejected',
    'từ_chối': 'rejected',
    'da_tu_choi': 'rejected',
    'đã_từ_chối': 'rejected',
    'cancelled': 'cancelled',
    'huy': 'cancelled',
    'hủy': 'cancelled',
    'da_huy': 'cancelled',
    'đã_hủy': 'cancelled',
  };
  return statusMap[status?.toLowerCase()?.replace(/\s/g, '_') || ''] || 'draft';
}