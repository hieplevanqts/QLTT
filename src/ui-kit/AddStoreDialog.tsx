import React, { useState } from 'react';
import { Building2, X } from 'lucide-react';
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

interface AddStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: NewStoreData) => void;
}

export interface NewStoreData {
  name: string;
  type: string;
  address: string;
  jurisdiction: string;
  managementUnit: string;
  ownerName?: string;
  ownerPhone?: string;
  businessLicense?: string;
  notes?: string;
}

export function AddStoreDialog({ open, onOpenChange, onSubmit }: AddStoreDialogProps) {
  const [formData, setFormData] = useState<NewStoreData>({
    name: '',
    type: '',
    address: '',
    jurisdiction: '',
    managementUnit: '',
    ownerName: '',
    ownerPhone: '',
    businessLicense: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      type: '',
      address: '',
      jurisdiction: '',
      managementUnit: '',
      ownerName: '',
      ownerPhone: '',
      businessLicense: '',
      notes: '',
    });
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between w-full">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Thêm cơ sở mới
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin cơ sở kinh doanh để thêm vào hệ thống quản lý
              </DialogDescription>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Thông tin cơ bản
              </h4>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Tên cơ sở <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="VD: Nhà hàng Phở Hà Nội"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">
                      Loại hình <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Chọn loại hình" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nhà hàng">Nhà hàng</SelectItem>
                        <SelectItem value="Quán cà phê">Quán cà phê</SelectItem>
                        <SelectItem value="Cửa hàng thực phẩm">
                          Cửa hàng thực phẩm
                        </SelectItem>
                        <SelectItem value="Siêu thị mini">Siêu thị mini</SelectItem>
                        <SelectItem value="Cửa hàng tạp hóa">
                          Cửa hàng tạp hóa
                        </SelectItem>
                        <SelectItem value="Quán ăn">Quán ăn</SelectItem>
                        <SelectItem value="Tiệm bánh">Tiệm bánh</SelectItem>
                        <SelectItem value="Quán trà sữa">Quán trà sữa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jurisdiction">
                      Địa bàn <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.jurisdiction}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          jurisdiction: value,
                          managementUnit: `Chi cục QLTT ${value}`,
                        });
                      }}
                    >
                      <SelectTrigger id="jurisdiction">
                        <SelectValue placeholder="Chọn địa bàn" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={`Quận ${i + 1}`}>
                            Quận {i + 1}
                          </SelectItem>
                        ))}
                        <SelectItem value="Thủ Đức">Thủ Đức</SelectItem>
                        <SelectItem value="Bình Thạnh">Bình Thạnh</SelectItem>
                        <SelectItem value="Tân Bình">Tân Bình</SelectItem>
                        <SelectItem value="Tân Phú">Tân Phú</SelectItem>
                        <SelectItem value="Phú Nhuận">Phú Nhuận</SelectItem>
                        <SelectItem value="Gò Vấp">Gò Vấp</SelectItem>
                        <SelectItem value="Bình Tân">Bình Tân</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Địa chỉ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP.HCM"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Thông tin chủ cơ sở
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Họ và tên</Label>
                  <Input
                    id="ownerName"
                    placeholder="VD: Nguyễn Văn A"
                    value={formData.ownerName}
                    onChange={(e) =>
                      setFormData({ ...formData, ownerName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Số điện thoại</Label>
                  <Input
                    id="ownerPhone"
                    placeholder="VD: 0901234567"
                    value={formData.ownerPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, ownerPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessLicense">Số giấy phép kinh doanh</Label>
                <Input
                  id="businessLicense"
                  placeholder="VD: 0123456789"
                  value={formData.businessLicense}
                  onChange={(e) =>
                    setFormData({ ...formData, businessLicense: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                placeholder="Nhập thông tin bổ sung..."
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="submit">Thêm cơ sở</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}