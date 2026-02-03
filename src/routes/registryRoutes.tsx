import { RouteObject } from 'react-router-dom';
import {
  RegistryHomePage,
  RegistryStoreListPage,
  RegistryDedupWorkbenchPage,
  RegistryVerificationQueuePage,
  RegistryVerificationDetailPage,
  RegistryApprovalQueuePage,
  RegistryApprovalDetailPage,
  RegistryImportPage,
  RegistryImportReviewPage,
  RegistryAuditLogPage,
  EditRegistryPage,
  FullEditRegistryPage,
  StoreDetailPage,
} from '@/modules/registry';

/**
 * Registry routes
 */
export const registryRoutes: RouteObject[] = [
  {
    path: 'registry',
    children: [
      // {
      //   index: true,
      //   element: <RegistryHomePage />,
      // },
      {
        index: true,
        element: <RegistryStoreListPage />,
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


