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
        style={{
          fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
          padding: size === 'sm' ? '2px 8px' : '4px 12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'var(--font-weight-medium)',
        }}
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
        style={{
          fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
          padding: size === 'sm' ? '2px 8px' : '4px 12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'var(--font-weight-medium)',
        }}
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
    preparing: {
      label: 'Chuẩn bị',
      variant: 'default',
    },
    in_progress: {
      label: 'Đang kiểm tra',
      variant: 'info',
    },
    reporting: {
      label: 'Hoàn thành báo cáo',
      variant: 'warning',
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
    scheduled: {
      label: 'Theo kế hoạch',
      variant: 'default',
    },
    unannounced: {
      label: 'Đột xuất',
      variant: 'warning',
    },
    followup: {
      label: 'Tái kiểm tra',
      variant: 'info',
    },
    complaint: {
      label: 'Theo khiếu nại',
      variant: 'destructive',
    },
  };
  
  return configs[inspectionType] || { label: inspectionType, variant: 'secondary' };
}
