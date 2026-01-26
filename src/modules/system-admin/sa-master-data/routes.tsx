/**
 * SA MASTER DATA ROUTES
 * Routes cho module quản lý dữ liệu nền
 */

import React from 'react';
import { RouteObject } from 'react-router-dom';

const OrgUnitsPage = React.lazy(() => import('./pages/OrgUnitsPage'));
const DepartmentsPage = React.lazy(() => import('./pages/DepartmentsPage'));
const AdminAreasPage = React.lazy(() => import('./pages/AdminAreasPage'));
const CommonCatalogsPage = React.lazy(() => import('./pages/CommonCatalogsPage'));
const DmsCatalogsPage = React.lazy(() => import('./pages/DmsCatalogsPage'));
const SystemCatalogsPage = React.lazy(() => import('./pages/SystemCatalogsPage'));
const CommonCatalogDetailPage = React.lazy(() => import('./pages/CommonCatalogDetailPage'));
const JurisdictionsPage = React.lazy(() => import('./pages/JurisdictionsPage'));
const JurisdictionMapPage = React.lazy(() => import('./pages/JurisdictionMapPage'));
const CatalogsPage = React.lazy(() => import('./pages/CatalogsPage'));
const CatalogItemsPage = React.lazy(() => import('./pages/CatalogItemsPage'));
const CatalogSchemaPage = React.lazy(() => import('./pages/CatalogSchemaPage'));

/**
 * Route configuration cho SA Master Data
 * Base path: system-admin/master-data
 */
export const saMasterDataRoutes: RouteObject = {
  path: 'system-admin/master-data',
  children: [
    // Org Units - Đơn vị tổ chức
    {
      path: 'org-units',
      element: <OrgUnitsPage />
      // Permission: sa.masterdata.orgunit.read (checked in component)
    },
    
    // Departments - Phòng ban
    {
      path: 'departments',
      element: <DepartmentsPage />
      // Permission: sa.masterdata.department.read (checked in component)
    },

    // Admin Areas - Danh mục hành chính (Province -> Ward)
    {
      path: 'admin-areas',
      element: <AdminAreasPage />
      // Permission: sa.masterdata.jurisdiction.read (checked in component)
    },

    // Common Catalogs - Danh mục dùng chung
    {
      path: 'common-catalogs',
      element: <CommonCatalogsPage />
      // Permission: sa.masterdata.catalog.read (checked in component)
    },
    {
      path: 'dms-catalogs',
      element: <DmsCatalogsPage />
      // Permission: sa.masterdata.catalog.read (checked in component)
    },
    {
      path: 'system-catalogs',
      element: <SystemCatalogsPage />
      // Permission: sa.masterdata.catalog.read (checked in component)
    },
    {
      path: 'common-catalogs/:catalogId',
      element: <CommonCatalogDetailPage />
      // Permission: sa.masterdata.catalog.read (checked in component)
    },
    
    // Jurisdictions - Địa bàn
    {
      path: 'jurisdictions',
      element: <JurisdictionsPage />
      // Permission: sa.masterdata.jurisdiction.read (checked in component)
    },
    {
      path: 'jurisdictions/:id/map',
      element: <JurisdictionMapPage />
      // Permission: sa.masterdata.jurisdiction.read (checked in component)
    },
    
    // Catalogs - Danh mục
    {
      path: 'catalogs',
      element: <CatalogsPage />
      // Permission: sa.masterdata.catalog.read (checked in component)
    },
    {
      path: 'catalogs/:catalogKey/items',
      element: <CatalogItemsPage />
      // Permission: sa.masterdata.catalog.read (checked in component)
    },
    {
      path: 'catalogs/:catalogKey/schema',
      element: <CatalogSchemaPage />
      // Permission: sa.masterdata.catalog.read (checked in component)
      // Save button requires: sa.masterdata.catalog.update
    }
  ]
};
