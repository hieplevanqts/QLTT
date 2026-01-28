/**
 * Leads API
 * Fetch leads data from Supabase REST API
 * Used for Lead Inbox (Hộp thư nguồn tin)
 */

import { Lead, LeadStatus, LeadUrgency, LeadCategory } from '../../data/lead-risk/types';
import { SUPABASE_REST_URL, getHeaders } from './config';

/**
 * Fetch all leads from Supabase
 * GET /leads
 */
export async function fetchLeads(): Promise<Lead[]> {
    console.log('📦 fetchLeads: Starting fetch...');

    try {
        const url = `${SUPABASE_REST_URL}/leads?select=*&order=created_at.desc&limit=1000`;
        console.log('� fetchLeads: URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        console.log('📡 fetchLeads: Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ fetchLeads: HTTP error:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ fetchLeads: Received', data.length, 'leads');

        if (data.length > 0) {
            console.log('📍 fetchLeads: First lead:', data[0]);
        }

        return data.map(transformSupabaseLead);

    } catch (error) {
        console.error('❌ fetchLeads: Error:', error);
        throw error;
    }
}

/**
 * Transform Supabase DB record to Lead application type
 */
function transformSupabaseLead(record: any): Lead {
    return {
        id: record.id,
        code: record.code || `LEAD-${record.id.substring(0, 8)}`,
        title: record.title || 'Untitled Lead',
        description: record.description || '',
        status: (record.status as LeadStatus) || 'new',
        urgency: (record.urgency as LeadUrgency) || 'medium',
        confidence: record.confidence || 'low',
        source: record.source || 'system',
        category: (record.category as LeadCategory) || 'other',
        riskScope: record.risk_scope || 'point',

        location: record.location && typeof record.location === 'object' ? record.location : {
            lat: record.lat || 0,
            lng: record.lng || 0,
            address: record.address || '',
            province: record.province || '',
            district: record.district,
            ward: record.ward
        },

        storeId: record.store_id,
        storeName: record.store_name,
        reporterName: record.reporter_name,
        reporterPhone: record.reporter_phone,

        assignedTo: record.assigned_to ? {
            userId: record.assigned_to.user_id || record.assigned_to_id,
            userName: record.assigned_to.user_name || 'Unknown',
            teamName: record.assigned_to.team_name || ''
        } : undefined,
        assignedAt: record.assigned_at ? new Date(record.assigned_at) : undefined,

        sla: {
            deadline: record.sla_deadline ? new Date(record.sla_deadline) : new Date(Date.now() + 86400000),
            remainingHours: 0, // Should be calculated
            isOverdue: false // Should be calculated
        },

        reportedBy: record.reported_by,
        reportedAt: record.reported_at ? new Date(record.reported_at) : new Date(),
        createdBy: record.created_by || 'system',
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),

        evidenceCount: record.evidence_count || 0,
        relatedLeadsCount: record.related_leads_count || 0,
        activityCount: record.activity_count || 0,

        isDuplicate: record.is_duplicate || false,
        isWatched: record.is_watched || false,
        hasAlert: record.has_alert || false
    };
}
