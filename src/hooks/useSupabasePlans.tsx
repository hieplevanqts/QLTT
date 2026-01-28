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

      const data = await fetchPlansApi();
      setPlans(data);
    } catch (err: any) {
      console.error('Error fetching plans:', err);
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