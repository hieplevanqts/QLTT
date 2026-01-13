/**
 * Feature Flags Configuration
 * 
 * Toggle features on/off here instead of modifying code in multiple places
 * Last Updated: January 9, 2026 - Type guards added to data transformation
 */

export const FEATURES = {
  /**
   * USE_SUPABASE_BACKEND
   * 
   * Set to `true` to enable Supabase backend for data persistence
   * Set to `false` to use local mock data (no network calls, no CORS errors)
   * 
   * Requirements when enabled:
   * - Supabase REST API must be accessible
   * - Database table 'map_points' must exist
   * - Proper CORS configuration
   * - Type-safe data transformation (added Jan 9, 2026)
   * 
   * See /SUPABASE_SETUP.md for setup instructions
   */
  USE_SUPABASE_BACKEND: false, // ❌ DISABLED - Using mock data (database location field is null)

  /**
   * ENABLE_ANALYTICS
   * Track user interactions (future feature)
   */
  ENABLE_ANALYTICS: false,

  /**
   * ENABLE_REALTIME
   * Enable real-time updates via Supabase Realtime (future feature)
   */
  ENABLE_REALTIME: false,

  /**
   * DEBUG_MODE
   * Show verbose console logs
   */
  DEBUG_MODE: true,
} as const;

// Type-safe feature flag access
export type FeatureFlag = keyof typeof FEATURES;