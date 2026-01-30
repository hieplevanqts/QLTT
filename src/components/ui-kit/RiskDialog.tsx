import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, X } from 'lucide-react';

export type RiskLevel = 'low' | 'medium' | 'high';

interface RiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeName: string;
  onConfirm: (data: { level: RiskLevel; reason: string; note: string }) => void;
}

export function RiskDialog({
  open,
  onOpenChange,
  storeName,
  onConfirm,
}: RiskDialogProps) {
  const [level, setLevel] = useState<RiskLevel>('medium');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      return;
    }
    onConfirm({ level, reason, note });
    // Reset form
    setLevel('medium');
    setReason('');
    setNote('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLevel('medium');
    setReason('');
    setNote('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start justify-between w-full">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <DialogTitle>Gắn rủi ro</DialogTitle>
                <DialogDescription className="mt-1">
                  Đánh dấu mức độ rủi ro cho cơ sở: <strong>{storeName}</strong>
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="risk-level">
              Mức độ rủi ro <span className="text-destructive">*</span>
            </Label>
            <Select value={level} onValueChange={(val) => setLevel(val as RiskLevel)}>
              <SelectTrigger id="risk-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Thấp
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    Trung bình
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    Cao
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Lý do <span className="text-destructive">*</span>
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Chọn lý do" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Phát hiện vi phạm an toàn thực phẩm">
                  Phát hiện vi phạm an toàn thực phẩm
                </SelectItem>
                <SelectItem value="Hồ sơ pháp lý không đầy đủ">
                  Hồ sơ pháp lý không đầy đủ
                </SelectItem>
                <SelectItem value="Điều kiện vệ sinh kém">
                  Điều kiện vệ sinh kém
                </SelectItem>
                <SelectItem value="Nguồn gốc xuất xứ không rõ ràng">
                  Nguồn gốc xuất xứ không rõ ràng
                </SelectItem>
                <SelectItem value="Khiếu nại từ người tiêu dùng">
                  Khiếu nại từ người tiêu dùng
                </SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập thông tin bổ sung (nếu có)..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={!reason.trim()}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
