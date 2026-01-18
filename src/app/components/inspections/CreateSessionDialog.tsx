import React, { useState } from 'react';
import { Calendar, Users, Store, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../ui/dialog';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import styles from './CreateSessionDialog.module.css';
import { toast } from 'sonner';

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roundId: string;
  roundName: string;
  onCreateSession?: (sessionData: {
    storeId: string;
    storeName: string;
    storeAddress: string;
    inspectorId: string;
    inspectorName: string;
    startDate: string;
    endDate: string;
    notes: string;
  }) => void;
}

// Mock data
const mockStores = [
  {
    id: '1',
    name: 'Cửa hàng Thực phẩm An Khang',
    address: '123 Nguyễn Trãi, Phường Bến Nghé',
  },
  {
    id: '2',
    name: 'Siêu thị mini Phú Thọ',
    address: '456 Lê Hồng Phong, Phường Bến Thành',
  },
  {
    id: '3',
    name: 'Cửa hàng Sức khỏe Việt',
    address: '789 Võ Văn Tần, Phường Nguyễn Thái Bình',
  },
  {
    id: '4',
    name: 'Chợ Bến Thành',
    address: 'Lê Lợi, Phường Bến Thành',
  },
];

const mockInspectors = [
  { id: '1', name: 'Nguyễn Văn A', position: 'Thanh tra viên chính' },
  { id: '2', name: 'Trần Thị B', position: 'Thanh tra viên' },
  { id: '3', name: 'Lê Văn C', position: 'Thanh tra viên' },
  { id: '4', name: 'Phạm Thị D', position: 'Thanh tra viên cấp cao' },
];

export function CreateSessionDialog({
  open,
  onOpenChange,
  roundId,
  roundName,
  onCreateSession,
}: CreateSessionDialogProps) {
  const [formData, setFormData] = useState({
    storeId: '',
    inspectorId: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.storeId) newErrors.storeId = 'Vui lòng chọn cửa hàng';
    if (!formData.inspectorId) newErrors.inspectorId = 'Vui lòng chọn thanh tra viên';
    if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    
    // Validate date range
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit logic
    const selectedStore = mockStores.find((s) => s.id === formData.storeId);
    const selectedInspector = mockInspectors.find((i) => i.id === formData.inspectorId);

    // Call onCreateSession callback if provided
    if (onCreateSession && selectedStore && selectedInspector) {
      onCreateSession({
        storeId: selectedStore.id,
        storeName: selectedStore.name,
        storeAddress: selectedStore.address,
        inspectorId: selectedInspector.id,
        inspectorName: selectedInspector.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes,
      });
    }

    toast.success(`Đã tạo phiên làm việc tại ${selectedStore?.name}`);

    // Reset form
    setFormData({
      storeId: '',
      inspectorId: '',
      startDate: '',
      endDate: '',
      notes: '',
    });
    setErrors({});
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      storeId: '',
      inspectorId: '',
      startDate: '',
      endDate: '',
      notes: '',
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={handleCancel} />
        <DialogHeader>
          <DialogTitle>Tạo phiên làm việc mới</DialogTitle>
          <DialogDescription>
            Lập phiên làm việc cho đợt "{roundName}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className={styles.formBody}>
            {/* Store Selection */}
            <div className={styles.formField}>
              <label className={styles.label}>
                <Store size={16} className={styles.labelIcon} />
                Cửa hàng kiểm tra <span className={styles.required}>*</span>
              </label>
              <Select
                value={formData.storeId}
                onValueChange={(value) => {
                  setFormData({ ...formData, storeId: value });
                  setErrors({ ...errors, storeId: '' });
                }}
              >
                <SelectTrigger className={errors.storeId ? styles.inputError : ''}>
                  <SelectValue placeholder="Chọn cửa hàng..." />
                </SelectTrigger>
                <SelectContent>
                  {mockStores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      <div className={styles.storeOption}>
                        <div className={styles.storeName}>{store.name}</div>
                        <div className={styles.storeAddress}>{store.address}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.storeId && <span className={styles.errorText}>{errors.storeId}</span>}
            </div>

            {/* Inspector Selection */}
            <div className={styles.formField}>
              <label className={styles.label}>
                <Users size={16} className={styles.labelIcon} />
                Thanh tra viên <span className={styles.required}>*</span>
              </label>
              <Select
                value={formData.inspectorId}
                onValueChange={(value) => {
                  setFormData({ ...formData, inspectorId: value });
                  setErrors({ ...errors, inspectorId: '' });
                }}
              >
                <SelectTrigger className={errors.inspectorId ? styles.inputError : ''}>
                  <SelectValue placeholder="Chọn thanh tra viên..." />
                </SelectTrigger>
                <SelectContent>
                  {mockInspectors.map((inspector) => (
                    <SelectItem key={inspector.id} value={inspector.id}>
                      <div className={styles.inspectorOption}>
                        <div className={styles.inspectorName}>{inspector.name}</div>
                        <div className={styles.inspectorPosition}>{inspector.position}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.inspectorId && (
                <span className={styles.errorText}>{errors.inspectorId}</span>
              )}
            </div>

            {/* Date and Time */}
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.label}>
                  <Calendar size={16} className={styles.labelIcon} />
                  Ngày bắt đầu <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  className={`${styles.input} ${errors.startDate ? styles.inputError : ''}`}
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData({ ...formData, startDate: e.target.value });
                    setErrors({ ...errors, startDate: '' });
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.startDate && <span className={styles.errorText}>{errors.startDate}</span>}
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>
                  <Calendar size={16} className={styles.labelIcon} />
                  Ngày kết thúc <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  className={`${styles.input} ${errors.endDate ? styles.inputError : ''}`}
                  value={formData.endDate}
                  onChange={(e) => {
                    setFormData({ ...formData, endDate: e.target.value });
                    setErrors({ ...errors, endDate: '' });
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.endDate && <span className={styles.errorText}>{errors.endDate}</span>}
              </div>
            </div>

            {/* Notes */}
            <div className={styles.formField}>
              <label className={styles.label}>
                <FileText size={16} className={styles.labelIcon} />
                Ghi chú
              </label>
              <textarea
                className={styles.textarea}
                placeholder="Nhập ghi chú về phiên làm việc..."
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="submit">Tạo phiên</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}