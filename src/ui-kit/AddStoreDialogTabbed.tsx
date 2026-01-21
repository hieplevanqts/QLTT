import React, { useState, useMemo, useRef } from 'react';
import {
  Building2,
  X,
  Upload,
  Loader2,
  Sparkles,
  FileText,
  Users,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../app/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../app/components/ui/popover';
import { Textarea } from '../app/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../app/components/ui/tooltip';
import {
  provinces,
  getWardsByProvince
} from '../data/vietnamLocations';
import { INDUSTRIES, searchIndustries } from '../data/industries';
import { toast } from 'sonner';
import styles from './AddStoreDialogTabbed.module.css';
import comboboxStyles from './IndustryCombobox.module.css';
import { MapLocationPicker } from './MapLocationPicker';

interface AddStoreDialogTabbedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: NewStoreData) => void;
}

export interface NewStoreData {
  // Tab 1: Thông tin HKD
  business_name: string;
  taxCode: string;
  industryName: string;
  establishedDate?: string; // Optional
  operationStatus: string;
  businessArea?: string; // Optional
  businessPhone?: string; // Optional
  email?: string;
  website?: string;
  fax?: string;
  notes?: string;

  // Tab 2: Thông tin chủ hộ (All optional)
  ownerName?: string;
  ownerBirthYear?: string;
  ownerIdNumber?: string;
  ownerPhone?: string;
  ownerPhone2?: string;

  // Tab 3: Địa chỉ (All optional)
  registeredAddress?: string;
  province?: string;
  jurisdiction?: string;
  ward?: string;
  headquarterAddress?: string;
  productionAddress?: string;
  latitude?: number;
  longitude?: number;

  // Internal fields
  status?: string;
  managementUnit?: string;
}

// OCR Extracted data structure
interface ExtractedData {
  name?: string;
  taxCode?: string;
  industryName?: string;
  establishedDate?: string;
  operationStatus?: string;
  businessArea?: string;
  businessPhone?: string;
  email?: string;
  website?: string;
  ownerName?: string;
  ownerBirthYear?: string;
  ownerIdNumber?: string;
  ownerPhone?: string;
  registeredAddress?: string;
}

// Field metadata for auto-fill tracking
interface FieldMetadata {
  [key: string]: {
    isAutoFilled: boolean;
    isManuallyEdited: boolean;
  };
}

export function AddStoreDialogTabbed({ open, onOpenChange, onSubmit }: AddStoreDialogTabbedProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'owner' | 'address'>('business');

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data
  const [formData, setFormData] = useState<Partial<NewStoreData>>({
    operationStatus: 'active',
  });

  // Field metadata for tracking auto-filled fields
  const [fieldMetadata, setFieldMetadata] = useState<FieldMetadata>({});

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Province/Ward state (NO District)
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Get wards directly from province (no district)
  const wards = useMemo(() => {
    return selectedProvince ? getWardsByProvince(selectedProvince) : [];
  }, [selectedProvince]);

  // Mock OCR extraction
  const mockExtractData = async (file: File): Promise<ExtractedData> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock extracted data based on file name
    const fileName = file.name.toLowerCase();

    if (fileName.includes('business') || fileName.includes('license') || fileName.includes('gpkd')) {
      return {
        name: 'Công ty TNHH Thương mại Dịch vụ ABC',
        taxCode: '0123456789',
        industryName: 'Bán lẻ thực phẩm',
        establishedDate: '2020-01-15',
        operationStatus: 'active',
        businessArea: '150',
        businessPhone: '0901234567',
        email: 'contact@abc.com.vn',
        registeredAddress: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      };
    } else if (fileName.includes('cmnd') || fileName.includes('cccd') || fileName.includes('id')) {
      return {
        ownerName: 'Nguyễn Văn A',
        ownerBirthYear: '1985',
        ownerIdNumber: '001085012345',
        ownerPhone: '0912345678',
      };
    }

    // Default mock data
    return {
      name: 'Cửa hàng tiện lợi XYZ',
      taxCode: '0987654321',
      industryName: 'Bán lẻ hàng hóa tổng hợp',
      ownerName: 'Trần Thị B',
      ownerPhone: '0923456789',
    };
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processFile(file);
  };

  // Process file (shared for input and drag & drop)
  const processFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ hỗ trợ file JPG, PNG, WEBP, PDF');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Kích thước file vượt quá 10MB');
      return;
    }

    // Check if user has manually edited fields
    const hasManualEdits = Object.values(fieldMetadata).some(meta => meta.isManuallyEdited);

    if (hasManualEdits && uploadedFile) {
      const confirmReupload = window.confirm(
        'Bạn đã chỉnh sửa một số trường thủ công. Upload lại sẽ ghi đè dữ liệu. Bạn có chắc chắn?'
      );
      if (!confirmReupload) {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
    }

    setIsUploading(true);
    setUploadedFile(file);

    try {
      const extractedData = await mockExtractData(file);

      // Auto-fill form data
      const newFormData = { ...formData };
      const newMetadata: FieldMetadata = {};

      Object.entries(extractedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          newFormData[key as keyof NewStoreData] = value as any;
          newMetadata[key] = {
            isAutoFilled: true,
            isManuallyEdited: false,
          };
        }
      });

      setFormData(newFormData);
      setFieldMetadata(prev => ({ ...prev, ...newMetadata }));

      toast.success(
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Trích xuất dữ liệu thành công</span>
          </div>
          <div className="text-sm opacity-80 mt-1">
            Đã tự động điền {Object.keys(extractedData).length} trường
          </div>
        </div>
      );
    } catch (error) {
      toast.error('Không thể trích xuất dữ liệu từ file');
      console.error('OCR error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Drag & Drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  // Handle field change
  const handleFieldChange = (field: keyof NewStoreData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Mark as manually edited if it was auto-filled
    if (fieldMetadata[field]?.isAutoFilled) {
      setFieldMetadata(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          isManuallyEdited: true,
        },
      }));
    }

    // Clear error
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Tab 1: Thông tin HKD
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
    if (formData.businessArea && !/^\d+$/.test(formData.businessArea)) {
      newErrors.businessArea = 'Diện tích phải là số';
    }
    if (formData.businessPhone && !/^\d+$/.test(formData.businessPhone)) {
      newErrors.businessPhone = 'Số điện thoại phải là số';
    }

    // Tab 2: Thông tin chủ hộ
    if (formData.ownerName && !formData.ownerName.trim()) {
      newErrors.ownerName = 'Vui lòng nhập tên chủ hộ';
    }
    if (formData.ownerBirthYear && !/^\d+$/.test(formData.ownerBirthYear)) {
      newErrors.ownerBirthYear = 'Năm sinh phải là số';
    }
    if (formData.ownerIdNumber && !formData.ownerIdNumber.trim()) {
      newErrors.ownerIdNumber = 'Vui lòng nhập số CMTND/CCCD';
    }
    if (formData.ownerPhone && !/^\d+$/.test(formData.ownerPhone)) {
      newErrors.ownerPhone = 'Số điện thoại phải là số';
    }

    // Tab 3: Địa chỉ (All optional - no validation)

    setErrors(newErrors);

    // Navigate to first tab with errors
    if (Object.keys(newErrors).length > 0) {
      const errorFields = Object.keys(newErrors);

      const businessFields = ['name', 'taxCode', 'industryName', 'operationStatus', 'businessArea', 'businessPhone'];
      const ownerFields = ['ownerName', 'ownerBirthYear', 'ownerIdNumber', 'ownerPhone'];
      const addressFields = ['registeredAddress', 'province', 'ward'];

      if (errorFields.some(f => businessFields.includes(f))) {
        setActiveTab('business');
        toast.error('Vui lòng điền đầy đủ thông tin HKD');
      } else if (errorFields.some(f => ownerFields.includes(f))) {
        setActiveTab('owner');
        toast.error('Vui lòng điền đầy đủ thông tin chủ hộ');
      } else if (errorFields.some(f => addressFields.includes(f))) {
        setActiveTab('address');
        toast.error('Vui lòng điền đầy đủ thông tin địa chỉ');
      }

      return false;
    }

    return true;
  };

  // Handle submit
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const submissionData: NewStoreData = {
      business_name: formData.business_name!,
      taxCode: formData.taxCode!,
      fax: formData.fax,
      industryName: formData.industryName!,
      establishedDate: formData.establishedDate,
      operationStatus: formData.operationStatus!,
      businessArea: formData.businessArea,
      businessPhone: formData.businessPhone,
      email: formData.email,
      website: formData.website,
      notes: formData.notes,
      ownerName: formData.ownerName,
      ownerBirthYear: formData.ownerBirthYear,
      ownerIdNumber: formData.ownerIdNumber,
      ownerPhone: formData.ownerPhone,
      ownerPhone2: formData.ownerPhone2,
      registeredAddress: formData.registeredAddress,
      province: selectedProvince || undefined,
      jurisdiction: selectedProvince ? '' : undefined,
      ward: selectedWard || undefined,
      headquarterAddress: formData.headquarterAddress,
      productionAddress: formData.productionAddress,
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: 'pending',
      managementUnit: selectedProvince ? `Chi cục QLTT ${selectedProvince}` : undefined,
    };

    onSubmit?.(submissionData);
    onOpenChange(false);

    // Reset form
    setFormData({ operationStatus: 'active' });
    setFieldMetadata({});
    setUploadedFile(null);
    setActiveTab('business');
    setSelectedProvince('');
    setSelectedWard('');
    setErrors({});
  };

  // Handle map location selected
  const handleMapLocationSelected = (data: {
    address: string;
    latitude: number;
    longitude: number;
    province: string;
    district: string;
    ward: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      registeredAddress: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
    }));
    setSelectedProvince(data.province);
    setSelectedWard(data.ward);
  };

  // Render field with auto-fill indicator
  const renderFieldWithIndicator = (
    field: keyof NewStoreData,
    label: string,
    inputElement: React.ReactNode
  ) => {
    const isAutoFilled = fieldMetadata[field]?.isAutoFilled && !fieldMetadata[field]?.isManuallyEdited;

    return (
      <div className="space-y-2">
        <Label htmlFor={field} className="flex items-center gap-2">
          {label}
          {isAutoFilled && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={styles.autoFilledBadge}>
                    <Sparkles className="w-3 h-3" />
                    <span>Tự động</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Đã trích xuất từ file upload</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Label>
        {inputElement}
        {errors[field] && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            <Building2 className="w-5 h-5" />
            Thêm cơ sở mới
          </DialogTitle>
          <DialogDescription>
            Upload file để tự động điền thông tin hoặc nhập thủ công
          </DialogDescription>
        </DialogHeader>

        {/* File Upload Section */}
        <div
          className={`${styles.uploadSection} ${isDragging ? styles.isDragging : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          {!uploadedFile ? (
            <>
              <Upload className="w-8 h-8 text-gray-400" />
              <div className="flex flex-col items-center gap-1">
                <p className="font-medium text-sm">
                  {isDragging ? 'Thả file vào đây' : 'Kéo & thả file vào đây'}
                </p>
                <p className="text-xs text-gray-500">hoặc</p>
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                className={styles.uploadButton}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang trích xuất dữ liệu...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Chọn file từ máy</span>
                  </>
                )}
              </Button>
              <p className={styles.uploadHint}>
                Hỗ trợ: JPG, PNG, WEBP, PDF (tối đa 10MB)
              </p>
            </>
          ) : (
            <>
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm font-medium">Đang trích xuất dữ liệu...</p>
                </div>
              ) : (
                <div className={styles.uploadedFileInfo}>
                  <FileText className="w-4 h-4" />
                  <span>{uploadedFile.name}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className={styles.tabsNav}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'business' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('business')}
          >
            <FileText className="w-4 h-4" />
            <span>Thông tin HKD</span>
            {Object.keys(errors).some(k => ['name', 'taxCode', 'industryName', 'operationStatus', 'businessArea', 'businessPhone'].includes(k)) && (
              <XCircle className="w-3 h-3 text-red-500" />
            )}
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'owner' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('owner')}
          >
            <Users className="w-4 h-4" />
            <span>Thông tin chủ hộ</span>
            {Object.keys(errors).some(k => ['ownerName', 'ownerBirthYear', 'ownerIdNumber', 'ownerPhone'].includes(k)) && (
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
            {Object.keys(errors).some(k => ['registeredAddress', 'province', 'ward'].includes(k)) && (
              <XCircle className="w-3 h-3 text-red-500" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {/* Tab 1: Thông tin HKD */}
          {activeTab === 'business' && (
            <div className={styles.formGrid}>
              {renderFieldWithIndicator(
                'business_name',
                'Tên cơ sở kinh doanh *',
                <Input
                  id="business_name"
                  value={formData.business_name || ''}
                  onChange={(e) => handleFieldChange('business_name', e.target.value)}
                  placeholder="Nhập tên cơ sở kinh doanh"
                />
              )}

              {renderFieldWithIndicator(
                'taxCode',
                'Mã số thuế *',
                <Input
                  id="taxCode"
                  value={formData.taxCode || ''}
                  onChange={(e) => handleFieldChange('taxCode', e.target.value)}
                  placeholder="Nhập mã số thuế"
                />
              )}

              {/* Industry Name - Searchable Select (Combobox) - Select2 Style */}
              <div className="space-y-2">
                <Label htmlFor="industryName" className="flex items-center gap-2">
                  Tên ngành kinh doanh *
                  {fieldMetadata['industryName']?.isAutoFilled && !fieldMetadata['industryName']?.isManuallyEdited && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={styles.autoFilledBadge}>
                            <Sparkles className="w-3 h-3" />
                            <span>Tự động</span>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Đã trích xuất từ file upload</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
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
                                handleFieldChange('industryName', industry.name === formData.industryName ? '' : industry.name);
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
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.industryName}
                  </p>
                )}
              </div>

              {renderFieldWithIndicator(
                'establishedDate',
                'Ngày thành lập',
                <Input
                  id="establishedDate"
                  type="date"
                  value={formData.establishedDate || ''}
                  onChange={(e) => handleFieldChange('establishedDate', e.target.value)}
                />
              )}

              {renderFieldWithIndicator(
                'operationStatus',
                'Tình trạng hoạt động *',
                <Select
                  value={formData.operationStatus || 'active'}
                  onValueChange={(value) => handleFieldChange('operationStatus', value)}
                >
                  <SelectTrigger id="operationStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="suspended">Tạm ngừng</SelectItem>
                    <SelectItem value="closed">Đã đóng cửa</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {renderFieldWithIndicator(
                'businessArea',
                'Diện tích cửa hàng (m²)',
                <Input
                  id="businessArea"
                  type="number"
                  value={formData.businessArea || ''}
                  onChange={(e) => handleFieldChange('businessArea', e.target.value)}
                  placeholder="Nhập diện tích"
                />
              )}

              {renderFieldWithIndicator(
                'businessPhone',
                'SĐT hộ kinh doanh',
                <Input
                  id="businessPhone"
                  type="tel"
                  value={formData.businessPhone || ''}
                  onChange={(e) => handleFieldChange('businessPhone', e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              )}

              {renderFieldWithIndicator(
                'email',
                'Email',
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="Nhập email"
                />
              )}

              {renderFieldWithIndicator(
                'website',
                'Website',
                <Input
                  id="website"
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  placeholder="Nhập website"
                />
              )}

              {renderFieldWithIndicator(
                'fax',
                'Fax',
                <Input
                  id="fax"
                  value={formData.fax || ''}
                  onChange={(e) => handleFieldChange('fax', e.target.value)}
                  placeholder="Nhập số fax"
                />
              )}

              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Tab 2: Thông tin chủ hộ */}
          {activeTab === 'owner' && (
            <div className={styles.formGrid}>
              {renderFieldWithIndicator(
                'ownerName',
                'Tên chủ hộ kinh doanh',
                <Input
                  id="ownerName"
                  value={formData.ownerName || ''}
                  onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                  placeholder="Nhập tên chủ hộ"
                />
              )}

              {renderFieldWithIndicator(
                'ownerBirthYear',
                'Năm sinh chủ hộ',
                <Input
                  id="ownerBirthYear"
                  type="number"
                  value={formData.ownerBirthYear || ''}
                  onChange={(e) => handleFieldChange('ownerBirthYear', e.target.value)}
                  placeholder="Nhập năm sinh"
                  min="1900"
                  max="2100"
                />
              )}

              {renderFieldWithIndicator(
                'ownerIdNumber',
                'Số CMTND / CCCD / ĐDCN',
                <Input
                  id="ownerIdNumber"
                  value={formData.ownerIdNumber || ''}
                  onChange={(e) => handleFieldChange('ownerIdNumber', e.target.value)}
                  placeholder="Nhập số CMTND/CCCD/ĐDCN"
                />
              )}

              {renderFieldWithIndicator(
                'ownerPhone',
                'Số điện thoại chủ hộ',
                <Input
                  id="ownerPhone"
                  type="tel"
                  value={formData.ownerPhone || ''}
                  onChange={(e) => handleFieldChange('ownerPhone', e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              )}

              {renderFieldWithIndicator(
                'ownerPhone2',
                'Số điện thoại khác (nếu có)',
                <Input
                  id="ownerPhone2"
                  type="tel"
                  className='placeholder:text-gray-500'
                  value={formData.ownerPhone2 || ''}
                  onChange={(e) => handleFieldChange('ownerPhone2', e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              )}
            </div>
          )}

          {/* Tab 3: ịa chỉ */}
          {activeTab === 'address' && (
            <div className={styles.addressTab}>
              <div className={styles.formGrid}>
                {renderFieldWithIndicator(
                  'registeredAddress',
                  'Địa chỉ đăng ký kinh doanh',
                  <Input
                    id="registeredAddress"
                    value={formData.registeredAddress || ''}
                    onChange={(e) => handleFieldChange('registeredAddress', e.target.value)}
                    placeholder="Nhập địa chỉ đăng ký kinh doanh"
                  />
                )}

                <div className="space-y-2">
                  <Label htmlFor="province">Tỉnh / Thành phố</Label>
                  <Select
                    value={selectedProvince}
                    onValueChange={(value) => {
                      setSelectedProvince(value);
                      setSelectedWard('');
                      if (errors.province) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.province;
                          return newErrors;
                        });
                      }
                    }}
                  >
                    <SelectTrigger id="province">
                      <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(provinces).map((prov) => (
                        <SelectItem key={prov.name} value={prov.name}>
                          {prov.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.province && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.province}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ward">Phường / Xã</Label>
                  <Select
                    value={selectedWard}
                    onValueChange={(value) => {
                      setSelectedWard(value);
                      if (errors.ward) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.ward;
                          return newErrors;
                        });
                      }
                    }}
                    disabled={!selectedProvince}
                  >
                    <SelectTrigger id="ward">
                      <SelectValue placeholder="Chọn Phường/Xã" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={`${ward.district}_${ward.name}`} value={ward.name}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ward && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.ward}
                    </p>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="headquarterAddress">Địa chỉ trụ sở chính (nếu khác)</Label>
                  <Input
                    id="headquarterAddress"
                    value={formData.headquarterAddress || ''}
                    onChange={(e) => handleFieldChange('headquarterAddress', e.target.value)}
                    placeholder="Nhập địa chỉ trụ sở chính"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="productionAddress">Địa chỉ cơ sở sản xuất (nếu có)</Label>
                  <Input
                    id="productionAddress"
                    value={formData.productionAddress || ''}
                    onChange={(e) => handleFieldChange('productionAddress', e.target.value)}
                    placeholder="Nhập địa chỉ cơ sở sản xuất"
                  />
                </div>
              </div>

              {/* Map Integration */}
              <div className="mt-4">
                <Label className="inline-flex items-center gap-1.5 mb-3" style={{ display: 'inline-flex', alignItems: 'center', lineHeight: '1' }}>
                  <MapPin className="w-4 h-4 flex-shrink-0" style={{ flexShrink: 0 }} />
                  <span style={{ lineHeight: '1' }}>Định vị trên bản đồ</span>
                </Label>
                <MapLocationPicker
                  address={formData.registeredAddress || ''}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onLocationChange={(location) => {
                    setFormData(prev => ({
                      ...prev,
                      latitude: location.latitude,
                      longitude: location.longitude,
                      registeredAddress: location.address || prev.registeredAddress,
                    }));
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setFormData({ operationStatus: 'active' });
              setFieldMetadata({});
              setUploadedFile(null);
              setActiveTab('business');
              setErrors({});
            }}
          >
            Hủy
          </Button>
          <Button type="button" onClick={handleSubmit}>
            <CheckCircle2 className="w-4 h-4" />
            Lưu cơ sở
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}