/**
 * API Configuration
 * Centralized config for all API calls
 */

// Supabase credentials
export const projectId = "mwuhuixkybbwrnoqcibg";

// Publishable API key - use for BOTH Authorization and apikey headers (matches Postman)
export const apiKey = 'sb_publishable_oURI60lA6Y7EiO4LUvqVxQ_9XqLea8P';

// Supabase REST API base URL (PostgREST)
export const SUPABASE_REST_URL = `https://${projectId}.supabase.co/rest/v1`;

// Edge Function base URL (legacy - not used)
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e4fdfce9`;

// API headers for Supabase REST API
// IMPORTANT: Both Authorization and apikey use the SAME publishable key (matches Postman exactly)
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,  // Using publishable key (matches Postman!)
  'apikey': apiKey,  // Same publishable key
  'Prefer': 'return=representation' // Return full data after POST/PATCH/DELETE
});