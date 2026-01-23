/**
 * Hook to manage token auto-refresh service
 */

import { useEffect } from 'react';
import { useAppDispatch } from '../hooks';
import { fetchUserInfoRequest } from '../../store/slices/authSlice';
import { startTokenRefreshService, stopTokenRefreshService } from '../../utils/api/tokenRefreshService';

/**
 * Hook to start token auto-refresh service
 * Should be used in App component or root layout
 */
export function useTokenRefresh() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Start auto-refresh service
    startTokenRefreshService((token: string) => {
      // Dispatch action to update user info after token refresh
      dispatch(fetchUserInfoRequest(token));
    });

    // Cleanup on unmount
    return () => {
      stopTokenRefreshService();
    };
  }, [dispatch]);
}

