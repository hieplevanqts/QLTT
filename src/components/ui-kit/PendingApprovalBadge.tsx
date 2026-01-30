import React from 'react';
import { Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PendingApprovalBadgeProps {
  type?: 'quick-edit' | 'full-edit';
  changedFields?: string[];
  submittedAt?: string;
  submittedBy?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Badge to indicate that a store has pending approval changes
 * Shows when Quick Edit or Full Edit changes are awaiting approval
 */
export function PendingApprovalBadge({
  type = 'quick-edit',
  changedFields = [],
  submittedAt,
  submittedBy,
  onClick,
  className = '',
}: PendingApprovalBadgeProps) {
  const tooltipContent = (
    <div className="space-y-1 text-xs">
      <p className="font-semibold">
        {type === 'quick-edit' ? 'Chỉnh sửa nhanh' : 'Chỉnh sửa đầy đủ'}
      </p>
      {changedFields.length > 0 && (
        <div>
          <p className="text-muted-foreground">Trường thay đổi:</p>
          <ul className="list-disc list-inside mt-1">
            {changedFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}
      {submittedAt && (
        <p className="text-muted-foreground">Gửi lúc: {submittedAt}</p>
      )}
      {submittedBy && (
        <p className="text-muted-foreground">Bởi: {submittedBy}</p>
      )}
      {onClick && (
        <p className="text-primary font-medium mt-2">Nhấn để xem chi tiết →</p>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`
              gap-1.5 cursor-pointer
              bg-amber-50 text-amber-700 border-amber-300
              hover:bg-amber-100 hover:border-amber-400
              transition-colors
              ${className}
            `}
            onClick={onClick}
          >
            <Clock className="h-3 w-3" />
            Đang chờ phê duyệt
            {onClick && <Eye className="h-3 w-3 ml-1" />}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
