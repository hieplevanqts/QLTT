import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Building2,
  Upload,
  Loader2,
  Sparkles,
  FileText,
  Users,
  MapPin,
  AlertCircle,
  CheckCircle2,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { fetchProvinces, fetchWardsByProvince, type ProvinceApiData, type WardApiData } from '@/utils/api/locationsApi';
import { INDUSTRIES } from '@/utils/data/industries';
import { extractDocumentData } from '@/utils/api/ocrApi';
import { useAddressAutoMapper } from '@/hooks/useAddressAutoMapper';
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
  businessPhone: string; // Required
  notes?: string;

  // Tab 2: Thông tin chủ hộ
  ownerName?: string;
  ownerBirthYear?: string;
  ownerIdNumber?: string;
  ownerPhone: string; // Required
  area_name?: string;
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
  business_name?: string;
  taxCode?: string;
  industryName?: string;
  establishedDate?: string;
  operationStatus?: string;
  businessPhone?: string;
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

  // API Data
  const [apiProvinces, setApiProvinces] = useState<ProvinceApiData[]>([]);
  const [apiWards, setApiWards] = useState<WardApiData[]>([]);

  // Province/Ward state (NO District)
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedProvinceName, setSelectedProvinceName] = useState('');
  const [selectedWardName, setSelectedWardName] = useState('');

  // Track if auto-mapping should be skipped
  const [skipAddressMapping, setSkipAddressMapping] = useState(false);
  // Store the last OCR address for auto-mapping
  const [lastOcrAddress, setLastOcrAddress] = useState<string | undefined>();

  // Fetch location data on mount
  useEffect(() => {
    loadLocationData();
  }, []);
  const loadLocationData = async () => {
    try {
      const prov = await fetchProvinces();
      setApiProvinces(prov);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      toast.error('Không thể tải danh sách tỉnh/thành phố');
    }
  };

  // Fetch wards when province changes
  const loadWardsByProvince = async (provinceId: string) => {
    if (!provinceId) {
      setApiWards([]);
      return;
    }

    try {
      const w = await fetchWardsByProvince(provinceId);
      setApiWards(w);
    } catch (error) {
      console.error('Error fetching wards:', error);
      toast.error('Không thể tải danh sách phường/xã');
    }

    return;
  };

  // Get wards from API (already filtered by province)
  const wards = useMemo(() => {
    console.log('📊 Wards state updated:', apiWards.length, 'wards');
    return apiWards;
  }, [apiWards]);

  // Build full address for map search (hidden logic)
  const buildFullAddress = (): string => {
    const parts = [
      formData.registeredAddress || '',
      selectedWardName || '',
      selectedProvinceName || ''
    ].filter(part => part.trim());

    return parts.join(', ');
  };

  const fullAddressForMap = buildFullAddress();

  // Auto-map OCR address to province/ward
  useAddressAutoMapper({
    ocrData: lastOcrAddress ? { address: lastOcrAddress } : undefined,
    provinces: apiProvinces,
    wards: apiWards,
    formData,
    skipMapping: skipAddressMapping,
    onAddressMatch: (result) => {
      // Auto-select province
      setSelectedProvince(result.provinceId);
      setSelectedProvinceName(result.provinceName);

      // Load wards for this province and auto-select ward
      loadWardsByProvince(result.provinceId).then(() => {
        // Set ward in next tick to ensure wards are loaded
        setTimeout(() => {
          setSelectedWard(result.wardId);
          setSelectedWardName(result.wardName);
        }, 0);
      });

      // Set the street address
      setFormData(prev => ({
        ...prev,
        registeredAddress: result.streetAddress,
      }));

      console.log('✅ [AddStoreDialogTabbed] Address auto-mapped successfully');
    },
    onAddressMatchFail: (error, fullAddress) => {
      // Fallback: show full OCR address in the text field
      console.log('⚠️ [AddStoreDialogTabbed] Address auto-mapping failed:', error);
      setFormData(prev => ({
        ...prev,
        registeredAddress: fullAddress,
      }));
      // Don't show error toast - silent fallback as per requirements
    },
  });

  // Real OCR Integration
  const handleExtractData = async (file: File) => {
    try {
      // Determine document type based on filename or just assume GPKD for this flow
      // The user specifically asked for GPKD OCR integration here
      const result = await extractDocumentData(file, 'business-license');

      if (result.success && result.data) {
        const ocrData = result.data;

        // Map OCR fields to NewStoreData structure
        const extracted: ExtractedData = {
          business_name: ocrData.businessName,
          taxCode: ocrData.licenseNumber,
          establishedDate: ocrData.issueDate,
          ownerName: ocrData.ownerName,
          ownerIdNumber: ocrData.ownerIdCard,
          ownerBirthYear: ocrData.ownerDob ? ocrData.ownerDob.split('/').pop() : undefined,
          registeredAddress: ocrData.address,
          // Note: industryName mapping might need more logic if we want to match INDUSTRIES list
          industryName: ocrData.businessScope,
        };

        return extracted;
      }
      throw new Error(result.message || 'Trích xuất dữ liệu thất bại');
    } catch (error) {
      console.error('OCR API Error:', error);
      throw error;
    }
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
      const extractedData = await handleExtractData(file);

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

      // Store the OCR address for auto-mapping
      if (extractedData.registeredAddress) {
        setLastOcrAddress(extractedData.registeredAddress);
      }

      // Reset skip flag when new OCR data arrives
      setSkipAddressMapping(false);

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

    // Phone validation function (Vietnamese format)
    const isValidPhoneNumber = (phone: string): boolean => {
      if (!phone?.trim()) return false;
      // Vietnamese phone: 10 digits, starts with 0, optionally +84, or just numbers
      const phoneRegex = /^(\+84|0)?[0-9]{9,10}$/;
      return phoneRegex.test(phone.replace(/\s+/g, ''));
    };

    // Tab 1: Thông tin cơ sở - Chỉ validate required fields (*)
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
    if (!formData.ownerName?.trim()) {
      newErrors.ownerName = 'Vui lòng nhập tên chủ cơ sở';
    }

    if (!formData.registeredAddress?.trim()) {
      newErrors.registeredAddress = 'Vui lòng nhập địa chỉ đăng ký kinh doanh';
    }
    // ownerPhone - bắt buộc
    if (!formData.ownerPhone?.trim()) {
      newErrors.ownerPhone = 'Vui lòng nhập số điện thoại chủ cơ sở';
    } else if (!isValidPhoneNumber(formData.ownerPhone)) {
      newErrors.ownerPhone = 'Số điện thoại không hợp lệ';
    }

    // Tab 3: Địa chỉ - Không validate province, ward, location map
    // registeredAddress, province, ward, latitude, longitude - tất cả optional

    setErrors(newErrors);

    // Navigate to first tab with errors
    if (Object.keys(newErrors).length > 0) {
      const errorFields = Object.keys(newErrors);

      const businessFields = ['business_name', 'taxCode', 'industryName', 'operationStatus', 'businessPhone'];
      const ownerFields = ['ownerName', 'ownerPhone'];
      const addressFields = ['registeredAddress', 'province', 'ward'];

      if (errorFields.some(f => businessFields.includes(f))) {
        setActiveTab('business');
        toast.error('Vui lòng điền đầy đủ thông tin cơ sở');
      } else if (errorFields.some(f => ownerFields.includes(f))) {
        setActiveTab('owner');
        toast.error('Vui lòng điền đầy đủ thông tin chủ cơ sở');
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
      industryName: formData.industryName!,
      establishedDate: formData.establishedDate,
      operationStatus: formData.operationStatus!,
      businessPhone: formData.businessPhone!,
      notes: formData.notes,
      ownerName: formData.ownerName,
      ownerBirthYear: formData.ownerBirthYear,
      ownerIdNumber: formData.ownerIdNumber,
      ownerPhone: formData.ownerPhone!,
      registeredAddress: formData.registeredAddress,
      province: selectedProvince || undefined,
      jurisdiction: undefined,
      ward: selectedWard || undefined,
      headquarterAddress: formData.headquarterAddress,
      productionAddress: formData.productionAddress,
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: 'pending',
      managementUnit: selectedProvince ? `Chi cục QLTT ${apiProvinces.find(p => p._id === selectedProvince)?.name || ''}` : undefined,
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

  // Render field with auto-fill indicator
  const renderFieldWithIndicator = (
    field: keyof NewStoreData,
    label: string,
    inputElement: React.ReactNode
  ) => {
    const isAutoFilled = fieldMetadata[field]?.isAutoFilled && !fieldMetadata[field]?.isManuallyEdited;

    // Split label to separate required asterisk
    const labelParts = label.split(' *');
    const isRequired = label.endsWith(' *');

    return (
      <div className="space-y-2">
        <Label htmlFor={field} className="flex items-center gap-2">
          {isRequired ? (
            <>
              {labelParts[0]}
              <span style={{ color: 'var(--destructive)', fontWeight: '600' }}> *</span>
            </>
          ) : (
            label
          )}
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
          {/* Tab 1: Thông tin cơ sở */}
          {activeTab === 'business' && (
            <div className={styles.formGrid}>
              {renderFieldWithIndicator(
                'business_name',
                'Tên cơ sở *',
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
                  Tên ngành kinh doanh
                  <span style={{ color: 'var(--destructive)', fontWeight: '600' }}> *</span>
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
                'businessPhone',
                'SĐT hộ kinh doanh *',
                <>
                  <Input
                    id="businessPhone"
                    type="tel"
                    value={formData.businessPhone || ''}
                    onChange={(e) => handleFieldChange('businessPhone', e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className={errors.businessPhone ? 'border-red-500' : ''}
                  />
                </>,
                true
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
                'Tên chủ cơ sở *',
                <Input
                  id="ownerName"
                  value={formData.ownerName || ''}
                  className={`placeholder:text-gray-500 ${errors.ownerName ? 'border-red-500' : ''}`}
                  onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                  placeholder="Nhập tên chủ hộ"
                />,
                true
              )}
              {renderFieldWithIndicator(
                'ownerPhone',
                'Số điện thoại chủ cơ sở *',
                <>
                  <Input
                    id="ownerPhone"
                    type="tel"
                    className={`placeholder:text-gray-500 ${errors.ownerPhone ? 'border-red-500' : ''}`}
                    value={formData.ownerPhone || ''}
                    onChange={(e) => handleFieldChange('ownerPhone', e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </>,
                true
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


            </div>
          )}

          {/* Tab 3: ịa chỉ */}
          {activeTab === 'address' && (
            <div className={styles.addressTab}>
              <div className={styles.formGrid}>

                <div className="space-y-2">
                  <Label htmlFor="province">Tỉnh / Thành phố</Label>
                  <Select
                    value={selectedProvince}
                    onValueChange={(value) => {
                      const provData = apiProvinces.find(p => p._id === value);
                      setSelectedProvince(value);
                      setSelectedProvinceName(provData?.name || '');
                      setSelectedWard('');
                      setSelectedWardName('');
                      loadWardsByProvince(value);
                      // Mark that user has manually edited (prevent auto-mapper override)
                      setSkipAddressMapping(true);
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
                      {apiProvinces.map((prov) => (
                        <SelectItem key={prov._id} value={prov._id}>
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
                      const wardData = wards.find(w => w._id === value);
                      setSelectedWard(value);
                      setSelectedWardName(wardData?.name || '');
                      // Mark that user has manually edited (prevent auto-mapper override)
                      setSkipAddressMapping(true);
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
                        <SelectItem key={ward._id} value={ward._id}>
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

                {renderFieldWithIndicator(
                  'registeredAddress',
                  'Địa chỉ đăng ký kinh doanh *',
                  <Input
                    id="registeredAddress"
                    value={formData.registeredAddress || ''}
                    className={`placeholder:text-gray-500 ${errors.registeredAddress ? 'border-red-500' : ''}`}
                    onChange={(e) => handleFieldChange('registeredAddress', e.target.value)}
                    placeholder="Nhập địa chỉ đăng ký kinh doanh"
                  />,
                  true
                )}

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
                  <span style={{ lineHeight: '1' }}>Vị trí trên bản đồ</span>
                </Label>

                {/* Hidden input for full address (for map search) */}
                <input type="hidden" value={fullAddressForMap} />

                <MapLocationPicker
                  address={fullAddressForMap || formData.registeredAddress || ''}
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

              {/* Latitude / Longitude Display */}
              {/* <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Vĩ độ</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={formData.latitude || ''}
                    onChange={(e) => handleFieldChange('latitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Vĩ độ (từ bản đồ)"
                    disabled={false}
                  />
                  {formData.latitude && (
                    <p className="text-xs text-gray-500">
                      {formData.latitude.toFixed(6)}°
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Kinh độ</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={formData.longitude || ''}
                    onChange={(e) => handleFieldChange('longitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Kinh độ (từ bản đồ)"
                    disabled={false}
                  />
                  {formData.longitude && (
                    <p className="text-xs text-gray-500">
                      {formData.longitude.toFixed(6)}°
                    </p>
                  )}
                </div>
              </div> */}
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter style={{ gap: '12px' }}>
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
            Lưu cơ sở
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

