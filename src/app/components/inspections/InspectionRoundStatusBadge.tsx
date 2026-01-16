import React from 'react';
import { Badge } from '../ui/badge';
import type { InspectionRoundStatus, InspectionType } from '../../data/inspection-rounds-mock-data';

type BadgeType = 'round' | 'inspectionType';
type BadgeSize = 'sm' | 'md';

interface InspectionRoundStatusBadgeProps {
  type: BadgeType;
  value: InspectionRoundStatus | InspectionType;
  size?: BadgeSize;
}

export function InspectionRoundStatusBadge({ 
  type, 
  value,
  size = 'md' 
}: InspectionRoundStatusBadgeProps) {
  
  if (type === 'round') {
    const status = value as InspectionRoundStatus;
    const config = getStatusConfig(status);
    
    return (
      <Badge 
        variant={config.variant}
        className={size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'}
      >
        {config.label}
      </Badge>
    );
  }
  
  if (type === 'inspectionType') {
    const inspectionType = value as InspectionType;
    const config = getInspectionTypeConfig(inspectionType);
    
    return (
      <Badge 
        variant={config.variant}
        className={size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'}
      >
        {config.label}
      </Badge>
    );
  }
  
  return null;
}

function getStatusConfig(status: InspectionRoundStatus) {
  const configs: Record<InspectionRoundStatus, { label: string; variant: any }> = {
    draft: {
      label: 'Nháp',
      variant: 'secondary',
    },
    pending_approval: {
      label: 'Chờ duyệt',
      variant: 'warning',
    },
    approved: {
      label: 'Đã duyệt',
      variant: 'info',
    },
    rejected: {
      label: 'Từ chối duyệt',
      variant: 'destructive',
    },
    active: {
      label: 'Đang triển khai',
      variant: 'info',
    },
    paused: {
      label: 'Tạm dừng',
      variant: 'warning',
    },
    in_progress: {
      label: 'Đang kiểm tra',
      variant: 'info',
    },
    completed: {
      label: 'Hoàn thành',
      variant: 'success',
    },
    cancelled: {
      label: 'Đã hủy',
      variant: 'destructive',
    },
  };
  
  return configs[status] || { label: status, variant: 'secondary' };
}

function getInspectionTypeConfig(inspectionType: InspectionType) {
  const configs: Record<InspectionType, { label: string; variant: any }> = {
    routine: {
      label: 'Định kỳ',
      variant: 'secondary', // Màu xám nhẹ
    },
    targeted: {
      label: 'Chuyên đề',
      variant: 'info',
    },
    sudden: {
      label: 'Đột xuất',
      variant: 'warning',
    },
    followup: {
      label: 'Tái kiểm tra',
      variant: 'info',
    },
  };
  
  return configs[inspectionType] || { label: inspectionType, variant: 'secondary' };
}