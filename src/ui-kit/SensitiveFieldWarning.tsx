import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';

interface SensitiveFieldWarningProps {
  show: boolean;
  sensitiveFieldsChanged: string[];
  className?: string;
}

/**
 * SensitiveFieldWarning - Shows warning when user changes sensitive fields
 * Displays which fields are sensitive and will require approval
 */
export function SensitiveFieldWarning({
  show,
  sensitiveFieldsChanged,
  className = '',
}: SensitiveFieldWarningProps) {
  if (!show || sensitiveFieldsChanged.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex gap-3 p-4 rounded-lg bg-amber-50 border-2 border-amber-300 animate-in fade-in slide-in-from-top-2 ${className}`}
    >
      <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold text-amber-900">
              Thay đổi nhạy cảm - Cần phê duyệt
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Bạn đang thay đổi {sensitiveFieldsChanged.length} trường thông tin nhạy cảm.
              Các thay đổi này sẽ cần phê duyệt trước khi có hiệu lực.
            </p>
          </div>
        </div>

        {sensitiveFieldsChanged.length > 0 && (
          <div className="mt-3 p-3 rounded-md bg-white border border-amber-200">
            <p className="text-xs font-medium text-amber-900 mb-2">
              Các trường nhạy cảm đã thay đổi:
            </p>
            <div className="flex flex-wrap gap-2">
              {sensitiveFieldsChanged.map((field) => (
                <div
                  key={field}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300"
                >
                  <Shield className="h-3 w-3" />
                  {field}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 mt-3 p-2 rounded bg-amber-100/50">
          <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Lưu ý:</strong> Dữ liệu cũ sẽ được giữ nguyên cho đến khi thay đổi được
            phê duyệt. Trong thời gian chờ, cơ sở sẽ hiển thị badge "Đang chờ phê duyệt".
          </p>
        </div>
      </div>
    </div>
  );
}
