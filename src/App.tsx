import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from '@/routes';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';

// Component to initialize token refresh service
function AppContent() {
  useTokenRefresh();
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
