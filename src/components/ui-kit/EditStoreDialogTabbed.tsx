// This component is a duplicate of AddStoreDialogTabbed but pre-fills data from existing store
// Based on AddStoreDialogTabbed.tsx - same structure but for editing

import { useState, useEffect } from 'react';
import {
  Building2,
  FileText,
  Users,
  MapPin,
  XCircle,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { fetchProvinces, fetchWardsByProvince, type ProvinceApiData, type WardApiData } from '@/utils/api/locationsApi';
import { INDUSTRIES } from '@/utils/data/industries';
import { toast } from 'sonner';
import styles from './AddStoreDialogTabbed.module.css';
import comboboxStyles from './IndustryCombobox.module.css';
import { MapLocationPicker } from './MapLocationPicker';

interface Store {
  id: number;
  merchantId?: string;
  name: string;
  taxCode?: string;
  businessType?: string;
  establishedDate?: string;
  businessPhone?: string;
  notes?: string;
  ownerName?: string;
  ownerBirthYear?: number;
  ownerIdNumber?: string;
  ownerPhone?: string;
  ownerPhone2?: string;
  address?: string;
  provinceCode?: string;
  wardCode?: string;
  latitude?: number;
  longitude?: number;
  province?: string;
  ward?: string;
}

interface EditStoreDialogTabbedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store | null;
  onSubmit?: (data: EditStoreData) => void;
}

export interface EditStoreData {
  business_name: string;
  taxCode?: string;
  industryName?: string;
  establishedDate?: string;
  operationStatus?: string;
  businessPhone: string; // Required
  notes?: string;
  ownerName?: string;
  ownerBirthYear?: string;
  ownerIdNumber?: string;
  ownerPhone: string; // Required
  registeredAddress?: string;
  headquarterAddress?: string;
  productionAddress?: string;
  province?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
}

export function EditStoreDialogTabbed({ open, onOpenChange, store, onSubmit }: EditStoreDialogTabbedProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'owner' | 'address'>('business');

  // Form data - Initialize from store
  const [formData, setFormData] = useState<Partial<EditStoreData>>({});

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // API Data
  const [apiProvinces, setApiProvinces] = useState<ProvinceApiData[]>([]);
  const [apiWards, setApiWards] = useState<WardApiData[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Province/Ward state
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedProvinceName, setSelectedProvinceName] = useState('');
  const [selectedWardName, setSelectedWardName] = useState('');

  // Initialize form data from store when dialog opens
  useEffect(() => {
    if (open && store) {
      setFormData({
        business_name: store.name || '',
        taxCode: store.taxCode || '',
        industryName: store.businessType || '',
        establishedDate: store.establishedDate || '',
        operationStatus: 'active',
        businessPhone: store.businessPhone || '',
        notes: store.notes || '',
        ownerName: store.ownerName || '',
        ownerBirthYear: store.ownerBirthYear?.toString() || '',
        ownerIdNumber: store.ownerIdNumber || '',
        ownerPhone: store.ownerPhone || '',
        registeredAddress: store.address || '',
        headquarterAddress: '',
        productionAddress: '',
        latitude: store.latitude,
        longitude: store.longitude,
      });

      // Set selected province and ward
      if (store.provinceCode) {
        setSelectedProvince(store.provinceCode);
        setSelectedProvinceName(store.province || '');
        loadWardsByProvince(store.provinceCode);
      }
      if (store.wardCode) {
        setSelectedWard(store.wardCode);
        setSelectedWardName(store.ward || '');
      }
    }
  }, [open, store]);

  // Fetch location data on mount
  useEffect(() => {
    loadLocationData();
  }, []);

  const loadLocationData = async () => {
    try {
      setLoadingProvinces(true);
      const prov = await fetchProvinces();
      setApiProvinces(prov);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast.error('Không thể tải danh sách tỉnh/thành phố');
    } finally {
      setLoadingProvinces(false);
    }
  };

  // Fetch wards when province changes
  const loadWardsByProvince = async (provinceId: string) => {
    if (!provinceId) {
      setApiWards([]);
      return;
    }

    try {
      setLoadingWards(true);
      const w = await fetchWardsByProvince(provinceId);
      setApiWards(w);
    } catch (error) {
      console.error('Error fetching wards:', error);
      toast.error('Không thể tải danh sách phường/xã');
    } finally {
      setLoadingWards(false);
    }
  };

  // Build full address for map search
  const buildFullAddress = (): string => {
    const parts = [
      formData.registeredAddress || '',
      selectedWardName || '',
      selectedProvinceName || ''
    ].filter(part => part.trim());

    return parts.join(', ');
  };

  const fullAddressForMap = buildFullAddress();

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Phone validation function (Vietnamese format)
    const isValidPhoneNumber = (phone: string): boolean => {
      if (!phone?.trim()) return false;
      // Vietnamese phone: 10 digits, starts with 0, optionally +84, or just numbers
      const phoneRegex = /^(\+84|0)?[0-9]{9,10}$/;
      return phoneRegex.test(phone.replace(/\s+/g, ''));
    };

    // Tab 1: Business - Required fields
    if (!formData.business_name?.trim()) {
      newErrors.business_name = 'Vui lòng nhập tên cơ sở kinh doanh';
    }
    if (!formData.taxCode?.trim()) {
      newErrors.taxCode = 'Vui lòng nhập mã số thuế';
    }
    if (!formData.industryName?.trim()) {
      newErrors.industryName = 'Vui lòng nhập tên ngành kinh doanh';
    }
    if (!formData.operationStatus?.trim()) {
      newErrors.operationStatus = 'Vui lòng chọn tình trạng hoạt động';
    }
    
    // businessPhone - bắt buộc
    if (!formData.businessPhone?.trim()) {
      newErrors.businessPhone = 'Vui lòng nhập số điện thoại hộ kinh doanh';
    } else if (!isValidPhoneNumber(formData.businessPhone)) {
      newErrors.businessPhone = 'Số điện thoại không hợp lệ';
    }

    // Tab 2: Owner - ownerPhone required
    if (!formData.ownerPhone?.trim()) {
      newErrors.ownerPhone = 'Vui lòng nhập số điện thoại chủ cơ sở';
    } else if (!isValidPhoneNumber(formData.ownerPhone)) {
      newErrors.ownerPhone = 'Số điện thoại không hợp lệ';
    }
   if (!formData.ownerName?.trim()) {
      newErrors.ownerName = 'Vui lòng nhập tên chủ cơ sở';
    }

     if (!formData.registeredAddress?.trim()) {
      newErrors.registeredAddress = 'Vui lòng nhập địa chỉ đăng ký kinh doanh';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = () => {
    if (!validateForm()) {
      // Switch to tab with error
      const businessFields = ['business_name', 'taxCode', 'industryName', 'operationStatus', 'businessPhone'];
      const ownerFields = ['ownerName', 'ownerPhone', 'ownerBirthYear', 'ownerIdNumber'];
      
      if (Object.keys(errors).some(k => businessFields.includes(k))) {
        setActiveTab('business');
        toast.error('Vui lòng điền đầy đủ thông tin cơ sở');
      } else if (Object.keys(errors).some(k => ownerFields.includes(k))) {
        setActiveTab('owner');
        toast.error('Vui lòng điền đầy đủ thông tin chủ cơ sở');
      } else {
        setActiveTab('address');
      }
      return;
    }

    // Prepare data for submission
    const submitData: EditStoreData = {
      business_name: formData.business_name!,
      taxCode: formData.taxCode || '',
      industryName: formData.industryName || '',
      establishedDate: formData.establishedDate,
      operationStatus: formData.operationStatus || 'active',
      businessPhone: formData.businessPhone!,
      notes: formData.notes,
      ownerName: formData.ownerName,
      ownerBirthYear: formData.ownerBirthYear,
      ownerIdNumber: formData.ownerIdNumber,
      ownerPhone: formData.ownerPhone!,
      registeredAddress: formData.registeredAddress,
      headquarterAddress: formData.headquarterAddress,
      productionAddress: formData.productionAddress,
      province: selectedProvince && selectedProvince.trim() ? selectedProvince : undefined,
      ward: selectedWard && selectedWard.trim() ? selectedWard : undefined,
      latitude: formData.latitude,
      longitude: formData.longitude,
    };

    onSubmit?.(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            <Building2 className="w-5 h-5" />
            Chỉnh sửa cơ sở
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cơ sở: <strong>{store?.name}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Tabs Navigation */}
        <div className={styles.tabsNav}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'business' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('business')}
          >
            <FileText className="w-4 h-4" />
            <span>Thông tin cơ sở</span>
            {Object.keys(errors).some(k => ['business_name', 'taxCode', 'industryName', 'operationStatus', 'businessPhone'].includes(k)) && (
              <XCircle className="w-3 h-3 text-red-500" />
            )}
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'owner' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('owner')}
          >
            <Users className="w-4 h-4" />
            <span>Thông tin chủ cơ sở</span>
            {Object.keys(errors).some(k => ['ownerName', 'ownerPhone', 'ownerBirthYear', 'ownerIdNumber'].includes(k)) && (
              <XCircle className="w-3 h-3 text-red-500" />
            )}
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'address' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('address')}
          >
            <MapPin className="w-4 h-4" />
            <span>Địa chỉ</span>
            {Object.keys(errors).some(k => ['registeredAddress'].includes(k)) && (
              <XCircle className="w-3 h-3 text-red-500" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {/* Tab 1: Thông tin cơ sở */}
          {activeTab === 'business' && (
            <div className={styles.formGrid}>
              {/* Tên cơ sở */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="business_name">
                  Tên cơ sở <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="business_name"
                  value={formData.business_name || ''}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  placeholder="Nhập tên cơ sở kinh doanh"
                />
                {errors.business_name && (
                  <p className="text-sm text-red-500">{errors.business_name}</p>
                )}
              </div>

              {/* Mã số thuế */}
              <div className="space-y-2">
                <Label htmlFor="taxCode">Mã số thuế <span className="text-red-500">*</span></Label>
                <Input
                  id="taxCode"
                  value={formData.taxCode || ''}
                  onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                  placeholder="Nhập mã số thuế"
                />
                {errors.taxCode && (
                  <p className="text-sm text-red-500">{errors.taxCode}</p>
                )}
              </div>

              {/* Industry Name - Searchable Select (Combobox) */}
              <div className="space-y-2">
                <Label htmlFor="industryName">Tên ngành kinh doanh <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      id="industryName"
                      type="button"
                      role="combobox"
                      className={comboboxStyles.comboboxTrigger}
                      data-placeholder={!formData.industryName}
                      data-error={!!errors.industryName}
                    >
                      <span>{formData.industryName || 'Chọn ngành kinh doanh...'}</span>
                      <ChevronsUpDown className={comboboxStyles.comboboxIcon} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className={comboboxStyles.popoverContent} align="start">
                    <Command>
                      <div className={comboboxStyles.commandInput}>
                        <svg className={comboboxStyles.searchIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <CommandInput placeholder="Tìm kiếm ngành kinh doanh..." />
                      </div>
                      <CommandList className={comboboxStyles.commandList}>
                        <CommandEmpty className={comboboxStyles.commandEmpty}>
                          Không tìm thấy ngành kinh doanh
                        </CommandEmpty>
                        <CommandGroup>
                          {INDUSTRIES.map((industry) => (
                            <CommandItem
                              key={industry.id}
                              value={industry.name}
                              onSelect={() => {
                                setFormData({ ...formData, industryName: industry.name });
                              }}
                              className={comboboxStyles.commandItem}
                              data-selected={formData.industryName === industry.name}
                            >
                              <div className={comboboxStyles.industryContent}>
                                <span className={comboboxStyles.industryName}>{industry.name}</span>
                                {industry.category && (
                                  <span className={comboboxStyles.industryCategory}>{industry.category}</span>
                                )}
                              </div>
                              <Check className={comboboxStyles.checkIcon} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.industryName && (
                  <p className="text-sm text-red-500">{errors.industryName}</p>
                )}
              </div>

              {/* Ngày thành lập */}
              <div className="space-y-2">
                <Label htmlFor="establishedDate">Ngày thành lập</Label>
                <Input
                  id="establishedDate"
                  type="date"
                  value={formData.establishedDate || ''}
                  onChange={(e) => setFormData({ ...formData, establishedDate: e.target.value })}
                />
              </div>

              {/* Tình trạng hoạt động */}
              <div className="space-y-2">
                <Label htmlFor="operationStatus">Tình trạng hoạt động <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.operationStatus || 'active'}
                  onValueChange={(value) => setFormData({ ...formData, operationStatus: value })}
                >
                  <SelectTrigger id="operationStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    <SelectItem value="suspended">Tạm ngừng</SelectItem>
                  </SelectContent>
                </Select>
                {errors.operationStatus && (
                  <p className="text-sm text-red-500">{errors.operationStatus}</p>
                )}
              </div>

              {/* SĐT hộ kinh doanh */}
              <div className="space-y-2">
                <Label htmlFor="businessPhone">SĐT hộ kinh doanh <span style={{color: 'var(--destructive)', fontWeight: '600'}}>*</span></Label>
                <Input
                  id="businessPhone"
                  type="tel"
                  value={formData.businessPhone || ''}
                  onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  className={errors.businessPhone ? 'border-red-500' : ''}
                />
                {errors.businessPhone && (
                  <p className="text-sm text-red-500">{errors.businessPhone}</p>
                )}
              </div>

              {/* Ghi chú */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Thông tin chủ hộ */}
          {activeTab === 'owner' && (
            <div className={styles.formGrid}>
              {/* Tên Chủ cơ sở */}
              <div className="space-y-2">
                <Label htmlFor="ownerName">Tên Chủ cơ sở <span style={{color: 'var(--destructive)', fontWeight: '600'}}>*</span></Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName || ''}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Nhập tên chủ hộ"
                  className={errors.ownerName ? 'border-red-500' : ''}
                />
                  {errors.ownerName && (
                  <p className="text-sm text-red-500">{errors.ownerName}</p>
                )}
              </div>

              {/* Số điện thoại chính */}
              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Số điện thoại chủ cơ sở <span style={{color: 'var(--destructive)', fontWeight: '600'}}>*</span></Label>
                <Input
                  id="ownerPhone"
                  type="tel"
                  value={formData.ownerPhone || ''}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  className={errors.ownerPhone ? 'border-red-500' : ''}
                />
                {errors.ownerPhone && (
                  <p className="text-sm text-red-500">{errors.ownerPhone}</p>
                )}
              </div>
              {/* Năm sinh chủ hộ */}
              <div className="space-y-2">
                <Label htmlFor="ownerBirthYear">Năm sinh chủ hộ</Label>
                <Input
                  id="ownerBirthYear"
                  type="number"
                  value={formData.ownerBirthYear || ''}
                  onChange={(e) => setFormData({ ...formData, ownerBirthYear: e.target.value })}
                  placeholder="VD: 1990"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              {/* Số CCCD/CMND */}
              <div className="space-y-2">
                <Label htmlFor="ownerIdNumber">Số CCCD/CMND</Label>
                <Input
                  id="ownerIdNumber"
                  value={formData.ownerIdNumber || ''}
                  onChange={(e) => setFormData({ ...formData, ownerIdNumber: e.target.value })}
                  placeholder="Nhập số CCCD/CMND"
                  maxLength={12}
                />
              </div>

            </div>
          )}

          {/* Tab 3: Địa chỉ */}
          {activeTab === 'address' && (
            <div className={styles.formGrid}>
              {/* Tỉnh/Thành phố */}
              <div className="space-y-2">
                <Label htmlFor="province">Tỉnh/Thành phố</Label>
                <Select
                  value={selectedProvince}
                  onValueChange={(value) => {
                    const province = apiProvinces.find((p) => p._id === value);
                    setSelectedProvince(value);
                    setSelectedProvinceName(province?.name || '');
                    setSelectedWard('');
                    setSelectedWardName('');
                    loadWardsByProvince(value);
                  }}
                  disabled={loadingProvinces}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiProvinces.map((province) => (
                      <SelectItem key={province._id} value={province._id}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phường/Xã */}
              <div className="space-y-2">
                <Label htmlFor="ward">Phường/Xã</Label>
                <Select
                  value={selectedWard}
                  onValueChange={(value) => {
                    const ward = apiWards.find((w) => w._id === value);
                    setSelectedWard(value);
                    setSelectedWardName(ward?.name || '');
                  }}
                  disabled={!selectedProvince || loadingWards}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phường/xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiWards.map((ward) => (
                      <SelectItem key={ward._id} value={ward._id}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Địa chỉ */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="registeredAddress">Địa chỉ đăng ký kinh doanh <span style={{color: 'var(--destructive)', fontWeight: '600'}}>*</span></Label>
                <Input
                  id="registeredAddress"
                  value={formData.registeredAddress || ''}
                  onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
                  placeholder="Số nhà, tên đường"
                />
                  {errors.registeredAddress && (
                  <p className="text-sm text-red-500">{errors.registeredAddress}</p>
                )}
              </div>

              {/* Địa chỉ trụ sở chính */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="headquarterAddress">Địa chỉ trụ sở chính (nếu khác)</Label>
                <Input
                  id="headquarterAddress"
                  value={formData.headquarterAddress || ''}
                  onChange={(e) => setFormData({ ...formData, headquarterAddress: e.target.value })}
                  placeholder="Nhập địa chỉ trụ sở chính"
                />
              </div>

              {/* Địa chỉ cơ sở sản xuất */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="productionAddress">Địa chỉ cơ sở sản xuất (nếu có)</Label>
                <Input
                  id="productionAddress"
                  value={formData.productionAddress || ''}
                  onChange={(e) => setFormData({ ...formData, productionAddress: e.target.value })}
                  placeholder="Nhập địa chỉ cơ sở sản xuất"
                />
              </div>

              {/* Map Location Picker */}
              <div className="space-y-2 col-span-2">
                <Label>Vị trí trên bản đồ</Label>
                <MapLocationPicker
                  address={fullAddressForMap}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onLocationChange={(location) => {
                    // Update coordinates and address
                    setFormData(prev => ({
                      ...prev,
                      latitude: location.latitude,
                      longitude: location.longitude,
                      registeredAddress: location.address || prev.registeredAddress,
                    }));
                    
                    // Auto-select province/ward from reverse geocoding result
                    if (location.province) {
                      // Find province by name
                      const provinceMatch = apiProvinces.find(
                        p => p.name.toLowerCase().includes(location.province?.toLowerCase() || '') ||
                             location.province?.toLowerCase().includes(p.name.toLowerCase())
                      );
                      if (provinceMatch) {
                        setSelectedProvince(provinceMatch._id);
                        setSelectedProvinceName(provinceMatch.name);
                        loadWardsByProvince(provinceMatch._id);
                      }
                    }
                    
                    // Auto-select ward after province is set
                    if (location.ward && location.province) {
                      setTimeout(() => {
                        const provinceMatch = apiProvinces.find(
                          p => p.name.toLowerCase().includes(location.province?.toLowerCase() || '') ||
                               location.province?.toLowerCase().includes(p.name.toLowerCase())
                        );
                        if (provinceMatch) {
                          const wardMatch = apiWards.find(
                            w => w.name.toLowerCase().includes(location.ward?.toLowerCase() || '') ||
                                 location.ward?.toLowerCase().includes(w.name.toLowerCase())
                          );
                          if (wardMatch) {
                            setSelectedWard(wardMatch._id);
                            setSelectedWardName(wardMatch.name);
                          }
                        }
                      }, 50);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter style={{ gap: '12px' }}>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
