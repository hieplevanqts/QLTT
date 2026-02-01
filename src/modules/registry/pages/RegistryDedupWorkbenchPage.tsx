import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import type { RootState } from '@/store/store';
import RegistryPlaceholderPage from './placeholder/RegistryPlaceholderPage';

export default function RegistryDedupWorkbenchPage() {
  // Redux State - Get user and department info
  const dispatch = useAppDispatch();
  const { user, department } = useAppSelector((state: RootState) => state.auth);
  const departmentId = department?._id;

  return (
    <RegistryPlaceholderPage
      title="Loại bỏ trùng lặp"
      description="Tìm kiếm và hợp nhất các bản ghi cơ sở trùng lặp"
      breadcrumbLabel="Loại bỏ trùng lặp"
    />
  );
}
