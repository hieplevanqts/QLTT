/**
 * Supabase Client Singleton
 * Tạo một instance duy nhất để tránh warning "Multiple GoTrueClient instances"
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Singleton instance
let supabaseInstance: SupabaseClient | null = null;

/**
 * Lấy Supabase client singleton
 * Chỉ tạo instance một lần duy nhất
 */
export function getSupabaseClient(): SupabaseClient {
    if (!supabaseInstance) {
        supabaseInstance = createClient(supabaseUrl, publicAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        });
    }
    return supabaseInstance;
}

// Export constants
export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_ANON_KEY = publicAnonKey;

// Export singleton instance as default
export const supabase = getSupabaseClient();
