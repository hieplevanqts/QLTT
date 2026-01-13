import React from 'react';
import { Users } from 'lucide-react';
import PlaceholderPage from '../PlaceholderPage';

export default function UserList() {
  return (
    <PlaceholderPage
      title="Quản lý người dùng"
      description="Quản lý danh sách người dùng, phân quyền và cấu hình truy cập hệ thống."
      breadcrumbs={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản trị', href: '/admin' },
        { label: 'Người dùng' },
      ]}
    />
  );
}
