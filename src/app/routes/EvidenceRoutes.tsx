import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Evidence Pages
import EvidenceListPage from '../pages/evidence/EvidenceListPage';
import EvidenceUploadPage from '../pages/evidence/EvidenceUploadPage';
import EvidenceIntakeInboxPage from '../pages/evidence/EvidenceIntakeInboxPage';
import EvidenceDetailPage from '../pages/evidence/EvidenceDetailPage';
import EvidenceReviewQueuePage from '../pages/evidence/EvidenceReviewQueuePage';
import EvidenceReviewDetailPage from '../pages/evidence/EvidenceReviewDetailPage';
import EvidencePackageListPage from '../pages/evidence/EvidencePackageListPage';
import EvidencePackageBuilderPage from '../pages/evidence/EvidencePackageBuilderPage';
import EvidencePackageDetailPage from '../pages/evidence/EvidencePackageDetailPage';
import EvidenceExportCenterPage from '../pages/evidence/EvidenceExportCenterPage';
import EvidenceAuditLogPage from '../pages/evidence/EvidenceAuditLogPage';

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