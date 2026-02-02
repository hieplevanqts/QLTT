import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../layouts/PageHeader';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Textarea } from '../app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../app/components/ui/select';
import { Badge } from '../app/components/ui/badge';
import { Store, getStoreById, updateStore } from '../data/mockStores';
import { provinces, getDistrictsByProvince, getWardsByDistrict } from '../data/vietnamLocations';
import { DiffPreviewSection, FieldChange } from '../ui-kit/DiffPreviewSection';
import { ChangeReasonDialog } from '../ui-kit/ChangeReasonDialog';
import { SensitiveFieldWarning } from '../ui-kit/SensitiveFieldWarning';
import { MapLocationPicker } from '../ui-kit/MapLocationPicker';
import styles from './FullEditRegistryPage.module.css';

// Define sensitive fields that require approval
const SENSITIVE_FIELDS = new Set([
  'address',
  'registeredAddress',
  'headquarterAddress',
  'productionAddress',
  'province',
  'provinceCode',
  'ward',
  'wardCode',
  'latitude',
  'longitude',
  'businessLicense',
  'facilityType',
  'type',
  'managementUnit',
]);

// Industry categories
const INDUSTRY_CATEGORIES = [
  { value: 'retail', label: 'Bán lẻ tạp hóa' },
  { value: 'fresh-food', label: 'Thực phẩm tươi sống' },
  { value: 'processed-food', label: 'Thực phẩm chế biến' },
  { value: 'consumer-goods', label: 'Hàng tiêu dùng' },
  { value: 'electronics', label: 'Điện máy - Điện tử' },
  { value: 'fashion', label: 'Thời trang - Phụ kiện' },
  { value: 'furniture', label: 'Nội thất - Gia dụng' },
  { value: 'construction', label: 'Vật liệu xây dựng' },
  { value: 'pharmacy', label: 'Dược phẩm - Y tế' },
  { value: 'cosmetics', label: 'Mỹ phẩm - Làm đẹp' },
  { value: 'restaurant', label: 'Nhà hàng - Ăn uống' },
  { value: 'service', label: 'Dịch vụ' },
  { value: 'other', label: 'Khác' },
];

// Operation status options
const OPERATION_STATUS_OPTIONS = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'suspended', label: 'Tạm ngừng' },
  { value: 'inactive', label: 'Không hoạt động' },
];

const FIELD_LABELS: Record<string, string> = {
  name: 'Tên cơ sở',
  type: 'Loại hình',
  facilityType: 'Loại hình cơ sở',
  address: 'Địa chỉ',
  registeredAddress: 'Địa chỉ đăng ký kinh doanh',
  headquarterAddress: 'Địa chỉ trụ sở chính',
  productionAddress: 'Địa chỉ cơ sở sản xuất',
  province: 'Tỉnh/Thành phố',
  ward: 'Phường/Xã',
  latitude: 'Vĩ độ',
  longitude: 'Kinh độ',
  businessLicense: 'Số giấy phép kinh doanh',
  managementUnit: 'Đơn vị quản lý',
  ownerName: 'Tên chủ cơ sở',
  phone: 'Số điện thoại',
  email: 'Email',
  taxCode: 'Mã số thuế',
  industryName: 'Ngành kinh doanh',
  establishedDate: 'Ngày thành lập',
  operationStatus: 'Trạng thái hoạt động',
  businessPhone: 'SĐT hộ kinh doanh',
  businessArea: 'Diện tích (m²)',
  website: 'Website',
  fax: 'Fax',
  ownerBirthYear: 'Năm sinh chủ hộ',
  ownerIdNumber: 'Số CMND/CCCD',
  ownerPhone: 'SĐT chủ hộ',
  branchPhone: 'Điện thoại cơ sở',
  locationPrecision: 'Độ chính xác vị trí',
  locationConfidence: 'Độ tin cậy vị trí',
  notes: 'Ghi chú',
  tags: 'Tags',
};

type EditStep = 'form' | 'diff-preview';

export default function FullEditRegistryPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [step, setStep] = useState<EditStep>('form');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const [originalStore, setOriginalStore] = useState<Store | null>(null);
  const [showReasonDialog, setShowReasonDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Store>>({});
  const [tagInput, setTagInput] = useState('');

  // Location cascading
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  // Load store data
  useEffect(() => {
    const loadStore = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const store = getStoreById(Number(id));
        if (!store) {
          toast.error('Không tìm thấy cơ sở');
          navigate('/registry/stores');
          return;
        }

        setOriginalStore(store);
        setFormData(store);

        // Initialize location selects
        if (store.provinceCode) {
          setSelectedProvince(store.provinceCode);
          const districtList = getDistrictsByProvince(store.provinceCode);
          setDistricts(districtList);

          if (store.jurisdictionCode) {
            setSelectedDistrict(store.jurisdictionCode);
            const wardList = getWardsByDistrict(store.jurisdictionCode);
            setWards(wardList);
          }
        }
      } catch (error) {
        console.error('Error loading store:', error);
        toast.error('Không thể tải dữ liệu cơ sở');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadStore();
    }
  }, [id, navigate]);

  // Detect changes
  const changes = useMemo((): FieldChange[] => {
    if (!originalStore) return [];

    const changedFields: FieldChange[] = [];

    Object.keys(formData).forEach((key) => {
      const oldValue = (originalStore as any)[key];
      const newValue = (formData as any)[key];

      // Skip if values are equal
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
        return;
      }

      // Skip internal fields
      if (
        key === 'id' ||
        key === 'legalDocuments' ||
        key === 'status' ||
        key === 'riskLevel' ||
        key === 'lastInspection'
      ) {
        return;
      }

      changedFields.push({
        field: key,
        label: FIELD_LABELS[key] || key,
        oldValue,
        newValue,
        isSensitive: SENSITIVE_FIELDS.has(key),
      });
    });

    return changedFields;
  }, [originalStore, formData]);

  const hasSensitiveChanges = changes.some((c) => c.isSensitive);
  const sensitiveFieldsChanged = changes.filter((c) => c.isSensitive).map((c) => c.label);

  // Handlers
  const handleProvinceChange = (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    const province = provinces.find((p) => p.code === provinceCode);
    
    // Get all districts for this province
    const districtList = getDistrictsByProvince(provinceCode);
    setDistricts(districtList);
    
    // Get all wards from all districts in this province
    const allWards: any[] = [];
    districtList.forEach((district) => {
      const wardList = getWardsByDistrict(district.code);
      allWards.push(...wardList);
    });
    setWards(allWards);
    
    setFormData({
      ...formData,
      provinceCode,
      province: province?.name || '',
      wardCode: '',
      ward: '',
    });
  };

  const handleWardChange = (wardCode: string) => {
    const ward = wards.find((w) => w.code === wardCode);

    setFormData({
      ...formData,
      wardCode,
      ward: ward?.name || '',
    });
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !(formData.tags || []).includes(tag)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((t) => t !== tagToRemove),
    });
  };

  const handleCancel = () => {
    if (changes.length > 0) {
      if (
        confirm(
          'Bạn có chắc muốn hủy? Tất cả thay đổi chưa lưu sẽ bị mất.\n\nSố thay đổi: ' +
            changes.length +
            ' trường'
        )
      ) {
        navigate(`/registry/stores/${id}`);
      }
    } else {
      navigate(`/registry/stores/${id}`);
    }
  };

  const handleShowDiffPreview = () => {
    if (changes.length === 0) {
      toast.error('Không có thay đổi nào để lưu');
      return;
    }

    setStep('diff-preview');
  };

  const handleConfirmDiff = () => {
    setShowReasonDialog(true);
  };

  const handleSubmitWithReason = async (reason: string) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create audit log
      const auditLog = {
        storeId: originalStore?.id,
        storeName: originalStore?.name,
        changes,
        changeReason: reason,
        changedBy: 'Current User', // In production, get from auth
        changedAt: new Date().toISOString(),
        hasSensitiveChanges,
      };

      console.log('📝 Audit Log:', auditLog);

      if (hasSensitiveChanges) {
        // Create approval request
        const approvalRequest = {
          id: Date.now(),
          type: 'full-edit',
          storeId: originalStore?.id,
          storeName: originalStore?.name,
          changes,
          changeReason: reason,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          submittedBy: 'Current User',
        };

        console.log('🔐 Approval Request Created:', approvalRequest);

        // In production: Save approval request to backend
        // Don't update store data yet - wait for approval

        toast.success('Thay đổi đã được gửi và đang chờ phê duyệt', {
          description:
            'Các thay đổi nhạy cảm cần được phê duyệt trước khi có hiệu lực. Bạn sẽ nhận được thông báo khi yêu cầu được xử lý.',
          duration: 5000,
        });
      } else {
        // No sensitive changes - update immediately
        updateStore(Number(id), formData);

        console.log('✅ Store Updated Immediately:', formData);

        toast.success('Cập nhật cơ sở thành công', {
          description: 'Thông tin cơ sở đã được cập nhật.',
        });
      }

      setShowReasonDialog(false);
      navigate(`/registry/stores/${id}`);
    } catch (error) {
      console.error('Error submitting changes:', error);
      toast.error('Có lỗi xảy ra khi lưu thay đổi');
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  // No permission
  if (!hasPermission) {
    return (
      <div className={styles.pageContainer}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Không có quyền truy cập</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Bạn không có quyền Chỉnh sửa thông tin cơ sở này.
                  </p>
                </div>
                <Button onClick={() => navigate(`/registry/stores/${id}`)}>
                  Quay lại chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not found
  if (!originalStore) {
    return (
      <div className={styles.pageContainer}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Không tìm thấy cơ sở</p>
            <Button onClick={() => navigate('/registry/stores')}>
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Cơ sở quản lý', href: '/registry/stores' },
          { label: originalStore.name, href: `/registry/stores/${id}` },
          { label: 'Chỉnh sửa' },
        ]}
        title="Chỉnh sửa"
        subtitle={originalStore.name}
        actions={
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft size={16} />
            Quay lại
          </Button>
        }
      />

      {step === 'form' && (
        <>
          {/* Sensitive Field Warning */}
          <SensitiveFieldWarning
            show={hasSensitiveChanges}
            sensitiveFieldsChanged={sensitiveFieldsChanged}
            className="mb-6"
          />

          {/* Change Counter */}
          {changes.length > 0 && (
            <div className="mb-6 flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <CheckCircle className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-blue-900">
                  Đã thay đổi {changes.length} trường
                </p>
                <p className="text-blue-700">
                  Nhấn "Xem trước thay đổi" để rà soát trước khi lưu
                </p>
              </div>
              <Button size="sm" onClick={handleShowDiffPreview}>
                Xem trước thay đổi
              </Button>
            </div>
          )}

          <div className="space-y-6">
            {/* Section 1: Thông tin định danh */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin định danh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Tên cơ sở <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">
                      Loại hình <Badge variant="outline" className="ml-2"><Shield className="h-3 w-3 mr-1" />Nhạy cảm</Badge>
                    </Label>
                    <Input
                      id="type"
                      value={formData.type || ''}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Tên chủ cơ sở</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName || ''}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxCode">Mã số thuế</Label>
                    <Input
                      id="taxCode"
                      value={formData.taxCode || ''}
                      onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Giấy phép & pháp lý */}
            <Card>
              <CardHeader>
                <CardTitle>Giấy phép & pháp lý</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessLicense">
                      Số giấy phép kinh doanh <Badge variant="outline" className="ml-2"><Shield className="h-3 w-3 mr-1" />Nhạy cảm</Badge>
                    </Label>
                    <Input
                      id="businessLicense"
                      value={formData.businessLicense || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, businessLicense: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industryName">Ngành kinh doanh</Label>
                    <Select
                      value={formData.industryName || ''}
                      onValueChange={(value) =>
                        setFormData({ ...formData, industryName: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngành kinh doanh" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="establishedDate">Ngày thành lập</Label>
                    <Input
                      id="establishedDate"
                      type="date"
                      value={formData.establishedDate || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, establishedDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operationStatus">Trạng thái hoạt động</Label>
                    <Select
                      value={formData.operationStatus || ''}
                      onValueChange={(value) =>
                        setFormData({ ...formData, operationStatus: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái hoạt động" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPERATION_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessArea">Diện tích (m²)</Label>
                    <Input
                      id="businessArea"
                      value={formData.businessArea || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, businessArea: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Địa chỉ & địa bàn */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Địa chỉ & địa bàn
                  <Badge variant="outline" className="ml-2"><Shield className="h-3 w-3 mr-1" />Nhạy cảm</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Tỉnh/Thành phố</Label>
                    <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province.code} value={province.code}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ward">Phường/Xã</Label>
                    <Select
                      value={formData.wardCode || ''}
                      onValueChange={handleWardChange}
                      disabled={!selectedProvince}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedProvince ? "Chọn phường/xã" : "Chọn tỉnh/thành trước"} />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem key={ward.code} value={ward.code}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="managementUnit">Đơn vị quản lý</Label>
                    <Input
                      id="managementUnit"
                      value={formData.managementUnit || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, managementUnit: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registeredAddress">Địa chỉ đăng ký kinh doanh</Label>
                  <Input
                    id="registeredAddress"
                    value={formData.registeredAddress || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, registeredAddress: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Định vị & bản đồ */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Định vị & bản đồ
                  <Badge variant="outline" className="ml-2"><Shield className="h-3 w-3 mr-1" />Nhạy cảm</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MapLocationPicker
                  address={formData.address || ''}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onLocationChange={(location) => {
                    setFormData({
                      ...formData,
                      latitude: location.latitude,
                      longitude: location.longitude,
                      ...(location.address && { address: location.address }),
                    });
                  }}
                />

                {/* Optional precision fields */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="locationPrecision">Độ chính xác vị trí</Label>
                    <Input
                      id="locationPrecision"
                      value={formData.locationPrecision || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, locationPrecision: e.target.value })
                      }
                      placeholder="Ví dụ: Chính xác đến số nhà"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locationConfidence">Độ tin cậy vị trí</Label>
                    <Input
                      id="locationConfidence"
                      value={formData.locationConfidence || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, locationConfidence: e.target.value })
                      }
                      placeholder="Ví dụ: Cao, Trung bình, Thấp"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 5: Tags & Ghi chú */}
            <Card>
              <CardHeader>
                <CardTitle>Tags & Ghi chú</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Nhập tag và Enter"
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      Thêm
                    </Button>
                  </div>
                  {(formData.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(formData.tags || []).map((tag) => (
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

                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fixed CTA Bar */}
          <div className="sticky bottom-0 mt-6 p-4 bg-background border-t border-border shadow-lg">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="text-sm text-muted-foreground">
                {changes.length > 0 ? (
                  <>
                    <strong>{changes.length}</strong> trường đã thay đổi
                    {hasSensitiveChanges && (
                      <> • <span className="text-amber-600 font-medium">{sensitiveFieldsChanged.length} nhạy cảm</span></>
                    )}
                  </>
                ) : (
                  'Chưa có thay đổi'
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleCancel}>
                  <X size={16} />
                  Hủy
                </Button>
                <Button onClick={handleShowDiffPreview} disabled={changes.length === 0}>
                  <Save size={16} />
                  Xem trước thay đổi
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {step === 'diff-preview' && (
        <>
          <Card>
            <CardContent className="pt-6">
              <DiffPreviewSection
                changes={changes}
                storeName={originalStore.name}
              />
            </CardContent>
          </Card>

          {/* Fixed CTA Bar */}
          <div className="sticky bottom-0 mt-6 p-4 bg-background border-t border-border shadow-lg">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="text-sm text-muted-foreground">
                Vui lòng rà soát kỹ các thay đổi trước khi xác nhận
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('form')}>
                  <ArrowLeft size={16} />
                  Quay lại chỉnh sửa
                </Button>
                <Button onClick={handleConfirmDiff}>
                  <CheckCircle size={16} />
                  Xác nhận và tiếp tục
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Change Reason Dialog */}
      <ChangeReasonDialog
        open={showReasonDialog}
        onOpenChange={setShowReasonDialog}
        changedFieldsCount={changes.length}
        hasSensitiveChanges={hasSensitiveChanges}
        onConfirm={handleSubmitWithReason}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}