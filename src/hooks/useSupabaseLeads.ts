/**
 * MAPPA Portal - Supabase Leads Hook
 * Hook for fetching and managing leads from Supabase
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../utils/supabaseHelpers';
import type { Lead, LeadStatus } from '../data/lead-risk/types';

// Supabase Lead type (from database)
interface SupabaseLead {
  id: string;
  code: string;
  title: string;
  description: string;
  status: LeadStatus;
  confidence: 'low' | 'medium' | 'high';
  source: string;
  category: string;
  risk_scope: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    ward: string;
    district: string;
    province: string;
  };
  store_name?: string;
  store_address?: string;
  reporter_name?: string;
  reporter_phone?: string;
  assigned_to?: {
    userId: string;
    userName: string;
    teamName?: string;
  };
  sla: {
    deadline: string;
    remainingHours: number;
    isOverdue: boolean;
  };
  reported_at: string;
  created_at: string;
  updated_at: string;
  evidence_count: number;
  related_leads_count: number;
  activity_count: number;
  is_watched: boolean;
  tags?: string[];
}

// Transform Supabase lead to app Lead type
function transformSupabaseLead(dbLead: SupabaseLead): Lead {
  // Provide safe defaults for potentially missing data
  const slaData = dbLead.sla || {
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    remainingHours: 24,
    isOverdue: false,
  };

  const locationData = dbLead.location || {
    lat: 0,
    lng: 0,
    address: '',
    ward: '',
    district: '',
    province: '',
  };

  // Map confidence to urgency (since urgency not in database)
  const mapConfidenceToUrgency = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'high' as const;
      case 'medium': return 'medium' as const;
      case 'low': return 'low' as const;
      default: return 'medium' as const;
    }
  };

  return {
    id: dbLead.id,
    code: dbLead.code,
    title: dbLead.title,
    description: dbLead.description,
    status: dbLead.status,
    urgency: mapConfidenceToUrgency(dbLead.confidence),
    confidence: dbLead.confidence,
    source: dbLead.source || 'app',
    category: dbLead.category,
    riskScope: (dbLead.risk_scope as 'point' | 'store' | 'zone' | 'topic') || 'point',
    location: {
      lat: locationData.lat,
      lng: locationData.lng,
      address: locationData.address,
      ward: locationData.ward,
      district: locationData.district,
      province: locationData.province,
    },
    storeName: dbLead.store_name,
    storeAddress: dbLead.store_address,
    reporterName: dbLead.reporter_name,
    reporterPhone: dbLead.reporter_phone,
    assignedTo: dbLead.assigned_to ? {
      userId: dbLead.assigned_to.userId,
      userName: dbLead.assigned_to.userName,
      teamName: dbLead.assigned_to.teamName || 'Đội QLTT',
    } : undefined,
    sla: {
      deadline: new Date(slaData.deadline),
      remainingHours: slaData.remainingHours,
      isOverdue: slaData.isOverdue,
    },
    reportedAt: new Date(dbLead.reported_at),
    createdBy: 'SYSTEM', // Not in database schema
    createdAt: new Date(dbLead.created_at),
    updatedAt: new Date(dbLead.updated_at),
    evidenceCount: dbLead.evidence_count || 0,
    relatedLeadsCount: dbLead.related_leads_count || 0,
    activityCount: dbLead.activity_count || 0,
    isDuplicate: false, // Not in database schema
    isWatched: dbLead.is_watched || false,
    hasAlert: false, // Not in database schema
  };
}

interface UseSupabaseLeadsOptions {
  statuses?: string[];
  categories?: string[];
  search?: string;
  assignedToMe?: boolean;
  unassigned?: boolean;
  limit?: number;
}

export function useSupabaseLeads(options: UseSupabaseLeadsOptions = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false); // Prevent concurrent fetches

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.statuses?.join(','),
    options.categories?.join(','),
    options.search,
    options.assignedToMe,
    options.unassigned,
    options.limit,
  ]);

  const fetchLeads = async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);


      // Build query
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (options.statuses && options.statuses.length > 0) {
        query = query.in('status', options.statuses);
      }

      if (options.categories && options.categories.length > 0) {
        query = query.in('category', options.categories);
      }

      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%,code.ilike.%${options.search}%`);
      }

      if (options.unassigned) {
        query = query.is('assigned_to', null);
      }

      // Limit
      if (options.limit) {
        query = query.limit(options.limit);
      } else {
        query = query.limit(100); // Default limit
      }

      // Execute query
      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('❌ [useSupabaseLeads] Supabase error:', fetchError);
        throw new Error(`Lỗi khi lấy dữ liệu: ${fetchError.message}`);
      }

      if (!data) {
        setLeads([]);
        return;
      }

      
      // Transform data
      const transformedLeads = data.map(transformSupabaseLead);
      
      // CRITICAL: Deduplicate by lead_code (not just ID)
      // Keep the most recent record if duplicate codes exist
      const uniqueLeadsMap = new Map<string, Lead>();
      transformedLeads.forEach(lead => {
        const existingLead = uniqueLeadsMap.get(lead.code);
        if (!existingLead) {
          // First time seeing this code
          uniqueLeadsMap.set(lead.code, lead);
        } else {
          // Duplicate code found - keep the one with newer created_at
          
          // Keep the newer one (or update if current is newer)
          if (new Date(lead.createdAt) > new Date(existingLead.createdAt)) {
            uniqueLeadsMap.set(lead.code, lead);
          }
          // If existing is newer, keep it (already in map)
        }
      });

      const uniqueLeads = Array.from(uniqueLeadsMap.values());
      
      if (uniqueLeads.length !== transformedLeads.length) {
        console.error('🚨 [useSupabaseLeads] DUPLICATE LEAD_CODES FOUND IN DATABASE!');
        console.error(`   - Total records from DB: ${transformedLeads.length}`);
        console.error(`   - Unique lead_codes: ${uniqueLeads.length}`);
        console.error(`   - Duplicates removed: ${transformedLeads.length - uniqueLeads.length}`);
      }

      
      setLeads(uniqueLeads);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('❌ [useSupabaseLeads] Error fetching leads:', errorMessage);
      setError(errorMessage);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchLeads();
  };

  return {
    leads,
    loading,
    error,
    refetch,
  };
}

// Hook to get lead stats
export function useLeadStats() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inVerification: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    cancelled: 0,
    critical: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all leads (could be optimized with aggregate queries)
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('status, sla');

      if (fetchError) {
        throw new Error(`Lỗi khi lấy thống kê: ${fetchError.message}`);
      }

      if (!data) {
        setStats({
          total: 0,
          new: 0,
          inVerification: 0,
          inProgress: 0,
          resolved: 0,
          rejected: 0,
          cancelled: 0,
          critical: 0,
          overdue: 0,
        });
        return;
      }

      // Calculate stats
      const total = data.length;
      const statusCounts = data.reduce((acc: any, lead: any) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});

      const overdue = data.filter((l: any) => l.sla?.isOverdue === true).length;

      setStats({
        total,
        new: statusCounts.new || 0,
        inVerification: statusCounts.in_verification || 0,
        inProgress: statusCounts.in_progress || 0,
        resolved: statusCounts.resolved || 0,
        rejected: statusCounts.rejected || 0,
        cancelled: statusCounts.cancelled || 0,
        critical: 0, // Not used anymore
        overdue,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('❌ Error fetching stats:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}