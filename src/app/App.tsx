import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from '../routes/routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PlansProvider } from './contexts/PlansContext';
// Import export functions for mock data
import '../utils/exportMockData';

/**
 * Main App Component
 * Updated: January 9, 2026 - Fixed type guards in mapPointsApi
 */
export default function App() {
  return (
    <ErrorBoundary>
      <PlansProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </PlansProvider>
    </ErrorBoundary>
  );
}