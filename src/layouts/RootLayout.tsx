import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { IamAuthProvider } from '../contexts/auth/AuthProvider';
import { LayoutProvider } from '../contexts/LayoutContext';
import { QLTTScopeProvider } from '../contexts/QLTTScopeContext';

export default function RootLayout() {
  return (
    // 🔥 FIX: Added AuthProvider back - some components still use useAuth() hook
    <AuthProvider>
      <IamAuthProvider>
        <QLTTScopeProvider>
          <LayoutProvider>
            <Outlet />
          </LayoutProvider>
        </QLTTScopeProvider>
      </IamAuthProvider>
    </AuthProvider>
  );
}
