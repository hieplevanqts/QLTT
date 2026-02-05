import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ChangeReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  changedFieldsCount: number;
  hasSensitiveChanges: boolean;
  onConfirm: (reason: string) => void;
  isSubmitting?: boolean;
}

/**
 * ChangeReasonDialog - Mandatory dialog to collect reason for all changes
 * Shows different messages based on whether changes are sensitive
 */
export function ChangeReasonDialog({
  open,
  onOpenChange,
  changedFieldsCount,
  hasSensitiveChanges,
  onConfirm,
  isSubmitting = false,
}: ChangeReasonDialogProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setError('');
    }
  }, [open]);

  const validate = () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do thay đổi');
      return false;
    }
    if (reason.trim().length < 20) {
      setError('Lý do thay đổi phải ít nhất 20 ký tự để đảm bảo tính rõ ràng');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(reason.trim());
    }
  };

  const handleCancel = () => {
    if (reason.trim() && !confirm('Bạn có chắc muốn hủy? Lý do đã nhập sẽ bị mất.')) {
      return;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle>Lý do thay đổi</DialogTitle>
              <DialogDescription className="mt-1">
                Vui lòng nhập lý do cho {changedFieldsCount} thay đổi này
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Info Notice */}
          {hasSensitiveChanges ? (
            <div className="flex gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-amber-900 mb-1">
                  Thay đổi nhạy cảm - Cần phê duyệt
                </p>
                <p className="text-amber-700">
                  Lý do thay đổi sẽ được gửi kèm yêu cầu phê duyệt và hiển thị trong hồ sơ
                  phê duyệt. Vui lòng mô tả rõ ràng lý do để người phê duyệt có thể đánh giá.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-blue-900 mb-1">Audit Trail</p>
                <p className="text-blue-700">
                  Lý do thay đổi sẽ được ghi vào audit log để truy vết. Vui lòng nhập lý do
                  rõ ràng và cụ thể.
                </p>
              </div>
            </div>
          )}

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="change-reason">
              Lý do thay đổi <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="change-reason"
              className='border-gray-200 p-2 focus:border-primary focus:ring-1 focus:ring-primary resize-y min-h-[100px] disabled:opacity-50 mb-2'
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="VD: Cập nhật địa chỉ mới do cơ sở chuyển văn phòng, điều chỉnh tọa độ GPS sau khảo sát thực tế, cập nhật số giấy phép sau khi gia hạn..."
              rows={5}
              autoFocus
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between mt-2">
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Tối thiểu 20 ký tự. Mô tả rõ ràng lý do và nguồn thông tin.
                </p>
              )}
              <Badge variant="outline" className="text-xs">
                {reason.length} ký tự
              </Badge>
            </div>
          </div>

          {/* Guidelines */}
          <div className="text-xs text-muted-foreground space-y-1 pl-4 border-l-2 border-muted">
            <p className="font-medium">Gợi ý nội dung:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Mô tả thay đổi gì và tại sao</li>
              <li>Nguồn thông tin (nếu có)</li>
              <li>Người yêu cầu thay đổi (nếu không phải bạn)</li>
              <li>Ngày tháng/sự kiện liên quan</li>
            </ul>
          </div>
        </div>

        <DialogFooter className='gap-2'>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} className='hover:!text-white hover:!bg-red-700'>
            Hủy
          </Button>
          <Button className='!text-white' onClick={handleSubmit} disabled={isSubmitting || reason.length < 20}>
            {isSubmitting ? (
              <>
                <span className="mr-2">Đang xử lý...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </>
            ) : (
              'Xác nhận và lưu'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
