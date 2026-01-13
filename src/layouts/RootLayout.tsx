import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { LayoutProvider } from '../contexts/LayoutContext';
import { QLTTScopeProvider } from '../contexts/QLTTScopeContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <QLTTScopeProvider>
        <LayoutProvider>
          <Outlet />
        </LayoutProvider>
      </QLTTScopeProvider>
    </AuthProvider>
  );
}
