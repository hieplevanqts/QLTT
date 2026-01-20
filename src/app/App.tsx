import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from '../routes/routes';
import { Provider } from 'react-redux';
import { store } from '../store/store';

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </Provider>
  );
}