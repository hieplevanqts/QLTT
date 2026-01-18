/**
 * API Configuration
 * Centralized config for all API calls
 */

import { projectId as supabaseProjectId, publicAnonKey } from '@/utils/supabase/info';

// Supabase credentials (from Vite env via src/utils/supabase/info.ts)
export const projectId = supabaseProjectId;
export const apiKey = publicAnonKey;

// Supabase REST API base URL (PostgREST)
export const SUPABASE_REST_URL = `https://${supabaseProjectId}.supabase.co/rest/v1`;

// Edge Function base URL (legacy - not used)
export const API_BASE_URL = `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-e4fdfce9`;

// API headers for Supabase REST API
// IMPORTANT: Both Authorization and apikey use the SAME anon key.
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,
  'apikey': apiKey,
  'Prefer': 'return=representation' // Return full data after POST/PATCH/DELETE
});
