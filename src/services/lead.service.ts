/**
 * MAPPA Portal - Lead Service Layer
 * Updated to match /docs/leads-table-schema.sql (31 columns)
 * Complete CRUD API for Leads table
 */

import { getSupabase } from './supabase.service';
import type { PaginatedResponse, BaseFilter } from '@/types/core.types';

// ============================================================================
// LEAD DATABASE SCHEMA (matches PostgreSQL schema exactly)
// ============================================================================

export interface LeadDB {
  // Identity & Code (3 columns)
  id: string; // UUID
  tenant_id: string; // UUID
  code: string; // LEAD-2025-0001

  // Basic Info (2 columns)
  title: string;
  description: string;

  // Classification (6 columns)
  status: 'new' | 'in_verification' | 'in_progress' | 'resolved' | 'rejected' | 'cancelled';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  confidence: 'low' | 'medium' | 'high';
  source: 'app' | 'hotline' | 'import' | 'field' | 'tip' | 'system' | 'social';
  category: 'counterfeit' | 'smuggling' | 'illegal_trading' | 'food_safety' | 'price_fraud' | 'unlicensed' | 'other';
  risk_scope: 'point' | 'store' | 'zone' | 'topic';

  // Location (1 JSONB column)
  location: {
    lat: number;
    lng: number;
    address: string;
    ward?: string;
    district?: string;
    province: string;
  };

  // Store Info (4 columns - optional)
  store_id?: string | null;
  store_name?: string | null;
  store_address?: string | null;
  store_type?: string | null;

  // Reporter Info (3 columns - optional)
  reporter_name?: string | null;
  reporter_phone?: string | null;
  reporter_email?: string | null;

  // Assignment (2 columns - JSONB)
  assigned_to?: {
    userId: string;
    userName: string;
    teamName: string;
  } | null;
  assigned_at?: string | null; // TIMESTAMPTZ

  // SLA (1 JSONB column - auto-calculated by trigger)
  sla: {
    deadline: string; // ISO timestamp
    remainingHours: number;
    isOverdue: boolean;
  };

  // Timestamps (7 columns)
  reported_at: string; // TIMESTAMPTZ
  created_by: string; // UUID
  created_at: string; // TIMESTAMPTZ
  updated_at: string; // TIMESTAMPTZ
  deleted_at?: string | null; // TIMESTAMPTZ (soft delete)
  resolved_at?: string | null; // TIMESTAMPTZ
  closed_at?: string | null; // TIMESTAMPTZ

  // Counters (3 columns - denormalized)
  evidence_count: number;
  related_leads_count: number;
  activity_count: number;

  // Flags (3 columns)
  is_duplicate: boolean;
  is_watched: boolean;
  has_alert: boolean;

  // Resolution (3 columns - optional)
  resolution_type?: string | null;
  resolution_details?: string | null;
  penalty_amount?: number | null; // DECIMAL(19,4)

  // Tags (1 column)
  tags?: string[]; // TEXT[]
}

// ============================================================================
// LEAD CREATE INPUT (for INSERT operations)
// ============================================================================

export interface LeadCreateInput {
  tenant_id: string;
  code: string;
  title: string;
  description: string;
  status?: 'new' | 'in_verification' | 'in_progress' | 'resolved' | 'rejected' | 'cancelled';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  confidence: 'low' | 'medium' | 'high';
  source: 'app' | 'hotline' | 'import' | 'field' | 'tip' | 'system' | 'social';
  category: 'counterfeit' | 'smuggling' | 'illegal_trading' | 'food_safety' | 'price_fraud' | 'unlicensed' | 'other';
  risk_scope: 'point' | 'store' | 'zone' | 'topic';
  location: {
    lat: number;
    lng: number;
    address: string;
    ward?: string;
    district?: string;
    province: string;
  };
  sla: {
    deadline: string;
    remainingHours?: number;
    isOverdue?: boolean;
  };
  created_by: string;
  
  // Optional fields
  store_id?: string;
  store_name?: string;
  store_address?: string;
  store_type?: string;
  reporter_name?: string;
  reporter_phone?: string;
  reporter_email?: string;
  reported_at?: string;
  tags?: string[];
}

// ============================================================================
// LEAD UPDATE INPUT
// ============================================================================

export interface LeadUpdateInput {
  title?: string;
  description?: string;
  status?: 'new' | 'in_verification' | 'in_progress' | 'resolved' | 'rejected' | 'cancelled';
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  confidence?: 'low' | 'medium' | 'high';
  category?: string;
  assigned_to?: {
    userId: string;
    userName: string;
    teamName: string;
  } | null;
  is_watched?: boolean;
  has_alert?: boolean;
  resolution_type?: string;
  resolution_details?: string;
  penalty_amount?: number;
  tags?: string[];
}

// ============================================================================
// LEAD ACTIVITY SCHEMA
// ============================================================================

export interface LeadActivityDB {
  _id: string; // UUID v7
  lead_id: string;
  type: 'status_change' | 'assignment' | 'note' | 'verification' | 'escalation';
  action: string;
  old_value?: string | null;
  new_value?: string | null;
  note?: string | null;
  created_by: string;
  created_at: string;
}

// ============================================================================
// LEAD EVIDENCE SCHEMA
// ============================================================================

export interface LeadEvidenceDB {
  _id: string; // UUID v7
  lead_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  description?: string | null;
  uploaded_by: string;
  uploaded_at: string;
}

// ============================================================================
// LEAD SERVICE
// ============================================================================

export interface LeadFilter extends BaseFilter {
  status?: string[];
  urgency?: string[];
  confidence?: string[];
  source?: string[];
  category?: string[];
  risk_scope?: string[];
  assigned_to?: string;
  province?: string[];
  date_from?: string;
  date_to?: string;
  is_overdue?: boolean;
  is_watched?: boolean;
}

export const LeadService = {
  /**
   * Get lead by code
   * Equivalent to KV: kv.get('lead:{code}')
   */
  async getByCode(code: string, tenantId: string): Promise<LeadDB | null> {
    const { data, error } = await getSupabase()
      .from('leads')
      .select('*')
      .eq('code', code)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching lead:', error);
      return null;
    }
    return data;
  },

  /**
   * Get lead by ID
   */
  async getById(id: string, tenantId: string): Promise<LeadDB | null> {
    const { data, error } = await getSupabase()
      .from('leads')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching lead:', error);
      return null;
    }
    return data;
  },

  /**
   * List leads with filters
   * Equivalent to KV: kv.getByPrefix('lead:list:')
   */
  async list(tenantId: string, filter?: LeadFilter): Promise<PaginatedResponse<LeadDB>> {
    let query = getSupabase()
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .is('deleted_at', null);

    // Apply filters
    if (filter?.status && filter.status.length > 0) {
      query = query.in('status', filter.status);
    }

    if (filter?.urgency && filter.urgency.length > 0) {
      query = query.in('urgency', filter.urgency);
    }

    if (filter?.confidence && filter.confidence.length > 0) {
      query = query.in('confidence', filter.confidence);
    }

    if (filter?.source && filter.source.length > 0) {
      query = query.in('source', filter.source);
    }

    if (filter?.category && filter.category.length > 0) {
      query = query.in('category', filter.category);
    }

    if (filter?.assigned_to) {
      query = query.contains('assigned_to', { userId: filter.assigned_to });
    }

    if (filter?.province && filter.province.length > 0) {
      query = query.in('location->>province', filter.province);
    }

    if (filter?.date_from) {
      query = query.gte('created_at', filter.date_from);
    }

    if (filter?.date_to) {
      query = query.lte('created_at', filter.date_to);
    }

    if (filter?.is_overdue !== undefined) {
      query = query.eq('sla->>isOverdue', filter.is_overdue);
    }

    if (filter?.is_watched !== undefined) {
      query = query.eq('is_watched', filter.is_watched);
    }

    // Search
    if (filter?.search) {
      query = query.or(`title.ilike.%${filter.search}%,code.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
    }

    // Pagination
    const page = filter?.page || 1;
    const pageSize = filter?.page_size || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Sort
    const sortBy = filter?.sort_by || 'created_at';
    const sortOrder = filter?.sort_order || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error, count } = await query;
    if (error) {
      console.error('Error listing leads:', error);
      return {
        items: [],
        total: 0,
        page,
        page_size: pageSize,
        total_pages: 0,
      };
    }

    return {
      items: data || [],
      total: count || 0,
      page,
      page_size: pageSize,
      total_pages: Math.ceil((count || 0) / pageSize),
    };
  },

  /**
   * Get inbox leads (unassigned)
   * Equivalent to KV: kv.getByPrefix('lead:inbox:unassigned')
   */
  async getInbox(tenantId: string): Promise<LeadDB[]> {
    const { data, error } = await getSupabase()
      .from('leads')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('assigned_to', null)
      .in('status', ['new', 'triaged', 'pendingInfo'])
      .is('deleted_at', null)
      .order('urgency', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching inbox:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Get watchlist
   * Equivalent to KV: kv.getByPrefix('lead:watchlist:{user_id}')
   */
  async getWatchlist(tenantId: string, userId: string): Promise<LeadDB[]> {
    const { data, error } = await getSupabase()
      .from('leads')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_watched', true)
      .contains('assigned_to', { userId: userId })
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Get leads assigned to user
   * Equivalent to KV: kv.getByPrefix('lead:list:assigned:{user_id}')
   */
  async getByAssignee(tenantId: string, userId: string, filter?: LeadFilter): Promise<PaginatedResponse<LeadDB>> {
    return this.list(tenantId, {
      ...filter,
      assigned_to: userId,
    });
  },

  /**
   * Get leads by store
   * Equivalent to KV: kv.getByPrefix('lead:list:store:{store_id}')
   */
  async getByStore(tenantId: string, storeId: string): Promise<LeadDB[]> {
    const { data, error } = await getSupabase()
      .from('leads')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('store_id', storeId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads by store:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Create lead
   */
  async create(lead: LeadCreateInput): Promise<LeadDB> {
    const { data, error } = await getSupabase()
      .from('leads')
      .insert(lead)
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
    return data;
  },

  /**
   * Update lead
   */
  async update(id: string, tenantId: string, updates: LeadUpdateInput): Promise<LeadDB> {
    const { data, error } = await getSupabase()
      .from('leads')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
    return data;
  },

  /**
   * Soft delete lead
   */
  async delete(id: string, tenantId: string): Promise<void> {
    const { error } = await getSupabase()
      .from('leads')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },

  /**
   * Toggle watch status
   */
  async toggleWatch(id: string, tenantId: string, isWatched: boolean): Promise<void> {
    const { error } = await getSupabase()
      .from('leads')
      .update({ is_watched: isWatched })
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error toggling watch:', error);
      throw error;
    }
  },

  /**
   * Assign lead to user
   */
  async assign(
    id: string,
    tenantId: string,
    assignedTo: { userId: string; userName: string; teamName: string }
  ): Promise<void> {
    const { error } = await getSupabase()
      .from('leads')
      .update({
        assigned_to: assignedTo,
        assigned_at: new Date().toISOString(),
        status: 'assigned',
      })
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error assigning lead:', error);
      throw error;
    }
  },

  /**
   * Update lead status
   */
  async updateStatus(id: string, tenantId: string, status: string, reason?: string): Promise<void> {
    // First update the lead status
    await this.update(id, tenantId, { status });

    // Then create activity log
    await LeadActivityService.create({
      lead_id: id,
      type: 'status_change',
      action: `Status changed to ${status}`,
      new_value: status,
      note: reason,
      created_by: 'system', // TODO: Get from auth context
    });
  },
};

// ============================================================================
// LEAD ACTIVITY SERVICE
// ============================================================================

export const LeadActivityService = {
  /**
   * Get activities for lead
   * Equivalent to KV: kv.getByPrefix('activity:lead:{lead_id}:')
   */
  async getByLead(leadId: string, limit = 50): Promise<LeadActivityDB[]> {
    const { data, error } = await getSupabase()
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Create activity
   */
  async create(activity: Omit<LeadActivityDB, '_id' | 'created_at'>): Promise<LeadActivityDB> {
    const { data, error } = await getSupabase()
      .from('lead_activities')
      .insert(activity)
      .select()
      .single();

    if (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
    return data;
  },
};

// ============================================================================
// LEAD EVIDENCE SERVICE
// ============================================================================

export const LeadEvidenceService = {
  /**
   * Get evidence for lead
   * Equivalent to KV: kv.getByPrefix('evidence:lead:{lead_id}:')
   */
  async getByLead(leadId: string): Promise<LeadEvidenceDB[]> {
    const { data, error } = await getSupabase()
      .from('lead_evidence')
      .select('*')
      .eq('lead_id', leadId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching evidence:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Upload evidence
   */
  async create(evidence: Omit<LeadEvidenceDB, '_id' | 'uploaded_at'>): Promise<LeadEvidenceDB> {
    const { data, error } = await getSupabase()
      .from('lead_evidence')
      .insert(evidence)
      .select()
      .single();

    if (error) {
      console.error('Error uploading evidence:', error);
      throw error;
    }

    // Update evidence count on lead
    const { error: updateError } = await getSupabase()
      .rpc('increment_evidence_count', { lead_id: evidence.lead_id });

    if (updateError) {
      console.error('Error updating evidence count:', updateError);
    }

    return data;
  },

  /**
   * Delete evidence
   */
  async delete(id: string, leadId: string): Promise<void> {
    const { error } = await getSupabase()
      .from('lead_evidence')
      .delete()
      .eq('_id', id);

    if (error) {
      console.error('Error deleting evidence:', error);
      throw error;
    }

    // Decrement evidence count on lead
    const { error: updateError } = await getSupabase()
      .rpc('decrement_evidence_count', { lead_id: leadId });

    if (updateError) {
      console.error('Error updating evidence count:', updateError);
    }
  },
};

// ============================================================================
// STATISTICS SERVICE
// ============================================================================

export const LeadStatisticsService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(tenantId: string, dateFrom?: string, dateTo?: string) {
    let query = getSupabase()
      .from('leads')
      .select('status, urgency, category, sla', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .is('deleted_at', null);

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching stats:', error);
      return null;
    }

    // Aggregate statistics
    const stats = {
      total: count || 0,
      by_status: {} as Record<string, number>,
      by_urgency: {} as Record<string, number>,
      by_category: {} as Record<string, number>,
      overdue: 0,
    };

    data?.forEach(lead => {
      stats.by_status[lead.status] = (stats.by_status[lead.status] || 0) + 1;
      stats.by_urgency[lead.urgency] = (stats.by_urgency[lead.urgency] || 0) + 1;
      stats.by_category[lead.category] = (stats.by_category[lead.category] || 0) + 1;
      if (lead.sla?.isOverdue) {
        stats.overdue++;
      }
    });

    return stats;
  },
};