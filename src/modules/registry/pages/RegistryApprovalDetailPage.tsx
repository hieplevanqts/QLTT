import React from 'react';
import { useParams } from 'react-router-dom';
import RegistryPlaceholderPage from './placeholder/RegistryPlaceholderPage';

export default function RegistryApprovalDetailPage() {
  const { approvalId } = useParams<{ approvalId: string }>();

  return (
    <RegistryPlaceholderPage
      title={`Chi tiết phê duyệt #${approvalId}`}
      description="Xem và xử lý yêu cầu phê duyệt"
      breadcrumbLabel="Chi tiết phê duyệt"
    />
  );
}
