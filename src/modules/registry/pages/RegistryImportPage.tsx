import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import type { RootState } from '@/store/store';
import RegistryPlaceholderPage from './placeholder/RegistryPlaceholderPage';

export default function RegistryImportPage() {
  // Redux State - Get user and department info
  const dispatch = useAppDispatch();
  const { user, department } = useAppSelector((state: RootState) => state.auth);
  const departmentId = department?._id;

  return (
    <RegistryPlaceholderPage
      title="Nhập dữ liệu cơ sở"
      description="Import dữ liệu cơ sở từ file Excel hoặc CSV"
      breadcrumbLabel="Nhập dữ liệu"
    />
  );
}
