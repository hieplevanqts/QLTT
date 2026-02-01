import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import type { RootState } from '@/store/store';
import RegistryPlaceholderPage from './placeholder/RegistryPlaceholderPage';

export default function RegistryVerificationQueuePage() {
  // Redux State - Get user and department info
  const dispatch = useAppDispatch();
  const { user, department } = useAppSelector((state: RootState) => state.auth);
  const departmentId = department?._id;

  return (
    <RegistryPlaceholderPage
      title="Hàng đợi xác minh"
      description="Danh sách các cơ sở Chờ duyệt thông tin"
      breadcrumbLabel="Xác minh hồ sơ"
    />
  );
}
