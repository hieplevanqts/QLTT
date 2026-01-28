import React, { useState, useEffect } from 'react';
import { Edit, X, AlertCircle, Clock, Check, CheckCircle2, XCircle } from 'lucide-react';
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
import { Textarea } from '../app/components/ui/textarea';
import { Badge } from '../app/components/ui/badge';
import { FacilityStatus } from './FacilityStatusBadge';
import { updateMerchant } from '../utils/api/storesApi';
import { toast } from 'sonner';

interface Store {
  id: number;
  merchantId?: string; // UUID from API
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  tags?: string[];
  status?: FacilityStatus;
  // Additional editable fields
  ownerName?: string;
  ownerPhone?: string;
  businessPhone?: string;
  businessEmail?: string;
  website?: string;
  ownerPhone2?: string;
  ownerBirthYear?: number;
  ownerIdNumber?: string;
  ownerEmail?: string;
  businessType?: string;
  provinceCode?: string;
  wardCode?: string;
  latitude?: number;
  longitude?: number;
  // Fields NOT editable in Quick Edit
  address: string;
  type: string;
  jurisdiction: string;
  managementUnit: string;
}

interface QuickEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store | null;
  onConfirm: (data: QuickEditData) => void;
  hasPermission?: boolean;
  onApprove?: (storeId: number) => void;
  onReject?: (storeId: number) => void;
}

export interface QuickEditData {
  name: string;
  phone: string;
  email: string;
  notes: string;
  tags: string[];
  changeReason: string;
  // Additional fields from API
  ownerName?: string;
  ownerPhone?: string;
  businessPhone?: string;
  businessEmail?: string;
  website?: string;
  ownerPhone2?: string;
  ownerBirthYear?: number;
  ownerIdNumber?: string;
  ownerEmail?: string;
}

type EditStep = 'form' | 'reason';

/**
 * Quick Edit Dialog - ONLY for non-sensitive fields with approval workflow
 * 
 * Editable fields:
 * - Tên cơ sở
 * - Tags
 * - Ghi chú
 * - Thông tin liên hệ cơ bản (phone, email)
 * 
 * Workflow:
 * 1. User edits fields
 * 2. User submits → Show reason step (required)
 * 3. Submit creates Approval Request
 * 4. Changes take effect after approval
 */
export function QuickEditDialog({
  open,
  onOpenChange,
  store,
  onConfirm,
  hasPermission = true,
  onApprove,
  onReject,
}: QuickEditDialogProps) {
  const [step, setStep] = useState<EditStep>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    tags: [] as string[],
    // Additional fields
    ownerName: '',
    ownerPhone: '',
    businessPhone: '',
    businessEmail: '',
    website: '',
    ownerPhone2: '',
    ownerBirthYear: undefined as number | undefined,
    ownerIdNumber: '',
    ownerEmail: '',
  });

  const [changeReason, setChangeReason] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with store data when dialog opens
  useEffect(() => {
    if (open && store) {
      setFormData({
        name: store.name,
        phone: store.phone || '',
        email: store.email || '',
        notes: store.notes || '',
        tags: store.tags || [],
        // Additional fields
        ownerName: store.ownerName || '',
        ownerPhone: store.ownerPhone || '',
        businessPhone: store.businessPhone || '',
        businessEmail: store.businessEmail || '',
        website: store.website || '',
        ownerPhone2: store.ownerPhone2 || '',
        ownerBirthYear: store.ownerBirthYear,
        ownerIdNumber: store.ownerIdNumber || '',
        ownerEmail: store.ownerEmail || '',
      });
      setChangeReason('');
      setTagInput('');
      setErrors({});
      setStep('form');
    }
  }, [store, open]);

  // Detect changes
  const getChangedFields = (): string[] => {
    if (!store) return [];
    const changed: string[] = [];

    if (formData.name !== store.name) changed.push('Tên cơ sở');
    if (formData.phone !== (store.phone || '')) changed.push('Số điện thoại');
    if (formData.email !== (store.email || '')) changed.push('Email');
    if (formData.notes !== (store.notes || '')) changed.push('Ghi chú');
    if (JSON.stringify(formData.tags) !== JSON.stringify(store.tags || [])) {
      changed.push('Tags');
    }

    return changed;
  };

  const changedFields = getChangedFields();
  const hasChanges = changedFields.length > 0;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên cơ sở không được để trống';
    }

    // Basic email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Basic phone validation (Vietnamese phone numbers)
    if (formData.phone && !/^(0|\+84)[0-9]{9,10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReason = () => {
    const newErrors: Record<string, string> = {};

    if (!changeReason.trim()) {
      newErrors.changeReason = 'Vui lòng nhập lý do chỉnh sửa';
    } else if (changeReason.trim().length < 10) {
      newErrors.changeReason = 'Lý do chỉnh sửa phải ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validate()) return;

    if (!hasChanges) {
      setErrors({ form: 'Không có thay đổi nào để lưu' });
      return;
    }

    setStep('reason');
  };

  const handleSubmit = async () => {
    if (!validateReason()) return;

    setIsSubmitting(true);

    try {
      // Call API to update merchant if merchantId exists
      if (store?.merchantId) {
        const updatePayload = {
          p_business_name: formData.name,
          p_owner_name: formData.ownerName,
          p_owner_phone: formData.ownerPhone,
          p_business_phone: formData.businessPhone,
          p_business_email: formData.businessEmail,
          p_website: formData.website,
          p_owner_phone_2: formData.ownerPhone2,
          p_owner_birth_year: formData.ownerBirthYear,
          p_owner_identity_no: formData.ownerIdNumber,
          p_owner_email: formData.ownerEmail,
          p_note: formData.notes,
        };

        await updateMerchant(store.merchantId, updatePayload);
        toast.success('Cập nhật cơ sở thành công');
      }

      // Call onConfirm with form data
      onConfirm({
        ...formData,
        changeReason,
      });

      setIsSubmitting(false);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating merchant:', error);
      toast.error('Lỗi khi cập nhật cơ sở: ' + error.message);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges && step === 'form') {
      if (confirm('Bạn có chắc muốn hủy? Các thay đổi chưa lưu sẽ bị mất.')) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  const handleBack = () => {
    setStep('form');
    setErrors({});
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!hasPermission) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle>Không có quyền truy cập</DialogTitle>
                <DialogDescription className="mt-1">
                  Bạn không có quyền chỉnh sửa thông tin cơ sở này.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCancel}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between w-full">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                {step === 'form' ? (
                  <Edit className="h-5 w-5 text-primary" />
                ) : (
                  <Clock className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <DialogTitle>
                  {step === 'form' ? 'Chỉnh sửa nhanh' : 'Xác nhận thay đổi'}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {step === 'form' ? (
                    <>
                      Cập nhật thông tin cơ bản: <strong>{store?.name}</strong>
                    </>
                  ) : (
                    'Vui lòng nhập lý do chỉnh sửa trước khi gửi phê duyệt'
                  )}
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {step === 'form' && (
          <>
            {/* Quick Edit Notice */}
            <div className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-blue-900 mb-1">Chỉnh sửa nhanh - Cần phê duyệt</p>
                <p className="text-blue-700">
                  Các thay đổi sẽ được gửi đến quản lý phê duyệt và chỉ có hiệu lực sau khi được duyệt. 
                  Để chỉnh sửa địa chỉ, tọa độ hoặc loại hình, vui lòng sử dụng{' '}
                  <strong>Chỉnh sửa đầy đủ</strong>.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 py-4">
              {/* Tên cơ sở */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên cơ sở <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên cơ sở"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại chủ hộ</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0123456789"
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-phone">Số điện thoại cơ sở</Label>
                  <Input
                    id="business-phone"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                    placeholder="028xxxxxxxx"
                  />
                </div>
              </div>

              {/* Email & Owner Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-email">Email cơ sở</Label>
                  <Input
                    id="business-email"
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                    placeholder="example@email.com"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner-email">Email chủ hộ</Label>
                  <Input
                    id="owner-email"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    placeholder="owner@email.com"
                  />
                </div>
              </div>

              {/* Owner Information */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h4 className="text-sm font-medium">Thông tin chủ hộ kinh doanh</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner-name">Tên chủ hộ</Label>
                    <Input
                      id="owner-name"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner-birth-year">Năm sinh</Label>
                    <Input
                      id="owner-birth-year"
                      type="number"
                      value={formData.ownerBirthYear || ''}
                      onChange={(e) => setFormData({ ...formData, ownerBirthYear: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="1990"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner-phone2">Số điện thoại thứ 2</Label>
                    <Input
                      id="owner-phone2"
                      value={formData.ownerPhone2}
                      onChange={(e) => setFormData({ ...formData, ownerPhone2: e.target.value })}
                      placeholder="0987654321"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner-id">CMND/CCCD</Label>
                    <Input
                      id="owner-id"
                      value={formData.ownerIdNumber}
                      onChange={(e) => setFormData({ ...formData, ownerIdNumber: e.target.value })}
                      placeholder="079123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Website & Other Info */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tag-input">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tag-input"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tag và Enter"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Thêm
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
                <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  className='border border-gray-300'
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Nhập ghi chú về cơ sở..."
                  rows={3}
                />
                </div>

              {/* Read-only Reference Fields */}
              <div className="pt-4 border-t border-border space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Thông tin tham khảo (không thể chỉnh sửa nhanh)
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Loại hình</Label>
                    <div className="px-3 py-2 rounded-md bg-muted text-sm">{store?.type}</div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Địa bàn</Label>
                    <div className="px-3 py-2 rounded-md bg-muted text-sm">
                      {store?.jurisdiction}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Địa chỉ</Label>
                  <div className="px-3 py-2 rounded-md bg-muted text-sm">{store?.address}</div>
                </div>
              </div>

              {errors.form && (
                <div className="flex gap-2 p-3 rounded-md bg-destructive/10 border border-destructive">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{errors.form}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              {(store?.status === 'pending' || store?.status === 'rejected') && onApprove && onReject && (
                <>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      if (store) {
                        onReject(store.id);
                        onOpenChange(false);
                      }
                    }}
                  >
                    <XCircle size={16} />
                    Từ chối
                  </Button>
                  <Button 
                    onClick={() => {
                      if (store) {
                        onApprove(store.id);
                        onOpenChange(false);
                      }
                    }}
                  >
                    <CheckCircle2 size={16} />
                    Phê duyệt
                  </Button>
                </>
              )}
              {store?.status !== 'pending' && store?.status !== 'rejected' && (
                <Button onClick={handleNextStep} disabled={!hasChanges}>
                  Tiếp tục
                  {hasChanges && (
                    <Badge variant="secondary" className="ml-2">
                      {changedFields.length}
                    </Badge>
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        )}

        {step === 'reason' && (
          <>
            {/* Changed Fields Summary */}
            <div className="space-y-3 py-4">
              <div className="flex gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-amber-900 mb-1">
                    Tóm tắt thay đổi ({changedFields.length} trường)
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {changedFields.map((field) => (
                      <Badge key={field} variant="outline" className="bg-white">
                        <Check className="h-3 w-3 mr-1" />
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Change Reason */}
              <div className="space-y-2">
                <Label htmlFor="change-reason">
                  Lý do chỉnh sửa <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="change-reason"
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="VD: Cập nhật thông tin liên hệ mới của chủ cơ sở, thêm tags phân loại, cập nhật ghi chú sau thanh tra..."
                  rows={4}
                  autoFocus
                />
                {errors.changeReason && (
                  <p className="text-sm text-destructive">{errors.changeReason}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Lý do chỉnh sửa sẽ được ghi lại trong audit log và hiển thị trong yêu cầu phê duyệt.
                </p>
              </div>

              {/* Approval Notice */}
              <div className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-blue-900 mb-1">Quy trình phê duyệt</p>
                  <p className="text-blue-700">
                    Thay đổi sẽ được gửi đến quản lý để phê duyệt. Trong thời gian chờ duyệt, 
                    dữ liệu cũ vẫn được hiển thị và cơ sở sẽ có badge{' '}
                    <span className="font-semibold">"Đang chờ phê duyệt"</span>.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                Quay lại
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Đang gửi...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  'Gửi phê duyệt'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}