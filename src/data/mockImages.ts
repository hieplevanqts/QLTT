export type ImageCategory =
  | 'all'
  | 'storefront'
  | 'interior'
  | 'products'
  | 'kitchen'
  | 'documents'
  | 'other';

export interface StoreImage {
  id: string;
  storeId: number;
  category: Exclude<ImageCategory, 'all'>; // Exclude 'all' as it's a filter only
  url: string;
  title: string;
  uploadedBy: string;
  uploadedAt: string; // ISO format: "2024-11-20T14:30:00"
  displayUploadedAt: string; // Display format: "20/11/2024 14:30"
  description?: string;
}

// Mock store images
export const mockStoreImages: StoreImage[] = [
  // Store ID 1 - Multiple images across categories
  {
    id: 'IMG001',
    storeId: 1,
    category: 'storefront',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    title: 'Biển hiệu cửa hàng phía trước',
    uploadedBy: 'Trần Văn B - Đội QLTT Quận 1',
    uploadedAt: '2024-11-20T14:30:00',
    displayUploadedAt: '20/11/2024 14:30',
    description: 'Biển hiệu rõ ràng, đầy đủ thông tin',
  },
  {
    id: 'IMG002',
    storeId: 1,
    category: 'storefront',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    title: 'Mặt tiền cửa hàng',
    uploadedBy: 'Trần Văn B - Đội QLTT Quận 1',
    uploadedAt: '2024-11-20T14:32:00',
    displayUploadedAt: '20/11/2024 14:32',
  },
  {
    id: 'IMG003',
    storeId: 1,
    category: 'interior',
    url: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop',
    title: 'Khu vực phục vụ khách hàng',
    uploadedBy: 'Lê Thị C - Đội QLTT Quận 1',
    uploadedAt: '2024-11-15T10:15:00',
    displayUploadedAt: '15/11/2024 10:15',
    description: 'Không gian sạch sẽ, bàn ghế ngăn nắp',
  },
  {
    id: 'IMG004',
    storeId: 1,
    category: 'interior',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    title: 'Khu vực chờ',
    uploadedBy: 'Lê Thị C - Đội QLTT Quận 1',
    uploadedAt: '2024-11-15T10:18:00',
    displayUploadedAt: '15/11/2024 10:18',
  },
  {
    id: 'IMG005',
    storeId: 1,
    category: 'products',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    title: 'Sản phẩm thực phẩm',
    uploadedBy: 'Nguyễn Văn A - Đội QLTT Quận 1',
    uploadedAt: '2024-11-10T09:20:00',
    displayUploadedAt: '10/11/2024 09:20',
    description: 'Các món ăn được trưng bày',
  },
  {
    id: 'IMG006',
    storeId: 1,
    category: 'products',
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop',
    title: 'Món ăn mẫu',
    uploadedBy: 'Nguyễn Văn A - Đội QLTT Quận 1',
    uploadedAt: '2024-11-10T09:25:00',
    displayUploadedAt: '10/11/2024 09:25',
  },
  {
    id: 'IMG007',
    storeId: 1,
    category: 'kitchen',
    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop',
    title: 'Khu vực chế biến',
    uploadedBy: 'Trần Văn B - Đội QLTT Quận 1',
    uploadedAt: '2024-11-20T14:45:00',
    displayUploadedAt: '20/11/2024 14:45',
    description: 'Khu vực bếp sạch sẽ, dụng cụ ngăn nắp',
  },
  {
    id: 'IMG008',
    storeId: 1,
    category: 'kitchen',
    url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=600&fit=crop',
    title: 'Khu vực rửa và vệ sinh',
    uploadedBy: 'Trần Văn B - Đội QLTT Quận 1',
    uploadedAt: '2024-11-20T14:48:00',
    displayUploadedAt: '20/11/2024 14:48',
  },
  {
    id: 'IMG009',
    storeId: 1,
    category: 'documents',
    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop',
    title: 'Giấy chứng nhận ATTP',
    uploadedBy: 'Lê Thị C - Đội QLTT Quận 1',
    uploadedAt: '2024-11-15T10:30:00',
    displayUploadedAt: '15/11/2024 10:30',
    description: 'Giấy chứng nhận được treo rõ ràng tại quầy',
  },
  {
    id: 'IMG010',
    storeId: 1,
    category: 'documents',
    url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
    title: 'Bảng giá niêm yết',
    uploadedBy: 'Lê Thị C - Đội QLTT Quận 1',
    uploadedAt: '2024-11-15T10:32:00',
    displayUploadedAt: '15/11/2024 10:32',
  },

  // Store ID 2 - Medium number of images
  {
    id: 'IMG011',
    storeId: 2,
    category: 'storefront',
    url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop',
    title: 'Biển hiệu cửa hàng',
    uploadedBy: 'Hoàng Thị E - Đội QLTT Quận 2',
    uploadedAt: '2024-11-18T11:00:00',
    displayUploadedAt: '18/11/2024 11:00',
  },
  {
    id: 'IMG012',
    storeId: 2,
    category: 'interior',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
    title: 'Không gian bên trong',
    uploadedBy: 'Hoàng Thị E - Đội QLTT Quận 2',
    uploadedAt: '2024-11-18T11:05:00',
    displayUploadedAt: '18/11/2024 11:05',
  },
  {
    id: 'IMG013',
    storeId: 2,
    category: 'products',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    title: 'Sản phẩm thực phẩm',
    uploadedBy: 'Hoàng Thị E - Đội QLTT Quận 2',
    uploadedAt: '2024-11-18T11:10:00',
    displayUploadedAt: '18/11/2024 11:10',
  },
  {
    id: 'IMG014',
    storeId: 2,
    category: 'kitchen',
    url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&h=600&fit=crop',
    title: 'Khu vực bếp',
    uploadedBy: 'Hoàng Thị E - Đội QLTT Quận 2',
    uploadedAt: '2024-11-18T11:15:00',
    displayUploadedAt: '18/11/2024 11:15',
    description: 'Khu vực chế biến cần cải thiện vệ sinh',
  },
  {
    id: 'IMG015',
    storeId: 2,
    category: 'other',
    url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=600&fit=crop',
    title: 'Khu vực đỗ xe',
    uploadedBy: 'Hoàng Thị E - Đội QLTT Quận 2',
    uploadedAt: '2024-11-18T11:20:00',
    displayUploadedAt: '18/11/2024 11:20',
  },

  // Store ID 3 - Few images
  {
    id: 'IMG016',
    storeId: 3,
    category: 'storefront',
    url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
    title: 'Mặt tiền cửa hàng',
    uploadedBy: 'Nguyễn Văn A - Đội QLTT Quận 3',
    uploadedAt: '2024-11-15T13:00:00',
    displayUploadedAt: '15/11/2024 13:00',
  },
  {
    id: 'IMG017',
    storeId: 3,
    category: 'interior',
    url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&h=600&fit=crop',
    title: 'Không gian kinh doanh',
    uploadedBy: 'Nguyễn Văn A - Đội QLTT Quận 3',
    uploadedAt: '2024-11-15T13:05:00',
    displayUploadedAt: '15/11/2024 13:05',
  },

  // Store ID 4 - No images (for empty state testing)
  
  // Store ID 4 - Images showing violations
  {
    id: 'IMG018',
    storeId: 4,
    category: 'storefront',
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
    title: 'Biển hiệu cửa hàng',
    uploadedBy: 'Hoàng Thị E - Chi cục QLTT Quận 4',
    uploadedAt: '2024-11-10T15:00:00',
    displayUploadedAt: '10/11/2024 15:00',
  },
  {
    id: 'IMG019',
    storeId: 4,
    category: 'interior',
    url: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&h=600&fit=crop',
    title: 'Khu vực khách hàng',
    uploadedBy: 'Hoàng Thị E - Chi cục QLTT Quận 4',
    uploadedAt: '2024-11-10T15:05:00',
    displayUploadedAt: '10/11/2024 15:05',
    description: 'Khu vực bừa bộn, vệ sinh kém',
  },
  {
    id: 'IMG020',
    storeId: 4,
    category: 'kitchen',
    url: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop',
    title: 'Khu vực bếp - Vi phạm vệ sinh',
    uploadedBy: 'Hoàng Thị E - Chi cục QLTT Quận 4',
    uploadedAt: '2024-11-10T15:10:00',
    displayUploadedAt: '10/11/2024 15:10',
    description: 'Phát hiện nhiều vi phạm về vệ sinh ATTP, dụng cụ bẩn',
  },
  {
    id: 'IMG021',
    storeId: 4,
    category: 'kitchen',
    url: 'https://images.unsplash.com/photo-1571864743857-232b5e75c990?w=800&h=600&fit=crop',
    title: 'Khu vực bảo quản thực phẩm',
    uploadedBy: 'Lê Văn F - Đội QLTT Quận 4',
    uploadedAt: '2024-08-05T10:30:00',
    displayUploadedAt: '05/08/2024 10:30',
    description: 'Bảo quản thực phẩm lẫn lộn với hóa chất tẩy rửa',
  },
  {
    id: 'IMG022',
    storeId: 4,
    category: 'products',
    url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&h=600&fit=crop',
    title: 'Thực phẩm hết hạn',
    uploadedBy: 'Hoàng Thị E - Chi cục QLTT Quận 4',
    uploadedAt: '2024-11-10T15:15:00',
    displayUploadedAt: '10/11/2024 15:15',
    description: 'Phát hiện thực phẩm đã hết hạn sử dụng',
  },
  {
    id: 'IMG023',
    storeId: 4,
    category: 'documents',
    url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&h=600&fit=crop',
    title: 'Giấy tờ thiếu',
    uploadedBy: 'Trần Văn B - Đội QLTT Quận 4',
    uploadedAt: '2024-10-15T11:20:00',
    displayUploadedAt: '15/10/2024 11:20',
    description: 'Thiếu giấy chứng nhận ATTP và giấy phép PCCC',
  },
  {
    id: 'IMG024',
    storeId: 4,
    category: 'other',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
    title: 'Lối thoát hiểm bị chặn',
    uploadedBy: 'Nguyễn Văn D - PCCC Quận 4',
    uploadedAt: '2024-09-08T14:00:00',
    displayUploadedAt: '08/09/2024 14:00',
    description: 'Lối thoát hiểm bị chặn bởi hàng hóa, vi phạm PCCC',
  },
];

/**
 * Get images for a specific store
 */
export function getImagesByStoreId(storeId: number): StoreImage[] {
  return mockStoreImages.filter((image) => image.storeId === storeId);
}

/**
 * Get images by store and category
 */
export function getImagesByCategory(
  storeId: number,
  category: ImageCategory
): StoreImage[] {
  const storeImages = getImagesByStoreId(storeId);

  if (category === 'all') {
    return storeImages;
  }

  return storeImages.filter((image) => image.category === category);
}

/**
 * Get image counts by category for a store
 */
export function getImageCategoryCounts(storeId: number): Record<ImageCategory, number> {
  const storeImages = getImagesByStoreId(storeId);

  return {
    all: storeImages.length,
    storefront: storeImages.filter((img) => img.category === 'storefront').length,
    interior: storeImages.filter((img) => img.category === 'interior').length,
    products: storeImages.filter((img) => img.category === 'products').length,
    kitchen: storeImages.filter((img) => img.category === 'kitchen').length,
    documents: storeImages.filter((img) => img.category === 'documents').length,
    other: storeImages.filter((img) => img.category === 'other').length,
  };
}

/**
 * Get category display label
 */
export function getCategoryLabel(category: ImageCategory): string {
  switch (category) {
    case 'all':
      return 'Tất cả';
    case 'storefront':
      return 'Biển hiệu cửa hàng';
    case 'interior':
      return 'Không gian kinh doanh';
    case 'products':
      return 'Sản phẩm / hàng hóa';
    case 'kitchen':
      return 'Khu vực chế biến / kho';
    case 'documents':
      return 'Giấy tờ, hồ sơ treo tại cửa hàng';
    case 'other':
      return 'Khác';
    default:
      return 'Không xác định';
  }
}

/**
 * All available categories
 */
export const imageCategories: ImageCategory[] = [
  'all',
  'storefront',
  'interior',
  'products',
  'kitchen',
  'documents',
  'other',
];

/**
 * Add new images to the store
 */
export function addImages(images: StoreImage[]): void {
  mockStoreImages.push(...images);
}

/**
 * Delete an image by ID
 */
export function deleteImage(imageId: string): boolean {
  const index = mockStoreImages.findIndex((img) => img.id === imageId);
  if (index !== -1) {
    mockStoreImages.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Update image category
 */
export function updateImageCategory(
  imageId: string,
  newCategory: Exclude<ImageCategory, 'all'>
): boolean {
  const image = mockStoreImages.find((img) => img.id === imageId);
  if (image) {
    image.category = newCategory;
    return true;
  }
  return false;
}

/**
 * Generate unique image ID
 */
export function generateImageId(): string {
  const existingIds = mockStoreImages.map((img) => {
    const match = img.id.match(/IMG(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });
  const maxId = Math.max(...existingIds, 0);
  return `IMG${String(maxId + 1).padStart(3, '0')}`;
}