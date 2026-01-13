import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from '../routes/routes';
import { ErrorBoundary } from './components/ErrorBoundary';
// Import export functions for mock data
import '../utils/exportMockData';

/**
 * Main App Component
 * Updated: January 9, 2026 - Fixed type guards in mapPointsApi
 */
export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  );
}