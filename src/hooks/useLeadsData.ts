/**
 * MAPPA Portal - React Hook for Leads Data
 * Fetch leads data from Supabase
 */

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

// Supabase credentials
const SUPABASE_URL = `https://${projectId}.supabase.co`;
const SUPABASE_ANON_KEY = publicAnonKey;

interface LeadData {
  id: string;
  code?: string;
  title?: string;
  description?: string;
  status?: string;
  urgency?: string;
  confidence?: string;
  source?: string;
  category?: string;
  created_at?: string;
  [key: string]: any;
}

export function useLeadsData(tenantId?: string) {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        setLoading(true);
        
        // Create Supabase client
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        
        // Build query
        let query = supabase
          .from('leads')
          .select('*, id:_id')
          .order('created_at', { ascending: false })
          .limit(20);
        
        // Add tenant filter if provided
        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) {
          throw new Error(`${fetchError.message} (Code: ${fetchError.code})`);
        }
        
        
        setLeads(data || []);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching leads:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, [tenantId]);

  return { leads, loading, error };
}
