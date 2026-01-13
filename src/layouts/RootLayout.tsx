import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { LayoutProvider } from '../contexts/LayoutContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <Outlet />
      </LayoutProvider>
    </AuthProvider>
  );
}
