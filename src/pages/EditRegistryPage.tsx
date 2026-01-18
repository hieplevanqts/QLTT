import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  X,
  AlertTriangle,
  FileText,
  MapPin,
  FileCheck,
  Building2,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Textarea } from '../app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../app/components/ui/select';
import {
  provinces,
  getDistrictsByProvince,
  getWardsByDistrict,
} from '../data/vietnamLocations';
import { mockStores } from '../data/mockStores';
import styles from './EditRegistryPage.module.css';

interface FieldChange {
  field: string;
  label: string;
  oldValue: string;
  newValue: string;
  isSensitive: boolean;
}

export default function EditRegistryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find store by ID
  const store = mockStores.find((s) => s.id === Number(id));

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: '',
    province: '',
    jurisdiction: '',
    ward: '',
    managementUnit: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    businessLicense: '',
    foodSafetyCert: '',
  });

  const [changeReason, setChangeReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDiffPreview, setShowDiffPreview] = useState(false);

  // Get available districts and wards
  const availableDistricts = useMemo(() => {
    if (!formData.province) return [];
    return getDistrictsByProvince(formData.province);
  }, [formData.province]);

  const availableWards = useMemo(() => {
    if (!formData.province || !formData.jurisdiction) return [];
    const district = availableDistricts.find((d) => d.name === formData.jurisdiction);
    if (!district) return [];
    return getWardsByDistrict(district.code);
  }, [formData.province, formData.jurisdiction, availableDistricts]);

  // Initialize form
  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        address: store.address,
        type: store.type,
        province: store.provinceCode || '79',
        jurisdiction: store.jurisdiction,
        ward: store.wardCode || '',
        managementUnit: store.managementUnit,
        latitude: store.latitude,
        longitude: store.longitude,
        businessLicense: store.businessLicense || '',
        foodSafetyCert: store.foodSafetyCert || '',
      });
    }
  }, [store]);

  if (!store) {
    return (
      <div className={styles.notFound}>
        <h1>Không tìm thấy cơ sở</h1>
        <Button onClick={() => navigate('/registry/stores')}>Quay lại danh sách</Button>
      </div>
    );
  }

  // Detect changes and categorize by sensitivity
  const changes: FieldChange[] = useMemo(() => {
    const detected: FieldChange[] = [];

    // Sensitive fields
    if (formData.name !== store.name) {
      detected.push({
        field: 'name',
        label: 'Tên cơ sở',
        oldValue: store.name,
        newValue: formData.name,
        isSensitive: true,
      });
    }

    if (formData.address !== store.address) {
      detected.push({
        field: 'address',
        label: 'Địa chỉ',
        oldValue: store.address,
        newValue: formData.address,
        isSensitive: true,
      });
    }

    const oldProvince = provinces.find((p) => p.code === store.provinceCode)?.name || '';
    const newProvince = provinces.find((p) => p.code === formData.province)?.name || '';
    if (oldProvince !== newProvince) {
      detected.push({
        field: 'province',
        label: 'Tỉnh/Thành phố',
        oldValue: oldProvince,
        newValue: newProvince,
        isSensitive: true,
      });
    }

    if (formData.jurisdiction !== store.jurisdiction) {
      detected.push({
        field: 'jurisdiction',
        label: 'Quận/Huyện',
        oldValue: store.jurisdiction,
        newValue: formData.jurisdiction,
        isSensitive: true,
      });
    }

    if (formData.latitude !== store.latitude || formData.longitude !== store.longitude) {
      detected.push({
        field: 'coordinates',
        label: 'Tọa độ',
        oldValue: store.latitude && store.longitude ? `${store.latitude}, ${store.longitude}` : 'Chưa có',
        newValue: formData.latitude && formData.longitude ? `${formData.latitude}, ${formData.longitude}` : 'Chưa có',
        isSensitive: true,
      });
    }

    if (formData.businessLicense !== (store.businessLicense || '')) {
      detected.push({
        field: 'businessLicense',
        label: 'Số giấy phép kinh doanh',
        oldValue: store.businessLicense || 'Chưa có',
        newValue: formData.businessLicense || 'Chưa có',
        isSensitive: true,
      });
    }

    if (formData.foodSafetyCert !== (store.foodSafetyCert || '')) {
      detected.push({
        field: 'foodSafetyCert',
        label: 'Chứng nhận ATTP',
        oldValue: store.foodSafetyCert || 'Chưa có',
        newValue: formData.foodSafetyCert || 'Chưa có',
        isSensitive: true,
      });
    }

    // Non-sensitive fields
    if (formData.type !== store.type) {
      detected.push({
        field: 'type',
        label: 'Loại hình',
        oldValue: store.type,
        newValue: formData.type,
        isSensitive: false,
      });
    }

    if (formData.managementUnit !== store.managementUnit) {
      detected.push({
        field: 'managementUnit',
        label: 'Đơn vị quản lý',
        oldValue: store.managementUnit,
        newValue: formData.managementUnit,
        isSensitive: false,
      });
    }

    return detected;
  }, [formData, store]);

  const hasSensitiveChanges = changes.some((c) => c.isSensitive);
  const hasChanges = changes.length > 0;

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
    if (!formData.province) {
      newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    }
    if (!formData.jurisdiction) {
      newErrors.jurisdiction = 'Vui lòng chọn quận/huyện';
    }
    if (!formData.ward) {
      newErrors.ward = 'Vui lòng chọn phường/xã';
    }

    if (hasChanges && !changeReason.trim()) {
      newErrors.changeReason = 'Vui lòng nhập lý do thay đổi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (!hasChanges) {
      alert('Không có thay đổi nào để lưu');
      return;
    }

    // Mock submission
    if (hasSensitiveChanges) {
      alert(
        `Yêu cầu chỉnh sửa đã được gửi đi chờ phê duyệt.\n\n` +
        `Số thay đổi nhạy cảm: ${changes.filter(c => c.isSensitive).length}\n` +
        `Lý do: ${changeReason}\n\n` +
        `Bạn sẽ nhận được thông báo khi yêu cầu được phê duyệt.`
      );
    } else {
      alert('Thay đổi đã được lưu thành công!');
    }

    navigate(`/registry/stores/${id}`);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('Bạn có chắc muốn hủy? Các thay đổi chưa lưu sẽ bị mất.')) {
        navigate(`/registry/stores/${id}`);
      }
    } else {
      navigate(`/registry/stores/${id}`);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Button variant="ghost" onClick={handleCancel} className={styles.backButton}>
          <ArrowLeft size={20} />
          Quay lại
        </Button>

        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <Building2 size={24} className={styles.titleIcon} />
            <div>
              <h1 className={styles.title}>Chỉnh sửa cơ sở</h1>
              <p className={styles.subtitle}>{store.name}</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <Button variant="outline" onClick={handleCancel}>
              <X size={18} />
              Hủy
            </Button>
            {hasChanges && (
              <Button
                variant="outline"
                onClick={() => setShowDiffPreview(!showDiffPreview)}
              >
                <FileText size={18} />
                {showDiffPreview ? 'Ẩn' : 'Xem'} thay đổi ({changes.length})
              </Button>
            )}
            <Button onClick={handleSubmit}>
              <Save size={18} />
              {hasSensitiveChanges ? 'Gửi phê duyệt' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Diff Preview */}
        {showDiffPreview && hasChanges && (
          <Card className={styles.diffCard}>
            <CardHeader>
              <CardTitle className={styles.diffTitle}>
                <FileText size={20} />
                Xem trước thay đổi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasSensitiveChanges && (
                <div className={styles.sensitiveWarning}>
                  <AlertTriangle size={20} />
                  <div>
                    <p className={styles.warningTitle}>Thay đổi nhạy cảm - Cần phê duyệt</p>
                    <p className={styles.warningText}>
                      Bạn đang thay đổi {changes.filter(c => c.isSensitive).length} trường nhạy cảm.
                      Yêu cầu sẽ được gửi đến quản lý để phê duyệt trước khi áp dụng.
                    </p>
                  </div>
                </div>
              )}

              <div className={styles.diffList}>
                <div className={styles.diffHeader}>
                  <div className={styles.headerCell}>Trường</div>
                  <div className={styles.headerCell}>Giá trị cũ</div>
                  <div className={styles.headerCell}>Giá trị mới</div>
                </div>
                {changes.map((change, index) => (
                  <div key={index} className={styles.diffRow}>
                    <div className={styles.fieldName}>
                      <span>{change.label}</span>
                      {change.isSensitive && (
                        <span className={styles.sensitiveBadge}>
                          <AlertTriangle size={12} />
                          Nhạy cảm
                        </span>
                      )}
                    </div>
                    <div className={styles.valueColumn}>
                      <div className={styles.oldValue}>{change.oldValue || '(Trống)'}</div>
                    </div>
                    <div className={styles.valueColumn}>
                      <div className={styles.arrow}>↓</div>
                      <div className={styles.newValue}>{change.newValue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <div className={styles.formGrid}>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className={styles.sectionTitle}>
                <FileText size={20} />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.formSection}>
              <div className={styles.formField}>
                <Label htmlFor="name">
                  Tên cơ sở <span className={styles.required}>*</span>
                  <span className={styles.sensitiveMark}>(Nhạy cảm)</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên cơ sở"
                />
                {errors.name && <p className={styles.error}>{errors.name}</p>}
              </div>

              <div className={styles.formField}>
                <Label htmlFor="type">
                  Loại hình <span className={styles.required}>*</span>
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
                    <SelectItem value="Tiệm bánh">Tiệm bánh</SelectItem>
                    <SelectItem value="Quán trà sữa">Quán trà sữa</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className={styles.error}>{errors.type}</p>}
              </div>

              <div className={styles.formField}>
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
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className={styles.sectionTitle}>
                <MapPin size={20} />
                Thông tin địa điểm
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.formSection}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <Label htmlFor="province">
                    Tỉnh/Thành phố <span className={styles.required}>*</span>
                    <span className={styles.sensitiveMark}>(Nhạy cảm)</span>
                  </Label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        province: value,
                        jurisdiction: '',
                        ward: '',
                      });
                    }}
                  >
                    <SelectTrigger id="province">
                      <SelectValue placeholder="Chọn tỉnh/thành" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.code} value={province.code}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.province && <p className={styles.error}>{errors.province}</p>}
                </div>

                <div className={styles.formField}>
                  <Label htmlFor="jurisdiction">
                    Quận/Huyện <span className={styles.required}>*</span>
                    <span className={styles.sensitiveMark}>(Nhạy cảm)</span>
                  </Label>
                  <Select
                    value={formData.jurisdiction}
                    onValueChange={(val) => {
                      setFormData({
                        ...formData,
                        jurisdiction: val,
                        ward: '',
                      });
                    }}
                    disabled={!formData.province}
                  >
                    <SelectTrigger id="jurisdiction">
                      <SelectValue placeholder="Chọn quận/huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDistricts.map((district) => (
                        <SelectItem key={district.code} value={district.name}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jurisdiction && <p className={styles.error}>{errors.jurisdiction}</p>}
                </div>
              </div>

              <div className={styles.formField}>
                <Label htmlFor="ward">
                  Phường/Xã <span className={styles.required}>*</span>
                  <span className={styles.sensitiveMark}>(Nhạy cảm)</span>
                </Label>
                <Select
                  value={formData.ward}
                  onValueChange={(val) => setFormData({ ...formData, ward: val })}
                  disabled={!formData.jurisdiction}
                >
                  <SelectTrigger id="ward">
                    <SelectValue placeholder="Chọn phường/xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWards.map((ward) => (
                      <SelectItem key={ward.code} value={ward.code}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ward && <p className={styles.error}>{errors.ward}</p>}
              </div>

              <div className={styles.formField}>
                <Label htmlFor="address">
                  Địa chỉ <span className={styles.required}>*</span>
                  <span className={styles.sensitiveMark}>(Nhạy cảm)</span>
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nhập địa chỉ đầy đủ"
                  rows={3}
                />
                {errors.address && <p className={styles.error}>{errors.address}</p>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <Label htmlFor="latitude">
                    Vĩ độ (Latitude)
                    <span className={styles.sensitiveMark}>(Nhạy cảm)</span>
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    min="8"
                    max="23.5"
                    placeholder="VD: 10.762622"
                    value={formData.latitude || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        latitude: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                  />
                </div>

                <div className={styles.formField}>
                  <Label htmlFor="longitude">
                    Kinh độ (Longitude)
                    <span className={styles.sensitiveMark}>(Nhạy cảm)</span>
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    min="102"
                    max="110"
                    placeholder="VD: 106.660172"
                    value={formData.longitude || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longitude: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Information */}
          <Card>
            <CardHeader>
              <CardTitle className={styles.sectionTitle}>
                <FileCheck size={20} />
                Giấy phép & Chứng nhận
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.formSection}>
              <div className={styles.formField}>
                <Label htmlFor="business-license">
                  Số giấy phép kinh doanh
                  <span className={styles.sensitiveMark}>(Nhạy cảm)</span>
                </Label>
                <Input
                  id="business-license"
                  value={formData.businessLicense}
                  onChange={(e) =>
                    setFormData({ ...formData, businessLicense: e.target.value })
                  }
                  placeholder="Nhập số giấy phép"
                />
              </div>

              <div className={styles.formField}>
                <Label htmlFor="food-safety-cert">
                  Chứng nhận ATTP
                  <span className={styles.sensitiveMark}>(Nhạy cảm)</span>
                </Label>
                <Input
                  id="food-safety-cert"
                  value={formData.foodSafetyCert}
                  onChange={(e) =>
                    setFormData({ ...formData, foodSafetyCert: e.target.value })
                  }
                  placeholder="Nhập số chứng nhận"
                />
              </div>
            </CardContent>
          </Card>

          {/* Change Reason */}
          {hasChanges && (
            <Card className={styles.changeReasonCard}>
              <CardHeader>
                <CardTitle className={styles.sectionTitle}>
                  <Clock size={20} />
                  Lý do thay đổi
                  <span className={styles.required}>*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.formField}>
                  <Label htmlFor="change-reason">
                    Vui lòng mô tả lý do thay đổi thông tin cơ sở
                  </Label>
                  <Textarea
                    id="change-reason"
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    placeholder="VD: Cập nhật địa chỉ mới do cơ sở chuyển địa điểm, cập nhật giấy phép sau khi gia hạn..."
                    rows={4}
                  />
                  {errors.changeReason && (
                    <p className={styles.error}>{errors.changeReason}</p>
                  )}
                </div>

                {hasSensitiveChanges && (
                  <div className={styles.approvalNote}>
                    <AlertTriangle size={16} />
                    <p>
                      Thay đổi nhạy cảm sẽ được gửi đến quản lý phê duyệt. 
                      Bạn sẽ nhận được thông báo khi yêu cầu được xử lý.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}