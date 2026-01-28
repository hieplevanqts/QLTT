/**
 * MAPPA Portal - Supabase Leads Hook
 * Hook for fetching and managing leads from Supabase
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/utils/supabaseHelpers';
import type { Lead, LeadStatus } from '@/data/lead-risk/types';

// Supabase Lead type (from database) - Make flexible to handle actual schema
interface SupabaseLead {
  _id?: string; // May be _id in some tables
  id?: string;  // May be id in some tables
  code: string;
  title: string;
  description: string;
  status: LeadStatus;
  urgency?: string; // May not exist in DB
  confidence?: 'low' | 'medium' | 'high'; // May not exist in DB
  source: string;
  category: string;
  risk_scope: string;
  location: any; // JSONB - flexible
  store_name?: string;
  store_address?: string;
  reporter_name?: string;
  reporter_phone?: string;
  assigned_to?: any; // JSONB - flexible
  sla: any; // JSONB - flexible
  reported_at: string;
  created_at: string;
  updated_at: string;
  evidence_count?: number;
  related_leads_count?: number;
  activity_count?: number;
  is_watched?: boolean;
  tags?: string[];
}

// Transform Supabase lead to app Lead type
function transformSupabaseLead(dbLead: SupabaseLead): Lead {
  // CRITICAL: Ensure id is never null
  if (!dbLead._id && !dbLead.id) {
    console.error('🚨 [transformSupabaseLead] Lead has NULL id! Using code as fallback:', dbLead.code);
  }
  
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
    _id: dbLead._id || dbLead.id || `temp-${dbLead.code}`, // Map to _id to match Lead interface
    code: dbLead.code,
    title: dbLead.title,
    description: dbLead.description,
    status: dbLead.status,
    urgency: dbLead.urgency || mapConfidenceToUrgency(dbLead.confidence || 'medium'),
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
      remainingHours: typeof slaData.remainingHours === 'number' && !isNaN(slaData.remainingHours) ? slaData.remainingHours : 24,
      isOverdue: slaData.isOverdue || false,
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
      console.log('⏭️ [useSupabaseLeads] Skipping fetch - already in progress');
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      console.log('🔍 [useSupabaseLeads] Fetching leads from Supabase...');
      console.log('📋 [useSupabaseLeads] Options:', options);
      console.log('🕐 [useSupabaseLeads] Timestamp:', new Date().toISOString());

      // Build query - Use SELECT * to get all columns (let Supabase handle column names)
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (options.statuses && options.statuses.length > 0) {
        console.log('🎯 [useSupabaseLeads] Filtering by statuses:', options.statuses);
        query = query.in('status', options.statuses);
      }

      if (options.categories && options.categories.length > 0) {
        console.log('🎯 [useSupabaseLeads] Filtering by categories:', options.categories);
        query = query.in('category', options.categories);
      }

      if (options.search) {
        console.log('🔎 [useSupabaseLeads] Searching for:', options.search);
        query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%,code.ilike.%${options.search}%`);
      }

      // NOTE: Assignment filtering is done CLIENT-SIDE in LeadInbox component
      // because assigned_to column might not exist in all database instances
      // Removing this to prevent "column does not exist" errors
      // if (options.unassigned) {
      //   console.log('👤 [useSupabaseLeads] Filtering unassigned');
      //   query = query.is('assigned_to', null);
      // }

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
        console.warn('⚠️ [useSupabaseLeads] No data returned');
        setLeads([]);
        return;
      }

      console.log(`✅ [useSupabaseLeads] Fetched ${data.length} leads from Supabase`);
      console.log(`📊 [useSupabaseLeads] First lead (RAW):`, JSON.stringify(data[0], null, 2));
      console.log(`📊 [useSupabaseLeads] Available columns in first lead:`, data[0] ? Object.keys(data[0]) : []);
      
      // Check for null IDs BEFORE transformation
      const nullIdCount = data.filter(l => !l._id && !l.id).length;
      if (nullIdCount > 0) {
        console.error(`🚨 [useSupabaseLeads] Found ${nullIdCount} leads with NULL _id in database!`);
        console.error('🚨 [useSupabaseLeads] Sample null ID records:', data.filter(l => !l._id && !l.id).slice(0, 3));
      }
      
      // Transform data
      const transformedLeads = data.map(transformSupabaseLead);
      console.log('🔄 [useSupabaseLeads] Transformed', transformedLeads.length, 'leads');
      console.log('📊 [useSupabaseLeads] First 3 transformed lead _ids:', transformedLeads.slice(0, 3).map(l => l._id));
      
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
          // Silent deduplication - UI banner will show warning in LeadInbox
          if (new Date(lead.createdAt) > new Date(existingLead.createdAt)) {
            uniqueLeadsMap.set(lead.code, lead);
          }
        }
      });

      const uniqueLeads = Array.from(uniqueLeadsMap.values());
      
      // Silent deduplication - UI will show warning banner if needed
      console.log('✅ [useSupabaseLeads] Final unique leads count:', uniqueLeads.length);
      
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
        inVerification: (statusCounts.verifying || 0) + (statusCounts.in_verification || 0), // Support both DB and UI format
        inProgress: (statusCounts.processing || 0) + (statusCounts.in_progress || 0), // Support both DB and UI format
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

// Hook to get a single lead by ID
export function useSupabaseLead(leadId: string | undefined) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wasAutoUpdated, setWasAutoUpdated] = useState(false);

  useEffect(() => {
    if (!leadId) {
      setLoading(false);
      setLead(null);
      return;
    }

    fetchLead();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  const fetchLead = async () => {
    if (!leadId) return;
    
    setLoading(true);
    setError(null);
    setWasAutoUpdated(false);

    try {
      console.log('🔍 [useSupabaseLead] Fetching lead by ID:', leadId);
      
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('_id', leadId) // CRITICAL: Use _id not id
        .single();

      if (fetchError) {
        console.error('❌ [useSupabaseLead] Supabase error:', fetchError);
        throw new Error(`Lỗi khi lấy lead: ${fetchError.message}`);
      }

      if (!data) {
        console.warn('⚠️ [useSupabaseLead] Lead not found');
        setLead(null);
        return;
      }

      console.log('✅ [useSupabaseLead] Received lead:', data);
      const transformedLead = transformSupabaseLead(data);
      
      // ❌ REMOVED AUTO-UPDATE: Không tự động chuyển status khi xem chi tiết
      // User chỉ muốn XEM, không muốn thay đổi trạng thái
      // Status sẽ được update thông qua các action button trong UI
      setLead(transformedLead);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('❌ [useSupabaseLead] Error fetching lead:', errorMessage);
      setError(errorMessage);
      setLead(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchLead();
  };

  return {
    lead,
    loading,
    error,
    refetch,
    wasAutoUpdated, // Return flag để component có thể hiển thị notification
  };
}