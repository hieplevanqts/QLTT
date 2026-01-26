import { RouteObject } from 'react-router-dom';
import RegistryHomePage from '../pages/registry/RegistryHomePage';
import RegistryStoreListPage from '../pages/registry/RegistryStoreListPage';
import RegistryDedupWorkbenchPage from '../pages/registry/RegistryDedupWorkbenchPage';
import RegistryVerificationQueuePage from '../pages/registry/RegistryVerificationQueuePage';
import RegistryVerificationDetailPage from '../pages/registry/RegistryVerificationDetailPage';
import RegistryApprovalQueuePage from '../pages/registry/RegistryApprovalQueuePage';
import RegistryApprovalDetailPage from '../pages/registry/RegistryApprovalDetailPage';
import RegistryImportPage from '../pages/registry/RegistryImportPage';
import RegistryImportReviewPage from '../pages/registry/RegistryImportReviewPage';
import RegistryAuditLogPage from '../pages/registry/RegistryAuditLogPage';
import EditRegistryPage from '../pages/EditRegistryPage';
import FullEditRegistryPage from '../pages/FullEditRegistryPage';
import StoreDetailPage from '../pages/StoreDetailPage';

/**
 * Registry routes
 */
export const registryRoutes: RouteObject[] = [
  {
    path: 'registry',
    children: [
      {
        index: true,
        element: <RegistryHomePage />,
      },
      {
        path: 'stores',
        element: <RegistryStoreListPage />,
      },
      {
        path: 'stores/:id',
        element: <StoreDetailPage />,
      },
      {
        path: 'full-edit/:id',
        element: <FullEditRegistryPage />,
      },
      {
        path: 'edit/:id',
        element: <EditRegistryPage />,
      },
      // TODO: Add nested store routes
      // {
      //   path: 'stores/map',
      //   element: <RegistryStoreMapSplitPage />,
      // },
      // {
      //   path: 'stores/new',
      //   element: <RegistryStoreCreateWizardPage />,
      // },
      // {
      //   path: 'stores/:storeId',
      //   element: <RegistryStoreDetailPage />,
      // },
      // {
      //   path: 'stores/:storeId/edit',
      //   element: <RegistryStoreEditPage />,
      // },
      {
        path: 'dedup',
        element: <RegistryDedupWorkbenchPage />,
      },
      {
        path: 'verification',
        element: <RegistryVerificationQueuePage />,
      },
      {
        path: 'verification/:caseId',
        element: <RegistryVerificationDetailPage />,
      },
      {
        path: 'approvals',
        element: <RegistryApprovalQueuePage />,
      },
      {
        path: 'approvals/:approvalId',
        element: <RegistryApprovalDetailPage />,
      },
      {
        path: 'import',
        element: <RegistryImportPage />,
      },
      {
        path: 'import-review',
        element: <RegistryImportReviewPage />,
      },
      {
        path: 'import/review/:jobId',
        element: <RegistryImportReviewPage />,
      },
      {
        path: 'audit',
        element: <RegistryAuditLogPage />,
      },
    ],
  },
];

