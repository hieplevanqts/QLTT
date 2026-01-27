/**
 * KPI-QLTT Module Routes
 */

import React from 'react';
import { RouteObject } from 'react-router-dom';

const KpiLayout = React.lazy(() =>
  import('./components/KpiLayout').then((module) => ({ default: module.KpiLayout })),
);
const DashboardPage = React.lazy(() =>
  import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const ReportsListPage = React.lazy(() =>
  import('./pages/ReportsListPage').then((module) => ({ default: module.ReportsListPage })),
);
const ReportBuilderPage = React.lazy(() =>
  import('./pages/ReportBuilderPage').then((module) => ({ default: module.ReportBuilderPage })),
);
const ReportDetailPage = React.lazy(() =>
  import('./pages/ReportDetailPage').then((module) => ({ default: module.ReportDetailPage })),
);
const CompareKpiPage = React.lazy(() =>
  import('./pages/CompareKpiPage').then((module) => ({ default: module.CompareKpiPage })),
);

export const kpiQlttRoute: RouteObject = {
  path: 'kpi',
  element: <KpiLayout />,
  children: [
    {
      index: true,
      element: <DashboardPage />
    },
    {
      path: 'list',
      element: <ReportsListPage />
    },
    {
      path: 'builder',
      element: <ReportBuilderPage />
    },
    {
      path: 'compare',
      element: <CompareKpiPage />
    },
    {
      path: ':id',
      element: <ReportDetailPage />
    }
  ]
};
