import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Error404 from '../pages/system/Error404';

/**
 * Router Phương - chỉ chứa các route đặc biệt/riêng biệt
 * Các route chung đã được định nghĩa trong routes.tsx
 */
export const routerPhuong = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Các route đặc biệt của phương có thể được thêm vào đây
      // Catch all - 404
      {
        path: '*',
        element: <Error404 />,
      },
    ],
  },
]);
