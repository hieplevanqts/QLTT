import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LayoutProvider } from '../../../contexts/LayoutContext';
import { AuthProvider } from '../../../contexts/AuthContext';

export function RootLayout() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <Toaster position="top-right" richColors />
        <Outlet />
      </LayoutProvider>
    </AuthProvider>
  );
}
