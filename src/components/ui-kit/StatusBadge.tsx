import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

export type StatusType = 'draft' | 'verified' | 'approved' | 'rejected' | 'overdue' | 'pending' | 'completed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
  draft: {
    label: 'Nháp',
    variant: 'outline',
  },
  verified: {
    label: 'Đã xác thực',
    variant: 'default',
    className: 'bg-chart-2 text-white',
  },
  approved: {
    label: 'Đã duyệt',
    variant: 'default',
    className: 'bg-chart-4 text-white',
  },
  rejected: {
    label: 'Từ chối',
    variant: 'destructive',
  },
  overdue: {
    label: 'Quá hạn',
    variant: 'destructive',
  },
  pending: {
    label: 'Đang xử lý',
    variant: 'default',
    className: 'bg-chart-5 text-white',
  },
  completed: {
    label: 'Hoàn thành',
    variant: 'secondary',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

// Default export for backward compatibility
export default StatusBadge;
