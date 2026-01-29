/**
 * Supabase Client Singleton
 * Tạo một instance duy nhất để tránh warning "Multiple GoTrueClient instances"
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/api/supabaseClient';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

/**
 * Lấy Supabase client singleton
 * Chỉ tạo instance một lần duy nhất
 */
export function getSupabaseClient(): SupabaseClient {
    return supabase;
}

// Export constants
export const SUPABASE_URL = `https://${projectId}.supabase.co`;
export const SUPABASE_ANON_KEY = publicAnonKey;

// Export singleton instance as default
export { supabase };
