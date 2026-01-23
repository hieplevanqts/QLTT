import { Outlet } from 'react-router-dom';
// 🔥 REMOVED: AuthProvider - now using Redux for authentication
// import { AuthProvider } from '../contexts/AuthContext';
import { LayoutProvider } from '../contexts/LayoutContext';
import { QLTTScopeProvider } from '../contexts/QLTTScopeContext';

export default function RootLayout() {
  return (
    // 🔥 FIX: Removed AuthProvider - authentication is now handled by Redux
    <QLTTScopeProvider>
      <LayoutProvider>
        <Outlet />
      </LayoutProvider>
    </QLTTScopeProvider>
  );
}
