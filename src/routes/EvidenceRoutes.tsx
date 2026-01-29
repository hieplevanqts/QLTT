import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Evidence Pages
import EvidenceListPage from '@/modules/evidence/pages/EvidenceListPage';
import EvidenceUploadPage from '@/modules/evidence/pages/EvidenceUploadPage';
import EvidenceIntakeInboxPage from '@/modules/evidence/pages/EvidenceIntakeInboxPage';
import EvidenceDetailPage from '@/modules/evidence/pages/EvidenceDetailPage';
import EvidenceReviewQueuePage from '@/modules/evidence/pages/EvidenceReviewQueuePage';
import EvidenceReviewDetailPage from '@/modules/evidence/pages/EvidenceReviewDetailPage';
import EvidencePackageListPage from '@/modules/evidence/pages/EvidencePackageListPage';
import EvidencePackageBuilderPage from '@/modules/evidence/pages/EvidencePackageBuilderPage';
import EvidencePackageDetailPage from '@/modules/evidence/pages/EvidencePackageDetailPage';
import EvidenceExportCenterPage from '@/modules/evidence/pages/EvidenceExportCenterPage';
import EvidenceAuditLogPage from '@/modules/evidence/pages/EvidenceAuditLogPage';

export default function EvidenceRoutes() {
  return (
    <Routes>
      {/* WEB-05-01 — Evidence List (P0) - Main Dashboard */}
      <Route index element={<EvidenceListPage />} />
      
      {/* Intake Inbox - WEB-05-03 */}
      <Route path="intake" element={<EvidenceIntakeInboxPage />} />
      
      {/* Evidence Items */}
      <Route path="new" element={<EvidenceUploadPage />} />
      <Route path=":evidenceId" element={<EvidenceDetailPage />} />
      
      {/* Review Queue */}
      <Route path="review" element={<EvidenceReviewQueuePage />} />
      <Route path="review/:evidenceId" element={<EvidenceReviewDetailPage />} />
      
      {/* Packages */}
      <Route path="packages" element={<EvidencePackageListPage />} />
      <Route path="packages/new" element={<EvidencePackageBuilderPage />} />
      <Route path="packages/:packageId" element={<EvidencePackageDetailPage />} />
      
      {/* Export Center */}
      <Route path="exports" element={<EvidenceExportCenterPage />} />
      
      {/* Audit Log */}
      <Route path="audit" element={<EvidenceAuditLogPage />} />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/evidence" replace />} />
    </Routes>
  );
}
