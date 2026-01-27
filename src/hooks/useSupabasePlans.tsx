import { useState, useEffect, useMemo } from 'react';
import { type Plan } from '@/app/types/plans';
import { fetchPlansApi, fetchPlanByIdApi } from '@/utils/api/plansApi';

interface UseSupabasePlansReturn {
  plans: Plan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseSupabasePlanReturn {
  plan: Plan | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSupabasePlan(id: string | undefined): UseSupabasePlanReturn {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchPlanByIdApi(id);
      setPlan(data);
    } catch (err: any) {
      console.error('Error fetching plan from API:', err);
      setError(err.message || 'Không thể tải thông tin kế hoạch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [id]);

  return {
    plan,
    loading,
    error,
    refetch: fetchPlan,
  };
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
        .select('*, id:_id')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Map Supabase data to Plan interface
      const mappedPlans: Plan[] = (Array.isArray(data) ? data : []).map((row: any) => {
        if (!row || typeof row !== 'object') {
          // Skip invalid rows
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
      console.error('Error fetching plans from API:', err);
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