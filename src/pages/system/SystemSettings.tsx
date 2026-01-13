import React from 'react';
import { Settings } from 'lucide-react';
import PlaceholderPage from '../PlaceholderPage';

export default function SystemSettings() {
  return (
    <PlaceholderPage
      title="Cấu hình hệ thống"
      description="Cấu hình các thông số hệ thống, danh mục dữ liệu và tùy chọn chung."
      breadcrumbs={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản trị', href: '/admin' },
        { label: 'Cấu hình' },
      ]}
    />
  );
}
