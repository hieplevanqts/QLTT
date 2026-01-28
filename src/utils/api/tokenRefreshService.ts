/**
 * Token Refresh Service
 * Automatically refreshes access token before it expires
 */

import { refreshAccessToken } from './authApi';
import { getStoredToken, isTokenExpired } from './authApi';

let refreshInterval: NodeJS.Timeout | null = null;
let isRefreshing = false;
let dispatchCallback: ((token: string) => void) | null = null;

/**
 * Start auto-refresh token service
 * Checks token expiry every minute and refreshes if needed
 * @param onRefresh - Callback to dispatch action when token is refreshed
 */
export function startTokenRefreshService(onRefresh?: (token: string) => void): void {
  // Clear existing interval if any
  stopTokenRefreshService();
  
  dispatchCallback = onRefresh || null;

  // Check token every 1 minute
  refreshInterval = setInterval(async () => {
    try {
      const token = await getStoredToken();
      
      if (!token) {
        stopTokenRefreshService();
        return;
      }

      // Check if token is expired or will expire soon
      // Use buffer (5 minutes) to refresh before actual expiry
      // This ensures token is refreshed with enough time before expiry
      const expired = await isTokenExpired(5);
      
      if (expired && !isRefreshing) {
        isRefreshing = true;
        
        try {
          const refreshResponse = await refreshAccessToken();
          
          if (refreshResponse && refreshResponse.access_token) {
            
            // Call callback to update Redux state if provided
            if (dispatchCallback && refreshResponse.access_token) {
              dispatchCallback(refreshResponse.access_token);
            }
          } else {
            console.warn('⚠️ TokenRefreshService: Failed to refresh token');
          }
        } catch (error) {
          console.error('❌ TokenRefreshService: Error refreshing token:', error);
        } finally {
          isRefreshing = false;
        }
      }
    } catch (error) {
      console.error('❌ TokenRefreshService: Error checking token:', error);
    }
  }, 60000); // Check every 1 minute
}

/**
 * Stop auto-refresh token service
 */
export function stopTokenRefreshService(): void {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    dispatchCallback = null;
  }
}

