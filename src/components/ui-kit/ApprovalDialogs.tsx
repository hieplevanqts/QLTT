import React, { useState } from 'react';
import { CheckCircle2, XCircle, X, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import styles from './ApprovalDialogs.module.css';

// ============================================================================
// APPROVE DIALOG
// ============================================================================

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeName: string;
  onConfirm: () => void;
}

export function ApproveDialog({
  open,
  onOpenChange,
  storeName,
  onConfirm,
}: ApproveDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.dialogHeader}>
          <DialogHeader>
            <div className={styles.iconWrapper}>
              <div className={styles.approveIcon}>
                <CheckCircle2 size={24} />
              </div>
            </div>
            <DialogTitle className={styles.title}>Phê duyệt cửa hàng</DialogTitle>
            <DialogDescription className={styles.description}>
              Bạn đang phê duyệt cửa hàng <strong>"{storeName}"</strong>.
              <br />
              Sau khi phê duyệt, cửa hàng sẽ chuyển sang trạng thái "Đang hoạt động".
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        <DialogFooter className={styles.footer}>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={styles.approveButton}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận phê duyệt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// REJECT DIALOG
// ============================================================================

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeName: string;
  onConfirm: (reason: string) => void;
}

export function RejectDialog({
  open,
  onOpenChange,
  storeName,
  onConfirm,
}: RejectDialogProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = reason.trim().length >= 10;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <div className={styles.iconWrapper}>
            <div className={styles.rejectIcon}>
              <XCircle size={24} />
            </div>
          </div>
          <DialogTitle className={styles.title}>Từ chối phê duyệt</DialogTitle>
          <DialogDescription className={styles.description}>
            Bạn đang từ chối phê duyệt cửa hàng <strong>"{storeName}"</strong>.
            <br />
            Sau khi từ chối, cửa hàng sẽ chuyển sang trạng thái "Từ chối phê duyệt".
          </DialogDescription>
        </DialogHeader>

        <div className={styles.formContent}>
          {/* Reason Input */}
          <div className={styles.formField}>
            <Label htmlFor="reject-reason" className={styles.label}>
              Lý do từ chối <span className={styles.required}>*</span>
            </Label>
            <Textarea
              id="reject-reason"
              placeholder="Nhập lý do từ chối phê duyệt (tối thiểu 10 ký tự)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={styles.textarea}
              rows={4}
            />
            <div className={styles.helperText}>
              {reason.trim().length}/10 ký tự tối thiểu
            </div>
          </div>
        </div>

        <DialogFooter className={styles.footer}>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className={styles.rejectButton}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
