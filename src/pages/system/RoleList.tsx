import React from 'react';
import { Shield } from 'lucide-react';
import PlaceholderPage from '../PlaceholderPage';

export default function RoleList() {
  return (
    <PlaceholderPage
      title="Quản lý vai trò"
      description="Quản lý các vai trò và quyền hạn trong hệ thống MAPPA Portal."
      breadcrumbs={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản trị', href: '/admin' },
        { label: 'Vai trò' },
      ]}
    />
  );
}
