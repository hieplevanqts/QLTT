import React, { useState } from 'react';
import { Activity, Clock, FileText, Edit, Trash2, Eye } from 'lucide-react';
import PageHeader from '@/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ActivityLogEntry {
  id: string;
  action: 'view' | 'create' | 'edit' | 'delete';
  module: string;
  description: string;
  timestamp: string;
  ipAddress: string;
}

const MOCK_ACTIVITIES: ActivityLogEntry[] = [
  {
    id: '1',
    action: 'view',
    module: 'Cơ sở quản lý',
    description: 'Xem chi tiết cơ sở "ABC Company"',
    timestamp: '2026-01-06 14:35:22',
    ipAddress: '192.168.1.100',
  },
  {
    id: '2',
    action: 'edit',
    module: 'Cơ sở quản lý',
    description: 'Cập nhật thông tin cơ sở "XYZ Store"',
    timestamp: '2026-01-06 12:20:15',
    ipAddress: '192.168.1.100',
  },
  {
    id: '3',
    action: 'create',
    module: 'Nguồn tin',
    description: 'Tạo nguồn tin mới NT-2026-456',
    timestamp: '2026-01-05 16:45:30',
    ipAddress: '192.168.1.100',
  },
  {
    id: '4',
    action: 'view',
    module: 'Kế hoạch',
    description: 'Xem kế hoạch kiểm tra KH-2026-Q1',
    timestamp: '2026-01-05 10:15:00',
    ipAddress: '192.168.1.100',
  },
  {
    id: '5',
    action: 'delete',
    module: 'Nguồn tin',
    description: 'Xóa nguồn tin NT-2026-123',
    timestamp: '2026-01-04 15:30:45',
    ipAddress: '192.168.1.100',
  },
];

const getActionIcon = (action: ActivityLogEntry['action']) => {
  switch (action) {
    case 'view':
      return <Eye size={16} />;
    case 'create':
      return <FileText size={16} />;
    case 'edit':
      return <Edit size={16} />;
    case 'delete':
      return <Trash2 size={16} className="text-destructive" />;
  }
};

const getActionBadgeVariant = (action: ActivityLogEntry['action']): 'default' | 'secondary' | 'destructive' => {
  switch (action) {
    case 'view':
      return 'secondary';
    case 'create':
      return 'default';
    case 'edit':
      return 'default';
    case 'delete':
      return 'destructive';
  }
};

const getActionLabel = (action: ActivityLogEntry['action']) => {
  switch (action) {
    case 'view':
      return 'Xem';
    case 'create':
      return 'Tạo mới';
    case 'edit':
      return 'Chỉnh sửa';
    case 'delete':
      return 'Xóa';
  }
};

export default function ActivityLog() {
  const [filterModule, setFilterModule] = useState('all');
  const [filterAction, setFilterAction] = useState('all');

  const filteredActivities = MOCK_ACTIVITIES.filter((activity) => {
    if (filterModule !== 'all' && activity.module !== filterModule) return false;
    if (filterAction !== 'all' && activity.action !== filterAction) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tài khoản', href: '/account/profile' },
          { label: 'Nhật ký hoạt động' },
        ]}
        title="Nhật ký hoạt động"
      />

      <div style={{ flex: 1, padding: '24px' }}>
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} />
                Lịch sử hoạt động của bạn
              </CardTitle>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Select value={filterModule} onValueChange={setFilterModule}>
                  <SelectTrigger style={{ width: '200px' }}>
                    <SelectValue placeholder="Tất cả module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả module</SelectItem>
                    <SelectItem value="Cơ sở quản lý">Cơ sở quản lý</SelectItem>
                    <SelectItem value="Nguồn tin">Nguồn tin</SelectItem>
                    <SelectItem value="Kế hoạch">Kế hoạch</SelectItem>
                    <SelectItem value="Nhiệm vụ">Nhiệm vụ</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger style={{ width: '180px' }}>
                    <SelectValue placeholder="Tất cả thao tác" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả thao tác</SelectItem>
                    <SelectItem value="view">Xem</SelectItem>
                    <SelectItem value="create">Tạo mới</SelectItem>
                    <SelectItem value="edit">Chỉnh sửa</SelectItem>
                    <SelectItem value="delete">Xóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {filteredActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    background: 'var(--card)',
                    borderBottom: index < filteredActivities.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <Badge variant={getActionBadgeVariant(activity.action)}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {getActionIcon(activity.action)}
                        {getActionLabel(activity.action)}
                      </span>
                    </Badge>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--foreground)',
                        marginBottom: '4px',
                      }}
                    >
                      {activity.description}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      Module: {activity.module} • IP: {activity.ipAddress}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexShrink: 0,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    <Clock size={14} />
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <div
                style={{
                  padding: '48px',
                  textAlign: 'center',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                }}
              >
                Không tìm thấy hoạt động nào
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
