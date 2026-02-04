/**
 * KPI QLTT Module Routes
 */

import { RouteObject } from 'react-router-dom';
import { KpiLayout } from './components/KpiLayout';
import KpiWorkspacePage from './pages/KpiWorkspacePage';
import KpiQlttDashboardNew from './pages/KpiQlttDashboard_new';
import { ReportsListPage } from './pages/ReportsListPage';
import { ReportBuilderPage } from './pages/ReportBuilderPage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { CompareKpiPage } from './pages/CompareKpiPage';
import KpiCriteriaDetailPage from './pages/KpiCriteriaDetailPage';

export const kpiQlttRoute: RouteObject = {
  path: 'kpi',
  element: <KpiLayout />,
  children: [
    {
      index: true,
      element: <KpiWorkspacePage />
    },
    {
      path: 'dashboard-new',
      element: <KpiQlttDashboardNew />
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
      path: 'criteria/:catalogKey',
      element: <KpiCriteriaDetailPage />
    },
    {
      path: ':id',
      element: <ReportDetailPage />
    }
  ]
};
