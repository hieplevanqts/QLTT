import React from 'react';
import { useParams } from 'react-router-dom';
import RegistryPlaceholderPage from './placeholder/RegistryPlaceholderPage';

export default function RegistryVerificationDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();

  return (
    <RegistryPlaceholderPage
      title={`Chi tiết xác minh #${caseId}`}
      description="Xem và xử lý thông tin xác minh cơ sở"
      breadcrumbLabel="Chi tiết xác minh"
    />
  );
}
