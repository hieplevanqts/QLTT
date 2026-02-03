import { FacilityStatus } from '@/components/ui-kit/FacilityStatusBadge';
import { LegalDocument } from '@/components/ui-kit/LegalDocumentItem';

export interface Store {
  id: number;
  merchantId?: string; // UUID from Supabase merchants table
  departmentId?: string; // Department ID that owns this store
  name: string;
  address: string;
  type: string;
  status: FacilityStatus;
  riskLevel: 'low' | 'medium' | 'high' | 'none';
  lastInspection: string;
  area_name: string;
  province?: string; // Province name (for display)
  provinceCode?: string; // Province code (for form editing)
  jurisdiction: string; // District name (for display)
  jurisdictionCode?: string; // District code (for form editing)
  ward?: string; // Ward name (for display)
  wardCode?: string; // Ward code (for form editing)
  managementUnit: string;
  latitude?: number;  // Vĩ độ (8°N - 23.5°N cho Việt Nam)
  longitude?: number; // Kinh độ (102°E - 110°E cho Việt Nam)
  legalDocuments?: LegalDocument[]; // Legal documents for this store
  // Additional fields for detail page
  ownerName?: string; // Tên chủ cơ sở
  ownerPhone?: string; // SĐT chủ hộ
  ownerPhone2?: string; // SĐT chủ hộ thứ 2
  ownerBirthYear?: number; // Năm sinh chủ hộ
  ownerIdNumber?: string; // Số CMTND/CCCD
  ownerEmail?: string; // Email chủ hộ
  phone?: string; // Số điện thoại
  email?: string; // Email
  businessPhone?: string; // SĐT cơ sở
  businessType?: string; // Loại hình kinh doanh
  gpsCoordinates?: string; // GPS coordinates formatted string
  isVerified?: boolean; // Đã xác minh
  // New fields from AddStoreDialog
  // Step 1
  facilityType?: string; // Loại hình cơ sở
  sourceType?: 'manual' | 'import' | 'lead' | 'map'; // Nguồn tạo
  // Step 2
  taxCode?: string; // Mã số thuế
  businessLicense?: string; // Số giấy phép kinh doanh
  industryName?: string; // Tên ngành kinh doanh
  establishedDate?: string; // Ngày thành lập
  operationStatus?: string; // Trạng thái hoạt động
  businessArea?: string; // Diện tích cửa hàng
  website?: string; // Website
  fax?: string; // Fax
  // Step 4
  registeredAddress?: string; // Địa chỉ đăng ký kinh doanh
  headquarterAddress?: string; // Địa chỉ trụ sở chính
  productionAddress?: string; // Địa chỉ cơ sở sản xuất
  branchAddresses?: string[]; // Địa chỉ chi nhánh
  branchPhone?: string; // Điện thoại cơ sở
  locationPrecision?: string; // Độ chính xác vị trí
  locationConfidence?: string; // Độ tin cậy vị trí
  // Step 5
  notes?: string; // Ghi chú
  attachmentLinks?: string; // Links đính kèm
  sourceNotes?: string; // Nguồn ghi chú
  tags?: string[]; // Tags
  businessLicenseFile?: string; // File giấy phép
  // Compatibility
  district?: string; // District name for compatibility
  hasComplaints?: boolean; // Added for filtering support
}

const storeTypes = [
  'Nhà hàng',
  'Cửa hàng thực phẩm',
  'Quán cà phê',
  'Siêu thị mini',
  'Cửa hàng tạp hóa',
  'Quán ăn',
  'Cửa hàng mỹ phẩm',
  'Tiệm bánh',
  'Quán trà sữa',
  'Cửa hàng tiện lợi',
];

const jurisdictions = [
  'Phường 1',
  'Phường 2',
  'Phường 3',
  'Phường 4',
  'Phường 5',
  'Phường 6',
  'Phường 7',
  'Phường 8',
  'Phường 9',
  'Phường 10',
  'Phường 11',
  'Phường 12',
  'Thủ Đức',
  'Bình Thạnh',
  'Tân Bình',
  'Tân Phú',
  'Phú Nhuận',
  'Gò Vấp',
  'Bình Tân',
];

const streets = [
  'Nguyễn Huệ',
  'Lê Lợi',
  'Trần Hưng Đạo',
  'Hai Bà Trưng',
  'Nguyễn Trãi',
  'Võ Văn Tần',
  'Lý Thường Kiệt',
  'Cách Mạng Tháng 8',
  'Phan Xích Long',
  'Điện Biên Phủ',
  'Nam Kỳ Khởi Nghĩa',
  'Pasteur',
  'Cộng Hòa',
  'Hoàng Văn Thụ',
  'Phan Đăng Lưu',
  'Lê Văn Sỹ',
  'Nguyễn Văn Trỗi',
  'Trường Chinh',
  'Lạc Long Quân',
  'Quang Trung',
];

const storeNames = [
  'Phở Hà Nội',
  'Bánh ngọt ABC',
  'Cà phê XYZ',
  'Mini Mart',
  'Tạp hóa Thanh Loan',
  'Hải Sản Tươi',
  'Ăn vặt 247',
  'Mỹ phẩm Thảo Nhi',
  'Bánh mì Sài Gòn',
  'Trà sữa GoGo',
  'Bún bò Huế',
  'Cơm tấm Nam Vang',
  'Lẩu Thái',
  'Tiệm bánh Ngọt',
  'Quán Nhậu',
  'Café Sân Vườn',
  'Nhà hàng Món Việt',
  'Siêu thị Nguyên',
  'Cửa hàng An Phát',
  'Quán ăn Bình Dân',
];

const statuses: FacilityStatus[] = ['active', 'pending', 'suspended', 'rejected', 'refuse'];
const riskLevels: ('low' | 'medium' | 'high' | 'none')[] = ['low', 'medium', 'high', 'none'];

function generateStoreName(index: number): string {
  const prefix = storeTypes[index % storeTypes.length];
  const name = storeNames[index % storeNames.length];
  return `${prefix} ${name} ${index > 20 ? `#${index}` : ''}`.trim();
}

function generateAddress(index: number): string {
  const street = streets[index % streets.length];
  const houseNumber = 100 + (index * 13) % 900;
  const jurisdiction = jurisdictions[index % jurisdictions.length];
  return `${houseNumber} ${street}, ${jurisdiction}, Hà Nội`;
}

function generateInspectionDate(index: number): string {
  const statusIndex = index % statuses.length;
  if (statuses[statusIndex] === 'pending' || statuses[statusIndex] === 'rejected' || statuses[statusIndex] === 'refuse') {
    return 'Chưa kiểm tra';
  }
  
  const day = (index % 28) + 1;
  const month = (index % 12) + 1;
  const year = 2025 + (index % 2);
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
}

export const mockStores: Store[] = Array.from({ length: 10000 }, (_, index) => {
  const id = index + 1;
  const jurisdictionIndex = index % jurisdictions.length;
  const jurisdiction = jurisdictions[jurisdictionIndex];
  const statusIndex = index % statuses.length;
  const status = statuses[statusIndex];
  
  // More accurate coordinates for different districts in Ho Chi Minh City
  // District 1: 10.762622, 106.660172
  // District 3: 10.782778, 106.687222
  // District 5: 10.755833, 106.666667
  // District 10: 10.772778, 106.668889
  const districtCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'Phường 1': { lat: 10.7627, lng: 106.6602 },
    'Phường 2': { lat: 10.7770, lng: 106.7314 },
    'Phường 3': { lat: 10.7828, lng: 106.6872 },
    'Phường 4': { lat: 10.7572, lng: 106.7032 },
    'Phường 5': { lat: 10.7558, lng: 106.6667 },
    'Phường 6': { lat: 10.7428, lng: 106.6345 },
    'Phường 7': { lat: 10.7337, lng: 106.7221 },
    'Phường 8': { lat: 10.7271, lng: 106.6294 },
    'Phường 9': { lat: 10.8415, lng: 106.7937 },
    'Phường 10': { lat: 10.7728, lng: 106.6689 },
    'Phường 11': { lat: 10.7631, lng: 106.6503 },
    'Phường 12': { lat: 10.8550, lng: 106.6686 },
    'Thủ Đức': { lat: 10.8532, lng: 106.7633 },
    'Bình Thạnh': { lat: 10.8081, lng: 106.7044 },
    'Tân Bình': { lat: 10.7992, lng: 106.6528 },
    'Tân Phú': { lat: 10.7870, lng: 106.6297 },
    'Phú Nhuận': { lat: 10.7967, lng: 106.6833 },
    'Gò Vấp': { lat: 10.8376, lng: 106.6668 },
    'Bình Tân': { lat: 10.7426, lng: 106.6070 },
  };
  
  const baseCoord = districtCoordinates[jurisdiction] || { lat: 10.8231, lng: 106.6296 };
  // Add small variation to create unique coordinates for each store
  const latVariation = (Math.random() - 0.5) * 0.01; // +/- ~500m
  const lngVariation = (Math.random() - 0.5) * 0.01;
  
  const latitude = baseCoord.lat + latVariation;
  const longitude = baseCoord.lng + lngVariation;
  
  // Generate owner names
  const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ'];
  const middleNames = ['Văn', 'Thị', 'Đức', 'Minh', 'Hồng', 'Thanh', 'Kim', 'Hoàng', 'Quang', 'Anh'];
  const lastNames = ['Hùng', 'Lan', 'Hải', 'Mai', 'Phương', 'Tuấn', 'Linh', 'Nam', 'Hương', 'Long'];
  
  const ownerName = `${firstNames[index % firstNames.length]} ${middleNames[(index * 2) % middleNames.length]} ${lastNames[(index * 3) % lastNames.length]}`;
  
  // Generate phone numbers (Vietnam format)
  const phonePrefix = ['090', '091', '093', '094', '097', '098', '086', '096', '032', '033'];
  const phone = `${phonePrefix[index % phonePrefix.length]}${String(1000000 + (index * 123456) % 9000000).substring(0, 7)}`;
  const ownerPhone = `${phonePrefix[(index + 1) % phonePrefix.length]}${String(1000000 + (index * 234567) % 9000000).substring(0, 7)}`;
  const businessPhone = `${phonePrefix[(index + 2) % phonePrefix.length]}${String(1000000 + (index * 345678) % 9000000).substring(0, 7)}`;
  const branchPhone = `${phonePrefix[(index + 3) % phonePrefix.length]}${String(1000000 + (index * 456789) % 9000000).substring(0, 7)}`;
  
  // Business types
  const businessTypes = ['Công nghiệp', 'Thương mại', 'Dịch vụ', 'Sản xuất', 'Bán lẻ'];
  
  // Industry names (Ngành kinh doanh)
  const industryNames = [
    'Kinh doanh thực phẩm',
    'Dịch vụ ăn uống',
    'Kinh doanh mỹ phẩm',
    'Bán lẻ thực phẩm',
    'Sản xuất thực phẩm',
    'Kinh doanh hàng tiêu dùng',
  ];
  
  // Operation Status - Use API values ('active', 'pending', 'rejected', 'suspended'), not labels
  const operationStatuses = ['active', 'pending', 'rejected', 'suspended'];
  
  // Generate Tax Code (Vietnam format: 10 or 13 digits)
  // Format: XXXXXXXXXX or XXXXXXXXXX-XXX
  const taxCodeBase = String(1000000000 + (id * 987654321) % 9000000000).substring(0, 10);
  const taxCode = index % 3 === 0 ? `${taxCodeBase}-${String(100 + (id % 900)).substring(0, 3)}` : taxCodeBase;
  
  // Business License (GPKD number)
  const businessLicense = `GPKD-${String(10000 + id).substring(0, 5)}/2024`;
  
  // Established Date
  const establishedYear = 2015 + (index % 10);
  const establishedMonth = (index % 12) + 1;
  const establishedDay = (index % 28) + 1;
  const establishedDate = `${establishedDay.toString().padStart(2, '0')}/${establishedMonth.toString().padStart(2, '0')}/${establishedYear}`;
  
  // Owner Birth Year
  const ownerBirthYear = String(1970 + (index % 35)); // Years 1970-2004
  
  // Owner ID Number (CCCD format: 12 digits)
  const ownerIdNumber = String(100000000000 + (id * 123456789) % 900000000000).substring(0, 12);
  
  // Business Area (m²)
  const businessArea = `${(50 + (index % 10) * 10)}`; // 50-140 m²
  
  // Website
  const website = index % 4 === 0 ? `https://www.${storeNames[index % storeNames.length].toLowerCase().replace(/\s+/g, '')}.vn` : undefined;
  
  // Fax
  const fax = index % 5 === 0 ? `028-${String(10000 + (index * 7) % 90000).substring(0, 7)}` : undefined;
  
  // Province info
  const province = 'TP. Hồ Chí Minh';
  const provinceCode = '79';
  
  // Registered Address (Địa chỉ đăng ký kinh doanh - legal address)
  const registeredAddress = generateAddress(index);
  
  // Headquarter Address (may differ from registered)
  const headquarterAddress = index % 3 === 0 ? generateAddress(index + 10) : undefined;
  
  // Production Address
  const productionAddress = index % 4 === 0 ? `Khu công nghiệp ${jurisdictions[(index + 5) % jurisdictions.length]}` : undefined;
  
  // Branch Addresses (some stores have multiple branches)
  const branchAddresses = index % 5 === 0 ? [
    `Chi nhánh 1: ${generateAddress(index + 20)}`,
    `Chi nhánh 2: ${generateAddress(index + 30)}`,
  ] : undefined;
  
  // Tags (custom tags for classification)
  const allTags = ['An toàn thực phẩm', 'Ưu tiên kiểm tra', 'Doanh nghiệp mới', 'Chuỗi cửa hàng', 'Xuất khẩu'];
  const tags = index % 3 === 0 ? [
    allTags[index % allTags.length],
    allTags[(index + 1) % allTags.length],
  ] : undefined;
  
  // Notes (for some stores)
  const sampleNotes = [
    'Cơ sở đã được kiểm tra định kỳ. Tuân thủ tốt các quy định về ATTP.',
    'Cần theo dõi đặc biệt về nguồn gốc nguyên liệu.',
    'Đã có văn bản nhắc nhở về vệ sinh cơ sở. Cải thiện tốt.',
    'Cơ sở mới thành lập, chưa có lịch sử vi phạm.',
  ];
  const notes = index % 4 === 0 ? sampleNotes[index % sampleNotes.length] : undefined;
  
  // Source Notes
  const sourceNotes = index % 6 === 0 ? 'Thông tin từ hệ thống đăng ký kinh doanh quốc gia' : undefined;
  
  return {
    id,
    name: generateStoreName(index),
    address: generateAddress(index),
    type: storeTypes[index % storeTypes.length],
    status,
    riskLevel: riskLevels[index % riskLevels.length],
    lastInspection: generateInspectionDate(index),
    area_name: businessArea,
    jurisdiction,
    province,
    provinceCode,
    managementUnit: `Chi cục QLTT ${jurisdiction}`,
    latitude,
    longitude,
    // Additional fields for detail page
    ownerName,
    phone,
    ownerPhone,
    ownerPhone2: index % 5 === 0 ? `${phonePrefix[(index + 4) % phonePrefix.length]}${String(1000000 + (index * 567890) % 9000000).substring(0, 7)}` : undefined,
    ownerBirthYear: parseInt(ownerBirthYear),
    ownerIdNumber,
    ownerEmail: index % 4 === 0 ? `${ownerName.toLowerCase().replace(/\s+/g, '')}@email.com` : undefined,
    email: `${ownerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
    businessPhone,
    businessType: businessTypes[index % businessTypes.length],
    gpsCoordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    isVerified: index % 3 === 0, // Every 3rd store is verified
    // All fields for QLTT
    taxCode,
    businessLicense,
    industryName: industryNames[index % industryNames.length],
    establishedDate,
    operationStatus: operationStatuses[index % operationStatuses.length],
    businessArea,
    website,
    fax,
    registeredAddress,
    headquarterAddress,
    productionAddress,
    branchAddresses,
    branchPhone,
    tags,
    notes,
    sourceNotes,
  };
});

// Helper functions to manage stores
let dynamicStores: Store[] = [];

export function addStore(store: Store) {
  dynamicStores.push(store);
}

export function getAllStores(): Store[] {
  return [...dynamicStores, ...mockStores];
}

export function getStoreById(id: number): Store | undefined {
  // Check dynamic stores first (newer data)
  const dynamicStore = dynamicStores.find(s => s.id === id);
  if (dynamicStore) return dynamicStore;
  
  // Then check mock stores
  return mockStores.find(s => s.id === id);
}

export function updateStore(id: number, updates: Partial<Store>) {
  // Update in dynamic stores first
  const dynamicIndex = dynamicStores.findIndex(s => s.id === id);
  if (dynamicIndex !== -1) {
    dynamicStores[dynamicIndex] = { ...dynamicStores[dynamicIndex], ...updates };
    return;
  }
  
  // If not in dynamic, add to dynamic with updates
  const originalStore = mockStores.find(s => s.id === id);
  if (originalStore) {
    dynamicStores.push({ ...originalStore, ...updates });
  }
}
