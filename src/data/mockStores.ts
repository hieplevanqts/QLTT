import { FacilityStatus } from '../ui-kit/FacilityStatusBadge';

export interface Store {
  id: number;
  name: string;
  address: string;
  type: string;
  status: FacilityStatus;
  riskLevel: 'low' | 'medium' | 'high' | 'none';
  lastInspection: string;
  jurisdiction: string;
  managementUnit: string;
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
  'Quận 1',
  'Quận 2',
  'Quận 3',
  'Quận 4',
  'Quận 5',
  'Quận 6',
  'Quận 7',
  'Quận 8',
  'Quận 9',
  'Quận 10',
  'Quận 11',
  'Quận 12',
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

const statuses: FacilityStatus[] = ['active', 'pending', 'underInspection', 'suspended', 'closed'];
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
  return `${houseNumber} ${street}, ${jurisdiction}, TP.HCM`;
}

function generateInspectionDate(index: number): string {
  const statusIndex = index % statuses.length;
  if (statuses[statusIndex] === 'pending' || statuses[statusIndex] === 'closed') {
    return 'Chưa kiểm tra';
  }
  
  const day = (index % 28) + 1;
  const month = (index % 12) + 1;
  const year = 2025 + (index % 2);
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
}

export const mockStores: Store[] = Array.from({ length: 100 }, (_, index) => {
  const id = index + 1;
  const jurisdictionIndex = index % jurisdictions.length;
  const jurisdiction = jurisdictions[jurisdictionIndex];
  const statusIndex = index % statuses.length;
  const status = statuses[statusIndex];
  
  return {
    id,
    name: generateStoreName(index),
    address: generateAddress(index),
    type: storeTypes[index % storeTypes.length],
    status,
    riskLevel: riskLevels[index % riskLevels.length],
    lastInspection: generateInspectionDate(index),
    jurisdiction,
    managementUnit: `Chi cục QLTT ${jurisdiction}`,
  };
});
