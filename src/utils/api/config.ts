/**
 * API Configuration
 * Centralized config for all API calls
 */

import { projectId as supabaseProjectId, publicAnonKey } from '@/utils/supabase/info';

// Supabase credentials (from Vite env via src/utils/supabase/info.ts)
export const projectId = supabaseProjectId;
export const apiKey = publicAnonKey;
export const SUPABASE_ANON_KEY = publicAnonKey;

// Supabase REST API base URL (PostgREST)
export const SUPABASE_REST_URL = `https://${supabaseProjectId}.supabase.co/rest/v1`;

// Edge Function base URL (legacy - not used)
export const API_BASE_URL = `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-e4fdfce9`;

// API headers for Supabase REST API
// Dynamically gets token from localStorage (Supabase default storage)
export const getHeaders = () => {
  let token = apiKey;
  
  try {
    const customToken = localStorage.getItem('mappa_auth_access_token');
    if (customToken) {
      token = customToken;
    }
  } catch (error) {
    console.warn('Error reading auth token from localStorage:', error);
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'apikey': apiKey,
    'Prefer': 'return=representation'
  };
};
