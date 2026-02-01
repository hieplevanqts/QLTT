import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LayoutProvider } from '../../../contexts/LayoutContext';
import { AuthProvider } from '../../../contexts/AuthContext';
import { IamAuthProvider } from '../../../contexts/auth/AuthProvider';

export function RootLayout() {
  return (
    <AuthProvider>
      <IamAuthProvider>
        <LayoutProvider>
          <Toaster position="top-right" richColors />
          <Outlet />
        </LayoutProvider>
      </IamAuthProvider>
    </AuthProvider>
  );
}
