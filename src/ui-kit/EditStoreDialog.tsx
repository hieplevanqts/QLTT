import React, { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../app/components/ui/dialog';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../app/components/ui/select';
import { Textarea } from '../app/components/ui/textarea';

interface Store {
  id: number;
  name: string;
  address: string;
  type: string;
  jurisdiction: string;
  managementUnit: string;
}

interface EditStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store | null;
  onConfirm: (data: Partial<Store>) => void;
}

export function EditStoreDialog({
  open,
  onOpenChange,
  store,
  onConfirm,
}: EditStoreDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: '',
    jurisdiction: '',
    managementUnit: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        address: store.address,
        type: store.type,
        jurisdiction: store.jurisdiction,
        managementUnit: store.managementUnit,
      });
      setErrors({});
    }
  }, [store, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Tên cơ sở không được để trống';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
    }
    if (!formData.type) {
      newErrors.type = 'Vui lòng chọn loại hình';
    }
    if (!formData.jurisdiction) {
      newErrors.jurisdiction = 'Vui lòng chọn địa bàn';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    onConfirm(formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start justify-between w-full">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Edit className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <DialogTitle>Chỉnh sửa cơ sở</DialogTitle>
                <DialogDescription className="mt-1">
                  Cập nhật thông tin cơ sở: <strong>{store?.name}</strong>
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
            <Label htmlFor="store-name">
              Tên cơ sở <span className="text-destructive">*</span>
            </Label>
            <Input
              id="store-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập tên cơ sở"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Địa chỉ <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Nhập địa chỉ đầy đủ"
              rows={2}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                Loại hình <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Chọn loại hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nhà hàng">Nhà hàng</SelectItem>
                  <SelectItem value="Quán cà phê">Quán cà phê</SelectItem>
                  <SelectItem value="Cửa hàng thực phẩm">Cửa hàng thực phẩm</SelectItem>
                  <SelectItem value="Siêu thị mini">Siêu thị mini</SelectItem>
                  <SelectItem value="Cửa hàng tạp hóa">Cửa hàng tạp hóa</SelectItem>
                  <SelectItem value="Cửa hàng mỹ phẩm">Cửa hàng mỹ phẩm</SelectItem>
                  <SelectItem value="Quán ăn">Quán ăn</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jurisdiction">
                Địa bàn <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.jurisdiction}
                onValueChange={(val) => setFormData({ ...formData, jurisdiction: val })}
              >
                <SelectTrigger id="jurisdiction">
                  <SelectValue placeholder="Chọn địa bàn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quận 1">Quận 1</SelectItem>
                  <SelectItem value="Quận 2">Quận 2</SelectItem>
                  <SelectItem value="Quận 3">Quận 3</SelectItem>
                  <SelectItem value="Quận 4">Quận 4</SelectItem>
                  <SelectItem value="Quận 5">Quận 5</SelectItem>
                  <SelectItem value="Quận 6">Quận 6</SelectItem>
                  <SelectItem value="Quận 7">Quận 7</SelectItem>
                  <SelectItem value="Quận 8">Quận 8</SelectItem>
                  <SelectItem value="Quận 10">Quận 10</SelectItem>
                  <SelectItem value="Quận 11">Quận 11</SelectItem>
                  <SelectItem value="Quận 12">Quận 12</SelectItem>
                </SelectContent>
              </Select>
              {errors.jurisdiction && (
                <p className="text-sm text-destructive">{errors.jurisdiction}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="management-unit">Đơn vị quản lý</Label>
            <Input
              id="management-unit"
              value={formData.managementUnit}
              onChange={(e) =>
                setFormData({ ...formData, managementUnit: e.target.value })
              }
              placeholder="Chi cục QLTT..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleConfirm}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}