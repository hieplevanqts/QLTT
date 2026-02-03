import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { IamAuthProvider } from '../contexts/auth/AuthProvider';
import { LayoutProvider } from '../contexts/LayoutContext';
import { QLTTScopeProvider } from '../contexts/QLTTScopeContext';
import { AssistantProvider } from '@/ai/assistantStore';

export default function RootLayout() {
  return (
    // 🔥 FIX: Added AuthProvider back - some components still use useAuth() hook
    <AuthProvider>
      <IamAuthProvider>
        <QLTTScopeProvider>
          <LayoutProvider>
            <AssistantProvider>
              <Outlet />
            </AssistantProvider>
          </LayoutProvider>
        </QLTTScopeProvider>
      </IamAuthProvider>
    </AuthProvider>
  );
}
