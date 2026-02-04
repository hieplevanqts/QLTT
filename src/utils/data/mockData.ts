/**
 * Mock Data and Search Utilities
 * Provides search functionality across all data types in MAPPA Portal
 */

export type SearchResultType = 
  | 'facility'
  | 'plan'
  | 'lead'
  | 'inspection-batch'
  | 'inspection-session'
  | 'legal-file'
  | 'violation-file'
  | 'evidence';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  metadata?: string;
  url?: string;
}

// Storage key for recent searches
const RECENT_SEARCHES_KEY = 'mappa-recent-searches';
const MAX_RECENT_SEARCHES = 5;

/**
 * Mock data for search results
 */
const mockSearchData: SearchResult[] = [
  // Facilities
  {
    id: 'F001',
    type: 'facility',
    title: 'Nhà hàng Phở Hà Nội',
    subtitle: 'Phường Ba Đình, Hà Nội',
    metadata: 'Đã cấp phép • Hoạt động',
    url: '/stores',
  },
  {
    id: 'F002',
    type: 'facility',
    title: 'Siêu thị Vinmart+',
    subtitle: 'Phường Cầu Giấy, Hà Nội',
    metadata: 'Đã cấp phép • Hoạt động',
    url: '/stores',
  },
  {
    id: 'F003',
    type: 'facility',
    title: 'Cửa hàng điện máy Nguyễn Kim',
    subtitle: 'Phường Hoàn Kiếm, Hà Nội',
    metadata: 'Đã cấp phép • Hoạt động',
    url: '/stores',
  },
  {
    id: 'F004',
    type: 'facility',
    title: 'Quán Cafe The Coffee House',
    subtitle: 'Phường Đống Đa, Hà Nội',
    metadata: 'Đã cấp phép • Hoạt động',
    url: '/stores',
  },
  {
    id: 'F005',
    type: 'facility',
    title: 'Trung tâm thương mại AEON Mall',
    subtitle: 'Phường Hà Đông, Hà Nội',
    metadata: 'Đã cấp phép • Hoạt động',
    url: '/stores',
  },
  
  // Plans
  {
    id: 'P001',
    type: 'plan',
    title: 'Kế hoạch kiểm tra an toàn thực phẩm Tết 2026',
    subtitle: 'Phường Ba Đình',
    metadata: 'Sắp diễn ra • 15/01/2026',
    url: '/plans',
  },
  {
    id: 'P002',
    type: 'plan',
    title: 'Kế hoạch kiểm tra vệ sinh môi trường Q1/2026',
    subtitle: 'Toàn thành phố',
    metadata: 'Đang thực hiện • 10/01/2026',
    url: '/plans',
  },
  {
    id: 'P003',
    type: 'plan',
    title: 'Kế hoạch thanh tra an toàn điện',
    subtitle: 'Phường Hoàn Kiếm',
    metadata: 'Hoàn thành • 05/12/2025',
    url: '/plans',
  },
  
  // Leads
  {
    id: 'L001',
    type: 'lead',
    title: 'Phản ánh thực phẩm không rõ nguồn gốc',
    subtitle: 'Phường Láng Hạ, Đống Đa',
    metadata: 'Mức độ cao • Mới nhận',
    url: '/leads',
  },
  {
    id: 'L002',
    type: 'lead',
    title: 'Khiếu nại về giá cả không niêm yết',
    subtitle: 'Phường Ô Chợ Dừa, Đống Đa',
    metadata: 'Mức độ trung bình • Đang xử lý',
    url: '/leads',
  },
  {
    id: 'L003',
    type: 'lead',
    title: 'Nguồn tin về hàng giả',
    subtitle: 'Phường Hoàn Kiếm',
    metadata: 'Mức độ cao • Đang xác minh',
    url: '/leads',
  },
  
  // Inspection Batches
  {
    id: 'IB001',
    type: 'inspection-batch',
    title: 'Đợt kiểm tra ATTP cuối năm 2025',
    subtitle: '45 cơ sở',
    metadata: 'Hoàn thành • 28/12/2025',
    url: '/tasks',
  },
  {
    id: 'IB002',
    type: 'inspection-batch',
    title: 'Đợt kiểm tra vệ sinh môi trường Q4',
    subtitle: '32 cơ sở',
    metadata: 'Đang thực hiện • 15/12/2025',
    url: '/tasks',
  },
  
  // Inspection Sessions
  {
    id: 'IS001',
    type: 'inspection-session',
    title: 'Kiểm tra Nhà hàng Phở Hà Nội',
    subtitle: 'Phường Ba Đình',
    metadata: 'Hoàn thành • 20/12/2025',
    url: '/tasks',
  },
  {
    id: 'IS002',
    type: 'inspection-session',
    title: 'Kiểm tra Siêu thị Vinmart+',
    subtitle: 'Phường Cầu Giấy',
    metadata: 'Đang thực hiện • 08/01/2026',
    url: '/tasks',
  },
  
  // Legal Files
  {
    id: 'LF001',
    type: 'legal-file',
    title: 'Giấy phép ATTP - Nhà hàng Phở Hà Nội',
    subtitle: 'Số: 001/GP-ATTP',
    metadata: 'Còn hiệu lực • Hết hạn 31/12/2026',
    url: '/evidence',
  },
  {
    id: 'LF002',
    type: 'legal-file',
    title: 'Giấy chứng nhận đăng ký kinh doanh',
    subtitle: 'Số: 0123456789',
    metadata: 'Còn hiệu lực',
    url: '/evidence',
  },
  
  // Violation Files
  {
    id: 'VF001',
    type: 'violation-file',
    title: 'Hồ sơ vi phạm ATTP - Quán Cafe ABC',
    subtitle: 'Vi phạm điều 15, Nghị định 115/2018',
    metadata: 'Đang xử lý • Mức phạt: 15 triệu',
    url: '/evidence',
  },
  {
    id: 'VF002',
    type: 'violation-file',
    title: 'Hồ sơ vi phạm giá cả - Cửa hàng XYZ',
    subtitle: 'Không niêm yết giá',
    metadata: 'Hoàn thành • Đã xử phạt',
    url: '/evidence',
  },
  
  // Evidence Packages
  {
    id: 'E001',
    type: 'evidence',
    title: 'Gói chứng cứ kiểm tra ATTP Tháng 12/2025',
    subtitle: '24 file đính kèm',
    metadata: 'Đầy đủ • Đã lưu trữ',
    url: '/evidence',
  },
  {
    id: 'E002',
    type: 'evidence',
    title: 'Gói chứng cứ vi phạm hàng giả',
    subtitle: '18 file đính kèm',
    metadata: 'Đang bổ sung',
    url: '/evidence',
  },
];

/**
 * Search all data types
 */
export function searchAllData(query: string): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return mockSearchData.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(lowerQuery);
    const subtitleMatch = item.subtitle?.toLowerCase().includes(lowerQuery);
    const metadataMatch = item.metadata?.toLowerCase().includes(lowerQuery);
    
    return titleMatch || subtitleMatch || metadataMatch;
  });
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): SearchResult[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading recent searches:', error);
    return [];
  }
}

/**
 * Save a search result to recent searches
 */
export function saveRecentSearch(result: SearchResult): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const recent = getRecentSearches();
    
    // Remove duplicate if exists
    const filtered = recent.filter(item => item.id !== result.id);
    
    // Add to beginning
    const updated = [result, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
}
