/**
 * SA MASTER DATA ROUTES
 * Routes cho module quản lý dữ liệu nền
 */

import React from 'react';
import { RouteObject } from 'react-router-dom';

// Pages
import {
  OrgUnitsPage,
  DepartmentsPage,
  JurisdictionsPage,
  JurisdictionMapPage,
  CatalogsPage,
  CatalogItemsPage,
  CatalogSchemaPage
} from './pages';

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
