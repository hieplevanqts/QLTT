import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Info } from 'lucide-react';

export type ConfirmVariant = 'default' | 'danger' | 'warning';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  requireDoubleConfirm?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  variant = 'default',
  onConfirm,
  requireDoubleConfirm = false,
}: ConfirmDialogProps) {
  const [firstConfirm, setFirstConfirm] = React.useState(false);

  const handleConfirm = () => {
    console.log('🔵 ConfirmDialog: handleConfirm called', { requireDoubleConfirm, firstConfirm });
    if (requireDoubleConfirm && !firstConfirm) {
      setFirstConfirm(true);
      return;
    }
    console.log('🔵 ConfirmDialog: Calling onConfirm');
    onConfirm();
    setFirstConfirm(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFirstConfirm(false);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            {variant === 'danger' && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            )}
            {variant === 'warning' && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
            )}
            {variant === 'default' && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Info className="h-5 w-5 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <AlertDialogTitle>
                {firstConfirm ? 'Xác nhận lần 2' : title}
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                {firstConfirm
                  ? 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?'
                  : description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              variant === 'danger'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : variant === 'warning'
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : ''
            }
          >
            {firstConfirm ? 'Xác nhận lần 2' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
