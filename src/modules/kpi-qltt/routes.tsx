/**
 * KPI-QLTT Module Routes
 */

import { RouteObject } from 'react-router-dom';
import { KpiLayout } from './components/KpiLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ReportsListPage } from './pages/ReportsListPage';
import { ReportBuilderPage } from './pages/ReportBuilderPage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { CompareKpiPage } from './pages/CompareKpiPage';

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