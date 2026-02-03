/**
 * Mock Pending Updates Data
 * Quản lý các thông tin cơ sở và hồ sơ pháp lý đang chờ phê duyệt
 */

export type UpdateType = 'business_info' | 'legal_profile';
export type UpdateStatus = 'pending' | 'approved' | 'rejected';

// Categories for business info updates
export type BusinessInfoCategory = 
  | 'general_info'      // Thông tin chung (tên, SĐT, email...)
  | 'address_location'; // Địa chỉ / địa bàn hoạt động

// Categories for legal profile updates
export type LegalProfileCategory =
  | 'citizen_id'           // CCCD / CMND chủ hộ
  | 'business_license'     // Giấy phép kinh doanh
  | 'food_safety_cert'     // Giấy chứng nhận ATTP
  | 'specialized_license'  // Giấy phép chuyên ngành
  | 'fire_safety_cert'     // PCCC
  | 'lease_contract';      // Hợp đồng thuê mặt bằng

export interface FieldChange {
  field: string;
  label: string;
  oldValue: any;
  newValue: any;
}

export interface PendingUpdate {
  id: number;
  storeId: number;
  storeName: string;
  updateType: UpdateType;
  category: BusinessInfoCategory | LegalProfileCategory;
  categoryLabel: string;
  description: string; // Mô tả ngắn gọn về thay đổi
  changes: FieldChange[]; // Chi tiết các trường thay đổi
  updatedBy: string;
  updatedAt: string;
  status: UpdateStatus;
  rejectionReason?: string;
}

// Mock data
export const mockPendingUpdates: PendingUpdate[] = [
  // Business Info Updates
  {
    id: 1,
    storeId: 1,
    storeName: 'Cửa hàng Bách Hóa Xanh',
    updateType: 'business_info',
    category: 'general_info',
    categoryLabel: 'Thông tin chung',
    description: 'Cập nhật số điện thoại và email liên hệ',
    changes: [
      {
        field: 'phone',
        label: 'Số điện thoại',
        oldValue: '0901234567',
        newValue: '0909876543',
      },
      {
        field: 'email',
        label: 'Email',
        oldValue: 'bachhoa@example.com',
        newValue: 'bachhoa.new@example.com',
      },
    ],
    updatedBy: 'Nguyễn Văn A',
    updatedAt: '2025-01-14T10:30:00',
    status: 'pending',
  },
  {
    id: 2,
    storeId: 3,
    storeName: 'Nhà hàng Phở 24',
    updateType: 'business_info',
    category: 'address_location',
    categoryLabel: 'Địa chỉ / Địa bàn',
    description: 'Thay đổi địa chỉ kinh doanh',
    changes: [
      {
        field: 'address',
        label: 'Địa chỉ',
        oldValue: '123 Nguyễn Huệ, Phường Bến Nghé, Phường 1, Hà Nội',
        newValue: '456 Lê Lợi, Phường Bến Thành, Phường 1, Hà Nội',
      },
      {
        field: 'ward',
        label: 'Phường/Xã',
        oldValue: 'Phường Bến Nghé',
        newValue: 'Phường Bến Thành',
      },
    ],
    updatedBy: 'Trần Thị B',
    updatedAt: '2025-01-14T09:15:00',
    status: 'pending',
  },
  {
    id: 3,
    storeId: 5,
    storeName: 'Siêu thị Mini Mart',
    updateType: 'business_info',
    category: 'general_info',
    categoryLabel: 'Thông tin chung',
    description: 'Cập nhật tên cơ sở và mô tả',
    changes: [
      {
        field: 'name',
        label: 'Tên cơ sở',
        oldValue: 'Siêu thị Mini Mart',
        newValue: 'Siêu thị Mini Mart Plus',
      },
      {
        field: 'description',
        label: 'Mô tả',
        oldValue: 'Siêu thị tiện lợi',
        newValue: 'Siêu thị tiện lợi 24/7 - Phục vụ tận tâm',
      },
    ],
    updatedBy: 'Lê Văn C',
    updatedAt: '2025-01-13T16:45:00',
    status: 'pending',
  },

  // Legal Profile Updates
  {
    id: 4,
    storeId: 2,
    storeName: 'Cửa hàng Tạp Hóa Thanh Nga',
    updateType: 'legal_profile',
    category: 'citizen_id',
    categoryLabel: 'CCCD / CMND chủ hộ',
    description: 'Cập nhật CCCD mới (thẻ chip)',
    changes: [
      {
        field: 'citizenId',
        label: 'Số CCCD',
        oldValue: '025123456789',
        newValue: '025987654321',
      },
      {
        field: 'citizenIdFile',
        label: 'File CCCD',
        oldValue: 'cccd_old.pdf',
        newValue: 'cccd_new_2025.pdf',
      },
      {
        field: 'issuedDate',
        label: 'Ngày cấp',
        oldValue: '15/06/2015',
        newValue: '10/01/2025',
      },
    ],
    updatedBy: 'Nguyễn Thị Nga',
    updatedAt: '2025-01-14T11:20:00',
    status: 'pending',
  },
  {
    id: 5,
    storeId: 4,
    storeName: 'Quán Cafe Sunrise',
    updateType: 'legal_profile',
    category: 'business_license',
    categoryLabel: 'Giấy phép kinh doanh',
    description: 'Gia hạn giấy phép kinh doanh',
    changes: [
      {
        field: 'licenseNumber',
        label: 'Số giấy phép',
        oldValue: 'GPKD-2023-001',
        newValue: 'GPKD-2025-001',
      },
      {
        field: 'expiryDate',
        label: 'Ngày hết hạn',
        oldValue: '31/12/2024',
        newValue: '31/12/2026',
      },
      {
        field: 'licenseFile',
        label: 'File giấy phép',
        oldValue: 'gpkd_2023.pdf',
        newValue: 'gpkd_renewed_2025.pdf',
      },
    ],
    updatedBy: 'Phạm Văn D',
    updatedAt: '2025-01-14T08:00:00',
    status: 'pending',
  },
  {
    id: 6,
    storeId: 3,
    storeName: 'Nhà hàng Phở 24',
    updateType: 'legal_profile',
    category: 'food_safety_cert',
    categoryLabel: 'Giấy chứng nhận ATTP',
    description: 'Upload giấy chứng nhận ATTP mới',
    changes: [
      {
        field: 'certNumber',
        label: 'Số chứng nhận',
        oldValue: null,
        newValue: 'ATTP-2025-HCM-123',
      },
      {
        field: 'certFile',
        label: 'File chứng nhận',
        oldValue: null,
        newValue: 'attp_pho24_2025.pdf',
      },
      {
        field: 'issuedDate',
        label: 'Ngày cấp',
        oldValue: null,
        newValue: '05/01/2025',
      },
      {
        field: 'expiryDate',
        label: 'Ngày hết hạn',
        oldValue: null,
        newValue: '05/01/2027',
      },
    ],
    updatedBy: 'Trần Thị B',
    updatedAt: '2025-01-13T14:30:00',
    status: 'pending',
  },
  {
    id: 7,
    storeId: 6,
    storeName: 'Cửa hàng Điện Máy Xanh',
    updateType: 'legal_profile',
    category: 'fire_safety_cert',
    categoryLabel: 'PCCC',
    description: 'Cập nhật chứng nhận phòng cháy chữa cháy',
    changes: [
      {
        field: 'certNumber',
        label: 'Số chứng nhận',
        oldValue: 'PCCC-2023-100',
        newValue: 'PCCC-2025-100',
      },
      {
        field: 'certFile',
        label: 'File chứng nhận',
        oldValue: 'pccc_2023.pdf',
        newValue: 'pccc_renewed_2025.pdf',
      },
      {
        field: 'inspectionDate',
        label: 'Ngày kiểm tra',
        oldValue: '20/12/2023',
        newValue: '10/01/2025',
      },
    ],
    updatedBy: 'Hoàng Văn E',
    updatedAt: '2025-01-12T15:45:00',
    status: 'pending',
  },
  {
    id: 8,
    storeId: 7,
    storeName: 'Tiệm Bánh Ngọt Sweet Home',
    updateType: 'legal_profile',
    category: 'lease_contract',
    categoryLabel: 'Hợp đồng thuê mặt bằng',
    description: 'Gia hạn hợp đồng thuê',
    changes: [
      {
        field: 'contractNumber',
        label: 'Số hợp đồng',
        oldValue: 'HĐ-MB-2023-456',
        newValue: 'HĐ-MB-2025-456',
      },
      {
        field: 'contractFile',
        label: 'File hợp đồng',
        oldValue: 'hd_thue_2023.pdf',
        newValue: 'hd_thue_renewed_2025.pdf',
      },
      {
        field: 'startDate',
        label: 'Ngày bắt đầu',
        oldValue: '01/01/2023',
        newValue: '01/01/2025',
      },
      {
        field: 'endDate',
        label: 'Ngày kết thúc',
        oldValue: '31/12/2024',
        newValue: '31/12/2026',
      },
    ],
    updatedBy: 'Vũ Thị F',
    updatedAt: '2025-01-11T10:00:00',
    status: 'pending',
  },
];

// Helper functions
export function getPendingUpdatesByStatus(status: UpdateStatus): PendingUpdate[] {
  return mockPendingUpdates.filter(update => update.status === status);
}

export function getPendingUpdatesByType(type: UpdateType): PendingUpdate[] {
  return mockPendingUpdates.filter(update => update.updateType === type);
}

export function getPendingUpdatesByStoreId(storeId: number): PendingUpdate[] {
  return mockPendingUpdates.filter(update => update.storeId === storeId);
}

export function getTotalPendingCount(): number {
  return mockPendingUpdates.filter(update => update.status === 'pending').length;
}

export function getUpdateTypeLabel(type: UpdateType): string {
  return type === 'business_info' ? 'Thông tin cơ sở' : 'Hồ sơ pháp lý';
}

export function getUpdateTypeBadgeColor(type: UpdateType): string {
  return type === 'business_info' ? 'blue' : 'purple';
}
