import React from 'react';
import { AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { Badge } from '../app/components/ui/badge';

export interface FieldChange {
  field: string;
  label: string;
  oldValue: any;
  newValue: any;
  isSensitive: boolean;
}

interface DiffPreviewSectionProps {
  changes: FieldChange[];
  storeName: string;
  className?: string;
}

/**
 * DiffPreviewSection - Shows before/after comparison for all changed fields
 * Highlights sensitive fields that require approval
 */
export function DiffPreviewSection({
  changes,
  storeName,
  className = '',
}: DiffPreviewSectionProps) {
  const sensitiveChanges = changes.filter((c) => c.isSensitive);
  const normalChanges = changes.filter((c) => !c.isSensitive);

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return '(Trống)';
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '(Trống)';
    }
    if (typeof value === 'boolean') {
      return value ? 'Có' : 'Không';
    }
    return String(value);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Xem trước thay đổi</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Rà soát kỹ các thay đổi trước khi xác nhận cập nhật cơ sở{' '}
          <strong>{storeName}</strong>
        </p>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
        <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
        <div className="flex-1 text-sm">
          <p className="font-medium text-blue-900">
            Tổng số thay đổi: {changes.length} trường
          </p>
          <div className="flex gap-2 mt-2">
            {normalChanges.length > 0 && (
              <Badge variant="outline" className="bg-white">
                {normalChanges.length} thay đổi thường
              </Badge>
            )}
            {sensitiveChanges.length > 0 && (
              <Badge variant="outline" className="bg-amber-50 border-amber-300 text-amber-700">
                <Shield className="h-3 w-3 mr-1" />
                {sensitiveChanges.length} thay đổi nhạy cảm
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Sensitive Changes Warning */}
      {sensitiveChanges.length > 0 && (
        <div className="flex gap-3 p-4 rounded-lg bg-amber-50 border border-amber-300">
          <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-amber-900 mb-1">
              Thay đổi nhạy cảm - Cần phê duyệt
            </p>
            <p className="text-amber-700">
              Các thay đổi này ảnh hưởng đến thông tin quan trọng và sẽ cần được phê duyệt
              trước khi có hiệu lực. Dữ liệu cũ sẽ được giữ nguyên cho đến khi thay đổi được
              chấp thuận.
            </p>
          </div>
        </div>
      )}

      {/* Sensitive Changes Table */}
      {sensitiveChanges.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-600" />
            <h4 className="font-semibold text-sm">Thay đổi nhạy cảm</h4>
          </div>

          <div className="border border-amber-200 rounded-lg overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-200 grid grid-cols-[2fr,3fr,1fr,3fr] gap-4 px-4 py-2">
              <div className="text-xs font-semibold text-amber-900">Trường</div>
              <div className="text-xs font-semibold text-amber-900">Giá trị cũ</div>
              <div className="text-xs font-semibold text-center text-amber-900"></div>
              <div className="text-xs font-semibold text-amber-900">Giá trị mới</div>
            </div>

            {sensitiveChanges.map((change, index) => (
              <div
                key={change.field}
                className={`grid grid-cols-[2fr,3fr,1fr,3fr] gap-4 px-4 py-3 ${
                  index < sensitiveChanges.length - 1 ? 'border-b border-amber-100' : ''
                }`}
              >
                <div className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-3 w-3 text-amber-600 shrink-0" />
                  {change.label}
                </div>
                <div className="text-sm text-muted-foreground bg-red-50 px-3 py-2 rounded border border-red-200">
                  {formatValue(change.oldValue)}
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-sm font-medium bg-green-50 px-3 py-2 rounded border border-green-200">
                  {formatValue(change.newValue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Normal Changes Table */}
      {normalChanges.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Thay đổi thường</h4>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted border-b grid grid-cols-[2fr,3fr,1fr,3fr] gap-4 px-4 py-2">
              <div className="text-xs font-semibold">Trường</div>
              <div className="text-xs font-semibold">Giá trị cũ</div>
              <div className="text-xs font-semibold text-center"></div>
              <div className="text-xs font-semibold">Giá trị mới</div>
            </div>

            {normalChanges.map((change, index) => (
              <div
                key={change.field}
                className={`grid grid-cols-[2fr,3fr,1fr,3fr] gap-4 px-4 py-3 ${
                  index < normalChanges.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className="text-sm font-medium">{change.label}</div>
                <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded">
                  {formatValue(change.oldValue)}
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-sm font-medium bg-blue-50 px-3 py-2 rounded border border-blue-200">
                  {formatValue(change.newValue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Changes */}
      {changes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Không có thay đổi nào để hiển thị</p>
        </div>
      )}
    </div>
  );
}
