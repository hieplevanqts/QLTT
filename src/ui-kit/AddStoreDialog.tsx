import React, { useState, useMemo, useRef } from 'react';
import { Step3OwnerInfo } from './Step3OwnerInfo';
import { Step4AddressMap } from './Step4AddressMap';
import { Step5Confirmation } from './Step5Confirmation';
import { 
  Building2, 
  X, 
  Upload, 
  Loader2, 
  Sparkles,
  FileText,
  Users,
  MapPin,
  FileSpreadsheet,
  Target,
  Map as MapIcon,
  Edit3,
  Store,
  ShoppingBag,
  Coffee,
  UtensilsCrossed,
  Home,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Phone,
  Mail,
  User,
  XCircle,
  MapPinned,
  Info,
  Milestone,
  Cpu
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
import { Textarea } from '../app/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../app/components/ui/tooltip';
import { 
  provinces, 
  districts as allDistricts,
  wards as allWards,
  getDistrictsByProvince, 
  getWardsByDistrict 
} from '../data/vietnamLocations';
// Provide an array form of provinces for components that expect an array
const provinceList = Array.isArray(provinces)
  ? provinces
  : Object.entries(provinces).map(([key, val]) => ({ code: key, name: (val as any).name || key }));
import { toast } from 'sonner';
import styles from './AddStoreDialog.module.css';

interface AddStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: NewStoreData) => void;
}

export interface NewStoreData {
  // Step 1: Loại hình & Nguồn
  facilityType: string; // Loại hình cơ sở
  sourceType: 'manual' | 'import' | 'lead' | 'map'; // Nguồn tạo
  
  // Step 2: Thông tin định danh
  name: string;
  type: string;
  taxCode: string;
  businessLicense: string; // Số giấy phép kinh doanh - BẮT BUỘC
  industryName: string;
  establishedDate: string;
  operationStatus: string;
  businessPhone: string;
  businessArea: string;
  email?: string;
  website?: string;
  fax?: string;
  
  // Step 3: Thông tin chủ hộ
  ownerName?: string;
  ownerPhone?: string;
  ownerBirthYear: string;
  ownerIdNumber: string;
  
  // Step 4: Địa chỉ
  address: string;
  province: string;
  jurisdiction: string;
  ward: string;
  managementUnit: string;
  registeredAddress: string;
  headquarterAddress?: string;
  productionAddress?: string;
  branchAddresses?: string[];
  branchPhone?: string;
  latitude?: number;
  longitude?: number;
  locationPrecision?: string;
  locationConfidence?: string;
  
  // Step 5: Đính kèm & Xác nhận
  status: string;
  businessLicenseFile?: string; // Renamed from businessLicense to avoid conflict
  notes?: string;
  attachmentLinks?: string;
  sourceNotes?: string;
  tags?: string[];
}

type FacilityTypeOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
};

type SourceTypeOption = {
  id: 'manual' | 'import' | 'lead' | 'map';
  label: string;
  icon: React.ReactNode;
  description: string;
};

const facilityTypes: FacilityTypeOption[] = [
  {
    id: 'restaurant',
    label: 'Nhà hàng',
    icon: <UtensilsCrossed size={24} />,
    description: 'Nhà hàng, quán ăn, cơm phần',
  },
  {
    id: 'cafe',
    label: 'Quán cà phê / Trà sữa',
    icon: <Coffee size={24} />,
    description: 'Cà phê, trà sữa, đồ uống',
  },
  {
    id: 'retail',
    label: 'Cửa hàng bán lẻ',
    icon: <ShoppingBag size={24} />,
    description: 'Tạp hóa, siêu thị mini, cửa hàng tiện lợi',
  },
  {
    id: 'food-store',
    label: 'Cửa hàng thực phẩm',
    icon: <Store size={24} />,
    description: 'Thực phẩm tươi sống, hải sản, rau củ',
  },
  {
    id: 'household',
    label: 'Hộ kinh doanh cá thể',
    icon: <Home size={24} />,
    description: 'Hộ gia đình, kinh doanh nhỏ lẻ',
  },
  {
    id: 'other',
    label: 'Loại hình khác',
    icon: <Building2 size={24} />,
    description: 'Sản xuất, dịch vụ, thương mại khác',
  },
  // Additional facility types (shown when "Load more" is clicked)
  {
    id: 'pharmacy',
    label: 'Nhà thuốc',
    icon: <Building2 size={24} />,
    description: 'Nhà thuốc, quầy thuốc tây y',
  },
  {
    id: 'cosmetics',
    label: 'Cửa hàng mỹ phẩm',
    icon: <ShoppingBag size={24} />,
    description: 'Mỹ phẩm, chăm sóc sức khỏe',
  },
  {
    id: 'bakery',
    label: 'Tiệm bánh',
    icon: <Store size={24} />,
    description: 'Bánh ngọt, bánh mì, bánh kem',
  },
  {
    id: 'supermarket',
    label: 'Siêu thị',
    icon: <Building2 size={24} />,
    description: 'Siêu thị, trung tâm thương mại',
  },
  {
    id: 'hotel',
    label: 'Khách sạn / Nhà nghỉ',
    icon: <Building2 size={24} />,
    description: 'Khách sạn, nhà nghỉ, homestay',
  },
  {
    id: 'spa',
    label: 'Spa / Thẩm mỹ viện',
    icon: <Building2 size={24} />,
    description: 'Spa, thẩm mỹ, massage',
  },
  {
    id: 'gym',
    label: 'Phòng tập gym',
    icon: <Building2 size={24} />,
    description: 'Trung tâm thể hình, yoga',
  },
  {
    id: 'laundry',
    label: 'Giặt ủi',
    icon: <Building2 size={24} />,
    description: 'Dịch vụ giặt ủi, giặt khô',
  },
  {
    id: 'clinic',
    label: 'Phòng khám',
    icon: <Building2 size={24} />,
    description: 'Phòng khám đa khoa, chuyên khoa',
  },
  {
    id: 'education',
    label: 'Trung tâm giáo dục',
    icon: <Building2 size={24} />,
    description: 'Trung tâm ngoại ngữ, kỹ năng',
  },
];

const sourceTypes: SourceTypeOption[] = [
  {
    id: 'manual',
    label: 'Nhập tay',
    icon: <Edit3 size={24} />,
    description: 'Nhập thông tin thủ công từng trường',
  },
  {
    id: 'import',
    label: 'Import Excel',
    icon: <FileSpreadsheet size={24} />,
    description: 'Tải lên file Excel danh sách cơ sở',
  },
  {
    id: 'lead',
    label: 'Từ Lead',
    icon: <Target size={24} />,
    description: 'Chuyển đổi từ lead đã thu thập',
  },
  {
    id: 'map',
    label: 'Từ bản đồ',
    icon: <MapIcon size={24} />,
    description: 'Chọn vị trí trên bản đồ và thêm thông tin',
  },
];

// Industry categories
const industryCategories = [
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

// Geocode suggestions (mock data based on address from Step 3)
const geocodeSuggestions = [
  {
    name: 'Vị trí chính xác (Rooftop)',
    address: 'Số nhà cụ thể',
    lat: 10.762622,
    lng: 106.660172,
    precision: 'Rooftop',
    distance: 'Chính xác nhất',
  },
  {
    name: 'Giữa đường',
    address: 'Trung tâm đường',
    lat: 10.762500,
    lng: 106.660100,
    precision: 'Street',
    distance: '~15m',
  },
  {
    name: 'Trung tâm phường',
    address: 'Khu vực phường',
    lat: 10.762800,
    lng: 106.660300,
    precision: 'Ward',
    distance: '~100m',
  },
  {
    name: 'Trung tâm quận',
    address: 'Khu vực quận/huyện',
    lat: 10.763000,
    lng: 106.660500,
    precision: 'District',
    distance: '~500m',
  },
];

export function AddStoreDialog({ open, onOpenChange, onSubmit }: AddStoreDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showAllFacilityTypes, setShowAllFacilityTypes] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [businessLicensePreview, setBusinessLicensePreview] = useState<string | null>(null);
  const [isBusinessLicenseAutoFilled, setIsBusinessLicenseAutoFilled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ID Card upload state
  const [isUploadingIdCard, setIsUploadingIdCard] = useState(false);
  const [uploadedIdCard, setUploadedIdCard] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);

  // Step 4: Map & Geocoding state
  const [isPinConfirmed, setIsPinConfirmed] = useState(false);

  const [formData, setFormData] = useState<NewStoreData>({
    // Step 1
    facilityType: '',
    sourceType: 'manual',
    
    // Step 2
    name: '',
    type: '',
    taxCode: '',
    businessLicense: '',
    industryName: '',
    establishedDate: '',
    operationStatus: 'active', // Default: Hoạt động
    businessPhone: '',
    businessArea: '',
    email: '',
    website: '',
    fax: '',
    
    // Step 3
    ownerName: '',
    ownerPhone: '',
    ownerBirthYear: '',
    ownerIdNumber: '',
    
    // Step 4
    address: '',
    province: '',
    jurisdiction: '',
    ward: '',
    managementUnit: '',
    registeredAddress: '',
    headquarterAddress: '',
    productionAddress: '',
    branchAddresses: [],
    branchPhone: '',
    latitude: undefined,
    longitude: undefined,
    locationPrecision: '',
    locationConfidence: '',
    
    // Step 5
    status: 'pending',
    businessLicenseFile: '',
    notes: '',
    attachmentLinks: '',
    sourceNotes: '',
    tags: [],
  });

  // Get districts based on selected province
  const districts = useMemo(() => {
    if (!formData.province) return [];
    return getDistrictsByProvince(formData.province);
  }, [formData.province]);

  // Get wards based on selected province (all wards of all districts in the province)
  const wards = useMemo(() => {
    if (!formData.province) return [];
    // Get all districts of the selected province
    const provinceDistricts = getDistrictsByProvince(formData.province);
    const districtCodes = provinceDistricts.map(d => d.code);
    
    // Get all wards of these districts
    return allWards.filter(w => districtCodes.includes(w.districtCode));
  }, [formData.province]);

  // Mock OCR extraction function
  const mockOCRExtraction = async (file: File): Promise<Partial<NewStoreData>> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    return {
      name: 'Cửa hàng thực phẩm ABC',
      taxCode: '0123456789',
      businessLicense: 'GPKD-001-2020', // Tự động điền từ OCR
      industryName: 'Kinh doanh thực phẩm',
      establishedDate: '2020-01-15',
      businessPhone: '0287654321',
      registeredAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    };
  };

  const mockIdCardOCRExtraction = async (file: File): Promise<Partial<NewStoreData>> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    return {
      ownerName: 'Nguyễn Văn A',
      ownerIdNumber: '079078001234',
      ownerBirthYear: '1985',
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Định dạng file không hợp lệ. Vui lòng chọn JPG, PNG, WEBP hoặc PDF');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước file vượt quá 10MB');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    
    // Create preview URL for images (not PDF)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusinessLicensePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    try {
      const extractedData = await mockOCRExtraction(file);
      
      // Auto-fill form with extracted data
      setFormData(prev => ({
        ...prev,
        ...extractedData,
        address: extractedData.registeredAddress || prev.address,
        managementUnit: extractedData.jurisdiction 
          ? `Chi cục QLTT ${extractedData.jurisdiction}` 
          : prev.managementUnit,
      }));

      // Set flag if businessLicense was auto-filled
      if (extractedData.businessLicense) {
        setIsBusinessLicenseAutoFilled(true);
      }

      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Đã tự động điền thông tin từ giấy phép kinh doanh</span>
        </div>
      );
    } catch (error) {
      toast.error('Không thể đọc thông tin từ file. Vui lòng nhập thủ công');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(file.type) && !['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
      toast.error('Định dạng file không hợp lệ. Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước file vượt quá 10MB');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);

    try {
      // NOTE: Requires 'xlsx' package to be installed
      // TODO: Install with: npm install xlsx
      
      // For now, use mock data
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock extracted data from Excel
      const extractedData: Partial<NewStoreData> = {
        name: 'Cửa hàng thực phẩm sạch An Nhiên',
        industryName: 'Thực phẩm tươi sống',
        ownerName: 'Nguyễn Thị Mai',
        businessPhone: '0908765432',
        email: 'annhien@gmail.com',
        website: 'https://annhien.vn',
      };

      // Auto-fill form with extracted data
      setFormData(prev => ({
        ...prev,
        ...extractedData,
      }));

      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles className="h-4 w-4" />
          <span>Đã tự động điền thông tin từ Excel</span>
        </div>
      );
    } catch (error) {
      toast.error('Không thể đọc thông tin từ file Excel. Vui lòng kiểm tra format file');
      console.error('Excel parse error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleIdCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Định dạng file không hợp lệ. Vui lòng chọn JPG, PNG, WEBP hoặc PDF');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước file vượt quá 10MB');
      return;
    }

    setUploadedIdCard(file);
    setIsUploadingIdCard(true);
    
    // Create preview URL for images (not PDF)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    try {
      const extractedData = await mockIdCardOCRExtraction(file);
      
      // Auto-fill form with extracted data
      setFormData(prev => ({
        ...prev,
        ...extractedData,
      }));

      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Đã tự động điền thông tin từ giấy tờ tùy thân</span>
        </div>
      );
    } catch (error) {
      toast.error('Không thể đọc thông tin từ file. Vui lòng nhập thủ công');
    } finally {
      setIsUploadingIdCard(false);
    }
  };

  const handleSubmit = () => {
    // Validate required fields based on current step
    if (currentStep !== 5) return;

    // Auto-populate type from facilityType if not set
    const typeMapping: Record<string, string> = {
      'restaurant': 'Nhà hàng',
      'cafe': 'Quán cà phê',
      'retail': 'Cửa hàng bán lẻ',
      'grocery': 'Tạp hóa',
      'bakery': 'Tiệm bánh',
      'salon': 'Salon làm đẹp',
      'pharmacy': 'Nhà thuốc',
      'clinic': 'Phòng khám',
      'gym': 'Phòng tập gym',
      'hotel': 'Khách sạn',
      'other': 'Khác',
    };

    const finalFormData = {
      ...formData,
      type: formData.type || typeMapping[formData.facilityType] || formData.facilityType,
      // Explicitly ensure Step 5 fields are included
      tags: formData.tags || [],
      attachmentLinks: formData.attachmentLinks || '',
      sourceNotes: formData.sourceNotes || '',
      notes: formData.notes || '',
    };

    // Debug: Log tags to verify they're being included
    console.log('🏷️ Tags in formData:', formData.tags);
    console.log('🏷️ Tags in finalFormData:', finalFormData.tags);
    console.log('📋 attachmentLinks:', finalFormData.attachmentLinks);
    console.log('📝 sourceNotes:', finalFormData.sourceNotes);

    // Validate all required fields
    const requiredFields = {
      'Loại hình cơ sở': finalFormData.facilityType,
      'Tên hộ kinh doanh': finalFormData.name,
      'Mã số thuế': finalFormData.taxCode,
      'Số giấy phép kinh doanh': finalFormData.businessLicense,
      'Ngành kinh doanh': finalFormData.industryName,
      'Ngày thành lập': finalFormData.establishedDate,
      'Số điện thoại': finalFormData.businessPhone,
      'Diện tích': finalFormData.businessArea,
      'Tên chủ hộ': finalFormData.ownerName,
      'SĐT chủ hộ': finalFormData.ownerPhone,
      'Năm sinh chủ hộ': finalFormData.ownerBirthYear,
      'Số CCCD': finalFormData.ownerIdNumber,
      'Địa chỉ': finalFormData.address,
      'Tỉnh/Thành phố': finalFormData.province,
      'Phường/Xã': finalFormData.ward,
      'Đơn vị quản lý': finalFormData.managementUnit,
      'Độ chính xác vị trí': finalFormData.locationPrecision,
      'Độ tin cậy vị trí': finalFormData.locationConfidence,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0) {
      toast.error(
        <div>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>Vui lòng điền đầy đủ thông tin bắt buộc</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Thiếu: {missingFields.join(', ')}
          </div>
        </div>
      );
      return;
    }

    // Show success toast
    toast.success(
      <div>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Tạo cơ sở thành công!</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Cơ sở \"{finalFormData.name}\" đã được thêm vào hệ thống
        </div>
      </div>,
      {
        duration: 4000,
      }
    );

    onSubmit?.(finalFormData);
    onOpenChange(false);
    
    // TODO: Navigate to Store Detail page
    // Example: navigate(`/stores/${newStoreId}/overview`)
    
    // Reset form
    setFormData({
      facilityType: '',
      sourceType: 'manual',
      name: '',
      type: '',
      taxCode: '',
      industryName: '',
      establishedDate: '',
      operationStatus: 'active', // Default: Hoạt động
      businessPhone: '',
      businessArea: '',
      email: '',
      website: '',
      fax: '',
      ownerName: '',
      ownerPhone: '',
      ownerBirthYear: '',
      ownerIdNumber: '',
      address: '',
      province: '',
      jurisdiction: '',
      ward: '',
      managementUnit: '',
      registeredAddress: '',
      headquarterAddress: '',
      productionAddress: '',
      branchAddresses: [],
      branchPhone: '',
      latitude: undefined,
      longitude: undefined,
      locationPrecision: '',
      locationConfidence: '',
      status: 'pending',
      businessLicense: '',
      notes: '',
      attachmentLinks: '',
      sourceNotes: '',
      tags: [],
    });
    setCurrentStep(1);
    setUploadedFile(null);
    setBusinessLicensePreview(null);
    setIsBusinessLicenseAutoFilled(false);
    setUploadedIdCard(null);
    setIdCardPreview(null);
    setIsPinConfirmed(false);
  };

  const handleNext = () => {
    // Validate Step 1
    if (currentStep === 1) {
      if (!formData.facilityType) {
        toast.error('Vui lòng chọn loại hình cơ sở');
        return;
      }
    }
    
    // Validate Step 2
    if (currentStep === 2) {
      if (!formData.name || !formData.taxCode || !formData.businessLicense || !formData.industryName || !formData.establishedDate || !formData.operationStatus || !formData.businessPhone || !formData.businessArea) {
        toast.error('Vui lòng điền đầy đủ các trường bắt buộc (*)');
        return;
      }
      
      // Email validation
      if (formData.email && !isValidEmail(formData.email)) {
        toast.error('Email không hợp lệ');
        return;
      }
      
      // Phone validation
      if (!isValidPhone(formData.businessPhone)) {
        toast.error('Số điện thoại không hợp lệ');
        return;
      }
    }
    
    // Validate Step 3 - Owner info (all fields required)
    if (currentStep === 3) {
      if (!formData.ownerName) {
        toast.error('Vui lòng nhập tên chủ hộ kinh doanh');
        return;
      }
      
      if (!formData.ownerBirthYear) {
        toast.error('Vui lòng nhập năm sinh chủ hộ');
        return;
      }
      
      const yearNum = parseInt(formData.ownerBirthYear);
      const currentYear = new Date().getFullYear();
      if (yearNum < 1900 || yearNum > currentYear) {
        toast.error(`Năm sinh không hợp lệ (1900 - ${currentYear})`);
        return;
      }
      
      if (!formData.ownerIdNumber) {
        toast.error('Vui lòng nhập số CMTND/CCCD/ĐDCN');
        return;
      }
      
      if (!formData.ownerPhone) {
        toast.error('Vui lòng nhập số điện thoại chủ hộ');
        return;
      }
      
      if (!isValidPhone(formData.ownerPhone)) {
        toast.error('Số điện thoại chủ hộ không hợp lệ');
        return;
      }
    }
    
    // Validate Step 4 - Address & Map
    if (currentStep === 4) {
      // Address validation
      if (!formData.province || !formData.ward) {
        toast.error('Vui lòng chọn đầy đủ Tỉnh/Thành phố và Phường/Xã');
        return;
      }
      
      if (!formData.address.split(',')[0]?.trim() || !formData.address.split(',')[1]?.trim()) {
        toast.error('Vui lòng nhập đầy đủ Số nhà và Tên đường');
        return;
      }
      
      if (!formData.managementUnit) {
        toast.error('Vui lòng chọn Đơn vị quản lý');
        return;
      }
      
      // Branch phone validation (optional)
      if (formData.branchPhone && !isValidPhone(formData.branchPhone)) {
        toast.error('Số điện thoại chi nhánh không hợp lệ');
        return;
      }
      
      // Map validation
      if (!isPinConfirmed) {
        toast.error('Vui lòng xác nhận vị trí trên bản đồ');
        return;
      }
      
      if (!formData.locationPrecision) {
        toast.error('Vui lòng chọn độ chính xác vị trí');
        return;
      }
      
      if (!formData.locationConfidence) {
        toast.error('Vui lòng chọn độ tin cậy nguồn');
        return;
      }
      
      if (formData.latitude === undefined || formData.longitude === undefined) {
        toast.error('Vị trí không hợp lệ. Vui lòng chọn lại');
        return;
      }
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation (Vietnam format)
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Check for duplicates (mock function - in real app, check against existing stores)
  const checkDuplicates = (name: string, phone: string, businessLicense: string, jurisdictionCode: string) => {
    // Mock data - existing stores with jurisdiction
    const existingStores = [
      { 
        id: 'CS001',
        name: 'Cửa hàng thực phẩm ABC', 
        phone: '0901234567',
        businessLicense: 'GPKD-001-2020',
        jurisdiction: '79'  // Quận 1, HCM
      },
      { 
        id: 'CS002',
        name: 'Nhà hàng XYZ', 
        phone: '0912345678',
        businessLicense: 'GPKD-002-2021',
        jurisdiction: '79'  // Quận 1, HCM
      },
    ];
    
    // Filter stores in the same jurisdiction
    const storesInSameArea = jurisdictionCode 
      ? existingStores.filter(store => store.jurisdiction === jurisdictionCode)
      : existingStores;
    
    const duplicateByName = storesInSameArea.find(
      store => store.name.toLowerCase().includes(name.toLowerCase()) || 
               name.toLowerCase().includes(store.name.toLowerCase())
    );
    
    const duplicateByPhone = storesInSameArea.find(
      store => store.phone === phone.replace(/\s/g, '')
    );
    
    const duplicateByLicense = businessLicense 
      ? storesInSameArea.find(store => store.businessLicense === businessLicense.trim())
      : null;
    
    return {
      hasDuplicateName: !!duplicateByName,
      hasDuplicatePhone: !!duplicateByPhone,
      hasDuplicateLicense: !!duplicateByLicense,
      duplicateName: duplicateByName?.name,
      duplicatePhone: duplicateByPhone?.name,
      duplicateLicense: duplicateByLicense?.name,
      duplicateLicenseId: duplicateByLicense?.id,
      duplicateLicenseNumber: duplicateByLicense?.businessLicense,
    };
  };

  // Check duplicates when name, phone, or business license changes
  const duplicateCheck = useMemo(() => {
    if (formData.name.length > 3 || formData.businessPhone.length > 9 || (formData.businessLicense && formData.businessLicense.length > 3)) {
      return checkDuplicates(
        formData.name, 
        formData.businessPhone, 
        formData.businessLicense || '',
        formData.ward // Use ward as jurisdiction for checking
      );
    }
    return { 
      hasDuplicateName: false, 
      hasDuplicatePhone: false,
      hasDuplicateLicense: false 
    };
  }, [formData.name, formData.businessPhone, formData.businessLicense, formData.ward]);

  const canProceedStep1 = formData.facilityType !== '';
  const canProceedStep2 = formData.name && 
                          formData.taxCode &&
                          formData.businessLicense &&
                          formData.industryName && 
                          formData.establishedDate &&
                          formData.operationStatus &&
                          formData.businessPhone &&
                          formData.businessArea &&
                          (!formData.email || isValidEmail(formData.email)) &&
                          isValidPhone(formData.businessPhone);
  const canProceedStep3 = formData.ownerName &&
                          formData.ownerBirthYear &&
                          formData.ownerIdNumber &&
                          formData.ownerPhone &&
                          isValidPhone(formData.ownerPhone) &&
                          parseInt(formData.ownerBirthYear) >= 1900 &&
                          parseInt(formData.ownerBirthYear) <= new Date().getFullYear();
  const canProceedStep4 = formData.province &&
                          formData.ward &&
                          formData.address.split(',')[0]?.trim() &&
                          formData.address.split(',')[1]?.trim() &&
                          formData.managementUnit &&
                          (!formData.branchPhone || isValidPhone(formData.branchPhone)) &&
                          isPinConfirmed &&
                          formData.locationPrecision &&
                          formData.locationConfidence &&
                          formData.latitude !== undefined &&
                          formData.longitude !== undefined;

  // Step progress indicator
  const stepTitles = [
    'Loại hình & Nguồn',
    'Thông tin định danh',
    'Thông tin chủ hộ',
    'Địa chỉ & Định vị',
    'Xác nhận'
  ];

  // Show only first 6 facility types by default
  const displayedFacilityTypes = showAllFacilityTypes 
    ? facilityTypes 
    : facilityTypes.slice(0, 6);

  // Get file type label
  const getFileTypeLabel = (type: string): string => {
    if (type.startsWith('image/')) return 'Ảnh';
    if (type === 'application/pdf') return 'PDF';
    if (type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || 
        type.startsWith('application/vnd.ms-excel') || 
        type === 'text/csv') return 'Excel';
    return 'File';
  };

  // Handle smart file upload (Excel, image, PDF)
  const handleSmartFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'image/jpeg', 'image/png', 'image/webp', // Images
      'application/pdf', // PDF
    ];
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(file.type) && !['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
      toast.error('Định dạng file không hợp lệ. Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV, Ảnh (JPG, PNG, WEBP), PDF');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước file vượt quá 10MB');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    
    // Create preview URL for images (not PDF)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusinessLicensePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    try {
      let extractedData: Partial<NewStoreData> = {};
      
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        extractedData = await mockOCRExtraction(file);
      } else if (file.type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || 
                 file.type.startsWith('application/vnd.ms-excel') || 
                 file.type === 'text/csv') {
        // NOTE: Requires 'xlsx' package to be installed
        // TODO: Install with: npm install xlsx
        
        // For now, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Mock extracted data from Excel
        extractedData = {
          name: 'Cửa hàng thực phẩm sạch An Nhiên',
          taxCode: '0987654321',
          businessLicense: 'GPKD-002-2021', // Tự động điền từ Excel
          industryName: 'Thực phẩm tươi sống',
          ownerName: 'Nguyễn Thị Mai',
          businessPhone: '0908765432',
          email: 'annhien@gmail.com',
          website: 'https://annhien.vn',
        };
      }
      
      // Auto-fill form with extracted data
      setFormData(prev => ({
        ...prev,
        ...extractedData,
        address: extractedData.registeredAddress || prev.address,
        managementUnit: extractedData.jurisdiction 
          ? `Chi cục QLTT ${extractedData.jurisdiction}` 
          : prev.managementUnit,
      }));

      // Set flag if businessLicense was auto-filled
      if (extractedData.businessLicense) {
        setIsBusinessLicenseAutoFilled(true);
      }

      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Đã tự động điền thông tin từ file</span>
        </div>
      );
    } catch (error) {
      toast.error('Không thể đọc thông tin từ file. Vui lòng nhập thủ công');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 size={20} />
            Thêm cơ sở mới
          </DialogTitle>
          <DialogDescription>
            Bước {currentStep}/5: {stepTitles[currentStep - 1]}
          </DialogDescription>
        </DialogHeader>

        {/* Step Progress Bar */}
        <div className={styles.stepProgress}>
          {stepTitles.map((title, index) => (
            <div 
              key={index} 
              className={`${styles.stepItem} ${index + 1 <= currentStep ? styles.stepActive : ''} ${index + 1 < currentStep ? styles.stepComplete : ''}`}
            >
              <div className={styles.stepNumber}>
                {index + 1 < currentStep ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className={styles.stepTitle}>{title}</div>
            </div>
          ))}
        </div>

        {/* Step 1: Loại hình & Nguồn tạo */}
        {currentStep === 1 && (
          <div className={styles.stepContent}>
            {/* Loại hình cơ sở */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Loại hình cơ sở <span className={styles.required}>*</span>
              </h3>
              <p className={styles.sectionDescription}>
                Chọn loại hình phù hợp để hệ thống tự động điền các trường thông tin tương ứng
              </p>
              
              <div className={styles.facilityTypeGrid}>
                {displayedFacilityTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`${styles.facilityCard} ${formData.facilityType === type.id ? styles.facilityCardActive : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, facilityType: type.id }))}
                  >
                    <div className={styles.facilityIcon}>{type.icon}</div>
                    <div className={styles.facilityLabel}>{type.label}</div>
                    <div className={styles.facilityDescription}>{type.description}</div>
                    {formData.facilityType === type.id && (
                      <div className={styles.facilityCheck}>
                        <CheckCircle2 size={20} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Load More Button */}
              {facilityTypes.length > 6 && (
                <div className={styles.loadMoreContainer}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAllFacilityTypes(!showAllFacilityTypes)}
                    className={styles.loadMoreButton}
                  >
                    {showAllFacilityTypes ? 'Ẩn bớt' : `Xem thêm ${facilityTypes.length - 6} loại hình khác`}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Thông tin định danh */}
        {currentStep === 2 && (
          <div className={styles.stepContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Thông tin định danh cơ sở</h3>
              <p className={styles.sectionDescription}>
                Nhập thông tin cơ bản của cơ sở kinh doanh. Các trường đánh dấu (*) là bắt buộc.
              </p>

              {/* Excel Upload Zone */}
              <div className={styles.uploadZone}>
                <div className={styles.uploadZoneHeader}>
                  <FileSpreadsheet size={20} />
                  <span>Tự động điền thông tin từ file</span>
                </div>
                <p className={styles.uploadZoneDescription}>
                  Upload file Excel/ảnh/PDF chứa thông tin cơ sở để tự động điền vào form. <strong>Hệ thống sẽ tự động trích xuất Số giấy phép kinh doanh</strong> và các thông tin khác.
                </p>
                
                {uploadedFile ? (
                  <div className={styles.uploadedFileCard}>
                    <div className={styles.uploadedFileInfo}>
                      {uploadedFile.type.startsWith('image/') ? (
                        <div className={styles.imagePreviewSmall}>
                          {businessLicensePreview && (
                            <img 
                              src={businessLicensePreview} 
                              alt="Preview" 
                              className={styles.previewImage}
                            />
                          )}
                        </div>
                      ) : (
                        <FileSpreadsheet size={24} className={styles.uploadedFileIcon} />
                      )}
                      <div className={styles.uploadedFileDetails}>
                        <div className={styles.uploadedFileName}>{uploadedFile.name}</div>
                        <div className={styles.uploadedFileSize}>
                          {(uploadedFile.size / 1024).toFixed(2)} KB • {getFileTypeLabel(uploadedFile.type)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.uploadedFileRemove}
                      onClick={() => {
                        setUploadedFile(null);
                        setBusinessLicensePreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadDropZone}>
                    <Upload size={32} className={styles.uploadIcon} />
                    <p className={styles.uploadText}>
                      Kéo thả file hoặc{' '}
                      <label htmlFor="file-upload" className={styles.uploadLink}>
                        chọn file
                      </label>
                    </p>
                    <p className={styles.uploadHint}>
                      Hỗ trợ: Excel (.xlsx, .xls), Ảnh (JPG, PNG, WEBP), PDF (Tối đa 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleSmartFileUpload}
                      className={styles.uploadInput}
                    />
                  </div>
                )}
              </div>

              {/* Duplicate Warning */}
              {(duplicateCheck.hasDuplicateName || duplicateCheck.hasDuplicatePhone || duplicateCheck.hasDuplicateLicense) && (
                <div className={styles.warningBox}>
                  <div className={styles.warningIcon}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className={styles.warningContent}>
                    <div className={styles.warningTitle}>Cảnh báo trùng lặp</div>
                    <div className={styles.warningText}>
                      {duplicateCheck.hasDuplicateName && (
                        <div>• Tên cơ sở tương tự với "{duplicateCheck.duplicateName}"</div>
                      )}
                      {duplicateCheck.hasDuplicatePhone && (
                        <div>• Số điện thoại đã tồn tại trong cơ sở "{duplicateCheck.duplicatePhone}"</div>
                      )}
                      {duplicateCheck.hasDuplicateLicense && (
                        <div>
                          • Số giấy phép kinh doanh "{duplicateCheck.duplicateLicenseNumber}" đã tồn tại trong cơ sở "{duplicateCheck.duplicateLicense}" •{' '}
                          <a 
                            href={`#/registry/stores/${duplicateCheck.duplicateLicenseId}`}
                            className={styles.viewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Xem chi tiết
                          </a>
                        </div>
                      )}
                      <div style={{ marginTop: 'var(--spacing-2)', fontSize: '13px' }}>
                        Bạn vẫn có thể tiếp tục nếu đây là cơ sở mới. Việc gộp dữ liệu sẽ được thực hiện qua <strong>Dedup/Merge Workbench</strong>.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.formGrid}>
                {/* 1. Tên hộ kinh doanh */}
                <div className={styles.formGroup}>
                  <Label htmlFor="store-name">
                    Tên hộ kinh doanh <span className={styles.required}>*</span>
                  </Label>
                  <Input
                    id="store-name"
                    placeholder="VD: Hộ kinh doanh Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <span className={styles.fieldHelper}>
                    Tên đăng ký chính thức của hộ kinh doanh theo GPKD
                  </span>
                </div>

                {/* 2. Mã số thuế */}
                <div className={styles.formGroup}>
                  <Label htmlFor="tax-code">
                    Mã số thuế <span className={styles.required}>*</span>
                  </Label>
                  <Input
                    id="tax-code"
                    placeholder="VD: 0123456789"
                    value={formData.taxCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, taxCode: e.target.value }))}
                  />
                  <span className={styles.fieldHelper}>
                    Khóa định danh chính, duy nhất cho mỗi hộ kinh doanh
                  </span>
                </div>

                {/* 2.5. Số giấy phép kinh doanh */}
                <div className={styles.formGroup}>
                  <Label htmlFor="business-license">
                    Số giấy phép kinh doanh <span className={styles.required}>*</span>
                    {isBusinessLicenseAutoFilled && (
                      <span className={styles.autoFilledBadge}>
                        <Sparkles size={12} />
                        Tự động điền
                      </span>
                    )}
                  </Label>
                  <Input
                    id="business-license"
                    placeholder="VD: GPKD-001-2023"
                    value={formData.businessLicense}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, businessLicense: e.target.value }));
                      // Clear auto-filled flag when user manually edits
                      if (isBusinessLicenseAutoFilled) {
                        setIsBusinessLicenseAutoFilled(false);
                      }
                    }}
                  />
                  {duplicateCheck.hasDuplicateLicense && (
                    <div className={styles.fieldWarning}>
                      <AlertTriangle size={14} />
                      <span>
                        Số GPKD này đã tồn tại trong cơ sở "{duplicateCheck.duplicateLicense}" •{' '}
                        <a 
                          href={`#/registry/stores/${duplicateCheck.duplicateLicenseId}`}
                          className={styles.viewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem chi tiết
                        </a>
                      </span>
                    </div>
                  )}
                  <span className={styles.fieldHelper}>
                    Số giấy phép kinh doanh - Tự động điền khi upload file. Kiểm tra trùng lặp trong phạm vi địa bàn
                  </span>
                </div>

                {/* 3. Tên ngành kinh doanh */}
                <div className={styles.formGroup}>
                  <Label htmlFor="industry">
                    Tên ngành kinh doanh <span className={styles.required}>*</span>
                  </Label>
                  <Select
                    value={formData.industryName}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, industryName: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngành kinh doanh" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryCategories.map(category => (
                        <SelectItem key={category.value} value={category.label}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className={styles.fieldHelper}>
                    Người dùng chọn hoặc scan GPKD; lấy từ danh mục chuẩn
                  </span>
                </div>

                {/* 4. Ngày thành lập */}
                <div className={styles.formGroup}>
                  <Label htmlFor="established-date">
                    Ngày thành lập <span className={styles.required}>*</span>
                  </Label>
                  <Input
                    id="established-date"
                    type="date"
                    value={formData.establishedDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, establishedDate: e.target.value }))}
                  />
                  <span className={styles.fieldHelper}>
                    Người dùng nhập hoặc scan từ GPKD
                  </span>
                </div>

                {/* 5. Tình trạng hoạt động */}
                <div className={styles.formGroup}>
                  <Label htmlFor="operation-status">
                    Tình trạng hoạt động <span className={styles.required}>*</span>
                  </Label>
                  <Select
                    value={formData.operationStatus}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, operationStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tình trạng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="suspended">Tạm ngừng</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className={styles.fieldHelper}>
                    Do QLTT cập nhật; mặc định "Hoạt động"
                  </span>
                </div>

                {/* 6. SĐT hộ kinh doanh */}
                <div className={styles.formGroup}>
                  <Label htmlFor="phone">
                    SĐT hộ kinh doanh <span className={styles.required}>*</span>
                  </Label>
                  <div className={styles.inputWithIcon}>
                    <Phone size={18} className={styles.inputIcon} />
                    <Input
                      id="phone"
                      placeholder="VD: 0901234567"
                      value={formData.businessPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessPhone: e.target.value }))}
                      className={styles.inputPadded}
                    />
                  </div>
                  {formData.businessPhone && !isValidPhone(formData.businessPhone) && (
                    <span className={styles.fieldError}>Số điện thoại không hợp lệ</span>
                  )}
                  <span className={styles.fieldHelper}>
                    Người dùng nhập; hiển thị công khai
                  </span>
                </div>

                {/* 7. Diện tích cửa hàng */}
                <div className={styles.formGroup}>
                  <Label htmlFor="business-area">
                    Diện tích cửa hàng (m²) <span className={styles.required}>*</span>
                  </Label>
                  <Input
                    id="business-area"
                    type="number"
                    placeholder="VD: 50"
                    value={formData.businessArea}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessArea: e.target.value }))}
                  />
                  <span className={styles.fieldHelper}>
                    Người dùng nhập; hiển thị
                  </span>
                </div>

                {/* 8. Email */}
                <div className={styles.formGroup}>
                  <Label htmlFor="email">Email</Label>
                  <div className={styles.inputWithIcon}>
                    <Mail size={18} className={styles.inputIcon} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="VD: lienhe@cosodoanhnghiep.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={styles.inputPadded}
                    />
                  </div>
                  {formData.email && !isValidEmail(formData.email) && (
                    <span className={styles.fieldError}>Email không hợp lệ</span>
                  )}
                  <span className={styles.fieldHelper}>
                    Không bắt buộc; người dùng nhập
                  </span>
                </div>

                {/* 9. Website */}
                <div className={styles.formGroup}>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="VD: https://website.com"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  />
                  <span className={styles.fieldHelper}>
                    Hiển thị công khai; người dùng nhập
                  </span>
                </div>

                {/* 10. Fax */}
                <div className={styles.formGroup}>
                  <Label htmlFor="fax">Fax</Label>
                  <Input
                    id="fax"
                    placeholder="VD: 0287654321"
                    value={formData.fax}
                    onChange={(e) => setFormData(prev => ({ ...prev, fax: e.target.value }))}
                  />
                  <span className={styles.fieldHelper}>
                    Không bắt buộc; ít sử dụng
                  </span>
                </div>
              </div>

              {/* Ghi chú */}
              <div className={styles.formGroupSingle}>
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  placeholder="Thông tin bổ sung về cơ sở..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Thông tin chủ hộ */}
        {currentStep === 3 && (
          <Step3OwnerInfo
            formData={formData}
            setFormData={setFormData}
            isValidPhone={isValidPhone}
          />
        )}

        {/* Step 4: Địa chỉ & Định vị */}
        {currentStep === 4 && (
          <TooltipProvider>
            <Step4AddressMap
              formData={formData}
              setFormData={setFormData}
              isPinConfirmed={isPinConfirmed}
              setIsPinConfirmed={setIsPinConfirmed}
              wards={wards}
              districts={districts}
              provinces={provinceList}
              geocodeSuggestions={geocodeSuggestions}
              isValidPhone={isValidPhone}
            />
          </TooltipProvider>
        )}

        {/* OLD STEP 3 - TO BE REMOVED */}
        {false && currentStep === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Địa chỉ cơ sở kinh doanh</h3>
              <p className={styles.sectionDescription}>
                Nhập địa chỉ chính xác của cơ sở để hệ thống có thể quản lý và phân công công tác kiểm tra.
              </p>

              <div className={styles.formGrid}>
                {/* Tỉnh/Thành phố */}
                <div className={styles.formGroup}>
                  <Label htmlFor="province">
                    Tỉnh/Thành phố <span className={styles.required}>*</span>
                  </Label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        province: value,
                        jurisdiction: '', // Reset district when province changes
                        ward: '', // Reset ward when province changes
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tỉnh/thành phố" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinceList.map((province: any) => (
                        <SelectItem key={province.code} value={province.code}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!formData.province && formData.jurisdiction && (
                    <span className={styles.fieldError}>Vui lòng chọn tỉnh/thành phố</span>
                  )}
                </div>

                {/* Quận/Huyện */}
                <div className={styles.formGroup}>
                  <Label htmlFor="district">
                    Quận/Huyện <span className={styles.required}>*</span>
                  </Label>
                  <Select
                    value={formData.jurisdiction}
                    onValueChange={(value) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        jurisdiction: value,
                        ward: '', // Reset ward when district changes
                      }));
                    }}
                    disabled={!formData.province}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.province ? "Chọn quận/huyện" : "Chọn tỉnh/thành trước"} />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map(district => (
                        <SelectItem key={district.code} value={district.code}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.province && !formData.jurisdiction && formData.ward && (
                    <span className={styles.fieldError}>Vui lòng chọn quận/huyện</span>
                  )}
                  {!formData.province && (
                    <span className={styles.fieldHelper}>
                      Chọn tỉnh/thành phố trước để hiển thị danh sách quận/huyện
                    </span>
                  )}
                </div>

                {/* Phường/Xã */}
                <div className={styles.formGroup}>
                  <Label htmlFor="ward">
                    Phường/Xã <span className={styles.required}>*</span>
                  </Label>
                  <Select
                    value={formData.ward}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, ward: value }))}
                    disabled={!formData.jurisdiction}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.jurisdiction ? "Chọn phường/xã" : "Chọn quận/huyện trước"} />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map(ward => (
                        <SelectItem key={ward.code} value={ward.code}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.jurisdiction && !formData.ward && (
                    <span className={styles.fieldError}>Vui lòng chọn phường/xã</span>
                  )}
                  {!formData.jurisdiction && (
                    <span className={styles.fieldHelper}>
                      Chọn quận/huyện trước để hiển thị danh sách phường/xã
                    </span>
                  )}
                </div>

                {/* Đơn vị quản lý */}
                <div className={styles.formGroup}>
                  <Label htmlFor="management-unit">
                    Đơn vị quản lý <span className={styles.required}>*</span>
                  </Label>
                  <Select
                    value={formData.managementUnit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, managementUnit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đơn vị quản lý" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qltt-hcm">Chi cục QLTT TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="qltt-q1">Chi cục QLTT Quận 1</SelectItem>
                      <SelectItem value="qltt-q3">Chi cục QLTT Quận 3</SelectItem>
                      <SelectItem value="qltt-q5">Chi cục QLTT Quận 5</SelectItem>
                      <SelectItem value="qltt-pn">Chi cục QLTT Quận Phú Nhuận</SelectItem>
                      <SelectItem value="qltt-tb">Chi cục QLTT Quận Tân Bình</SelectItem>
                    </SelectContent>
                  </Select>
                  {!formData.managementUnit && (
                    <span className={styles.fieldError}>Vui lòng chọn đơn vị quản lý</span>
                  )}
                  <span className={styles.fieldHelper}>
                    Đơn vị QLTT phụ trách kiểm tra và quản lý cơ sở này
                  </span>
                </div>
              </div>

              {/* Địa chỉ chi tiết */}
              <div className={styles.formGrid}>
                {/* Số nhà */}
                <div className={styles.formGroup}>
                  <Label htmlFor="street-number">
                    Số nhà <span className={styles.required}>*</span>
                  </Label>
                  <Input
                    id="street-number"
                    placeholder="VD: 123"
                    value={formData.address.split(',')[0] || ''}
                    onChange={(e) => {
                      const parts = formData.address.split(',');
                      parts[0] = e.target.value;
                      setFormData(prev => ({ ...prev, address: parts.filter(p => p.trim()).join(', ') }));
                    }}
                  />
                  {!formData.address.split(',')[0]?.trim() && (
                    <span className={styles.fieldError}>Vui lòng nhập số nhà</span>
                  )}
                  <span className={styles.fieldHelper}>
                    Số nhà, tòa nhà hoặc căn hộ
                  </span>
                </div>

                {/* Tên đường */}
                <div className={styles.formGroup}>
                  <Label htmlFor="street-name">
                    Tên đường <span className={styles.required}>*</span>
                  </Label>
                  <Input
                    id="street-name"
                    placeholder="VD: Nguyễn Huệ"
                    value={formData.address.split(',')[1]?.trim() || ''}
                    onChange={(e) => {
                      const parts = formData.address.split(',');
                      parts[1] = e.target.value;
                      setFormData(prev => ({ ...prev, address: parts.filter(p => p.trim()).join(', ') }));
                    }}
                  />
                  {formData.address.split(',')[0]?.trim() && !formData.address.split(',')[1]?.trim() && (
                    <span className={styles.fieldError}>Vui lòng nhập tên đường</span>
                  )}
                  <span className={styles.fieldHelper}>
                    Tên đường, phố, khu vực
                  </span>
                </div>
              </div>

              {/* Địa chỉ đầy đủ (tự động tạo) */}
              <div className={styles.formGroupSingle}>
                <Label htmlFor="full-address">
                  Địa chỉ đầy đủ
                </Label>
                <div className={styles.addressPreview}>
                  {(() => {
                    const parts = [];
                    if (formData.address) parts.push(formData.address);
                    if (formData.ward) {
                      const wardName = wards.find(w => w.code === formData.ward)?.name;
                      if (wardName) parts.push(wardName);
                    }
                    if (formData.jurisdiction) {
                      const districtName = districts.find(d => d.code === formData.jurisdiction)?.name;
                      if (districtName) parts.push(districtName);
                    }
                    if (formData.province) {
                      const provinceName = provinces.find(p => p.code === formData.province)?.name;
                      if (provinceName) parts.push(provinceName);
                    }
                    return parts.length > 0 ? parts.join(', ') : 'Địa chỉ sẽ được tạo tự động khi bạn điền đầy đủ thông tin';
                  })()}
                </div>
                <span className={styles.fieldHelper}>
                  Địa chỉ này được tạo tự động từ các trường bên trên
                </span>
              </div>

              {/* Validation Summary */}
              {(formData.province || formData.jurisdiction || formData.ward || formData.address) && 
               (!formData.province || !formData.jurisdiction || !formData.ward || !formData.address.split(',')[0]?.trim() || !formData.address.split(',')[1]?.trim() || !formData.managementUnit) && (
                <div className={styles.warningBox}>
                  <div className={styles.warningIcon}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className={styles.warningContent}>
                    <div className={styles.warningTitle}>Địa chỉ chưa đầy đủ</div>
                    <div className={styles.warningText}>
                      Vui lòng điền đầy đủ các thông tin:
                      <ul style={{ marginTop: 'var(--spacing-2)', paddingLeft: 'var(--spacing-5)' }}>
                        {!formData.province && <li>Tỉnh/Thành phố</li>}
                        {!formData.jurisdiction && <li>Quận/Huyện</li>}
                        {!formData.ward && <li>Phường/Xã</li>}
                        {!formData.address.split(',')[0]?.trim() && <li>Số nhà</li>}
                        {!formData.address.split(',')[1]?.trim() && <li>Tên đường</li>}
                        {!formData.managementUnit && <li>Đơn vị quản lý</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Địa chỉ bổ sung */}
              <div className={styles.section} style={{ marginTop: 'var(--spacing-6)' }}>
                <h4 className={styles.subsectionTitle}>Địa chỉ bổ sung (Không bắt buộc)</h4>
                
                <div className={styles.formGrid}>
                  {/* Địa chỉ đăng ký kinh doanh */}
                  <div className={styles.formGroup}>
                    <Label htmlFor="registered-address">Địa chỉ đăng ký kinh doanh</Label>
                    <Input
                      id="registered-address"
                      placeholder="VD: 456 Lê Lợi, Quận 1, TP.HCM"
                      value={formData.registeredAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, registeredAddress: e.target.value }))}
                    />
                    <span className={styles.fieldHelper}>
                      Địa chỉ ghi trên giấy phép kinh doanh (nếu khác địa chỉ trên)
                    </span>
                  </div>

                  {/* Địa chỉ trụ sở chính */}
                  <div className={styles.formGroup}>
                    <Label htmlFor="headquarter-address">Địa chỉ trụ sở chính</Label>
                    <Input
                      id="headquarter-address"
                      placeholder="VD: 789 Hai Bà Trưng, Quận 3, TP.HCM"
                      value={formData.headquarterAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, headquarterAddress: e.target.value }))}
                    />
                    <span className={styles.fieldHelper}>
                      Địa chỉ trụ sở chính (nếu khác địa chỉ kinh doanh)
                    </span>
                  </div>

                  {/* Địa chỉ sản xuất */}
                  <div className={styles.formGroup}>
                    <Label htmlFor="production-address">Địa chỉ sản xuất</Label>
                    <Input
                      id="production-address"
                      placeholder="VD: KCN Tân Bình, TP.HCM"
                      value={formData.productionAddress}
                      onChange={(e) => setFormData(prev => ({ ...prev, productionAddress: e.target.value }))}
                    />
                    <span className={styles.fieldHelper}>
                      Địa chỉ nhà máy/xưởng sản xuất (nếu có)
                    </span>
                  </div>

                  {/* SĐT chi nhánh */}
                  <div className={styles.formGroup}>
                    <Label htmlFor="branch-phone">SĐT chi nhánh</Label>
                    <div className={styles.inputWithIcon}>
                      <Phone size={18} className={styles.inputIcon} />
                      <Input
                        id="branch-phone"
                        placeholder="VD: 0281234567"
                        value={formData.branchPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, branchPhone: e.target.value }))}
                        className={styles.inputPadded}
                      />
                    </div>
                    {formData.branchPhone && !isValidPhone(formData.branchPhone) && (
                      <span className={styles.fieldError}>Số điện thoại không hợp lệ</span>
                    )}
                    <span className={styles.fieldHelper}>
                      Số điện thoại liên hệ của chi nhánh (nếu có)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Đính kèm & Xác nhận */}
        {currentStep === 5 && (
          <Step5Confirmation
            formData={formData}
            setFormData={setFormData}
            wards={wards}
            districts={districts}
            provinces={provinces}
          />
        )}

        <DialogFooter className={styles.dialogFooter}>
          <div className={styles.footerActions}>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
              >
                <ArrowLeft size={16} />
                Quay lại
              </Button>
            )}
            
            <div className={styles.footerRight}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              
              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={(currentStep === 1 && !canProceedStep1) || (currentStep === 2 && !canProceedStep2) || (currentStep === 3 && !canProceedStep3) || (currentStep === 4 && !canProceedStep4)}
                >
                  Tiếp tục
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  className={styles.completeButton}
                >
                  <CheckCircle2 size={16} />
                  Hoàn tất
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}