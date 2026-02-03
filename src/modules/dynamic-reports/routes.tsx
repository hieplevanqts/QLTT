import { Outlet, RouteObject } from 'react-router-dom';
import DynamicReportsLanding from './pages/DynamicReportsLanding';
import ReportBuilder from './pages/ReportBuilder';
import ReportResult from './pages/ReportResult';

export const dynamicReportsRoute: RouteObject = {
  path: 'bao-cao-dong',
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <DynamicReportsLanding />,
    },
    {
      path: 'tao-moi',
      element: <ReportBuilder />,
    },
    {
      path: 'chinh-sua/:templateId',
      element: <ReportBuilder />,
    },
    {
      path: 'ket-qua/:reportId',
      element: <ReportResult />,
    },
  ],
};
