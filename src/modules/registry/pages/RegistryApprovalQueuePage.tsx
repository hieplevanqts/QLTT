import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import type { RootState } from '@/store/store';
import RegistryPlaceholderPage from './placeholder/RegistryPlaceholderPage';

export default function RegistryApprovalQueuePage() {
  // Redux State - Get user and department info
  const dispatch = useAppDispatch();
  const { user, department } = useAppSelector((state: RootState) => state.auth);
  const departmentId = department?._id;

  return (
    <RegistryPlaceholderPage
      title="Hàng đợi phê duyệt"
      description="Danh sách các yêu cầu chờ phê duyệt"
      breadcrumbLabel="Phê duyệt"
    />
  );
}
