/**
 * Mock data cho KPI & Thống kê QLTT
 */

import type { UnitData } from '../types';

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number; // % change
  trendData: number[]; // Last 7 days data
  color: string;
}

export interface Report {
  id: string;
  title: string;
  createdAt: string;
  status: 'draft' | 'published' | 'archived';
  type: 'weekly' | 'monthly' | 'quarterly';
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
}

/**
 * Mock KPI Metrics
 */
export const mockKpiMetrics: KpiMetric[] = [
  {
    id: 'violations',
    label: 'Tổng số vụ vi phạm',
    value: 1234,
    unit: 'vụ',
    trend: 12.5,
    trendData: [980, 1020, 1100, 1150, 1180, 1210, 1234],
    color: '#ef4444'
  },
  {
    id: 'tasks',
    label: 'Nhiệm vụ đang xử lý',
    value: 156,
    unit: 'nhiệm vụ',
    trend: -5.2,
    trendData: [165, 163, 160, 159, 158, 157, 156],
    color: '#f59e0b'
  },
  {
    id: 'hotspots',
    label: 'Điểm nóng ATTP',
    value: 42,
    unit: 'điểm',
    trend: 8.3,
    trendData: [38, 39, 40, 40, 41, 42, 42],
    color: '#8b5cf6'
  },
  {
    id: 'overdue',
    label: 'Nhiệm vụ quá hạn',
    value: 23,
    unit: 'nhiệm vụ',
    trend: -15.4,
    trendData: [27, 26, 25, 24, 24, 23, 23],
    color: '#10b981'
  }
];

/**
 * Mock Reports
 */
export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Báo cáo tuần 03/2026',
    createdAt: '2026-01-15T10:00:00Z',
    status: 'published',
    type: 'weekly'
  },
  {
    id: '2',
    title: 'Báo cáo tháng 12/2025',
    createdAt: '2025-12-28T14:30:00Z',
    status: 'published',
    type: 'monthly'
  },
  {
    id: '3',
    title: 'Báo cáo tuần 02/2026',
    createdAt: '2026-01-08T09:15:00Z',
    status: 'published',
    type: 'weekly'
  },
  {
    id: '4',
    title: 'Báo cáo Quý 4/2025',
    createdAt: '2025-12-31T16:00:00Z',
    status: 'draft',
    type: 'quarterly'
  },
  {
    id: '5',
    title: 'Báo cáo tháng 11/2025',
    createdAt: '2025-11-30T11:20:00Z',
    status: 'archived',
    type: 'monthly'
  }
];

/**
 * Mock Report Templates
 */
export const mockReportTemplates: ReportTemplate[] = [
  {
    id: 'weekly',
    name: 'Mẫu báo cáo tuần',
    description: 'Báo cáo tổng hợp hoạt động trong tuần',
    sections: [
      'Tổng quan tình hình',
      'Vi phạm nổi bật',
      'Nhiệm vụ hoàn thành',
      'Kế hoạch tuần tới'
    ]
  },
  {
    id: 'monthly',
    name: 'Mẫu báo cáo tháng',
    description: 'Báo cáo tổng hợp hoạt động trong tháng',
    sections: [
      'Tổng quan tình hình',
      'Thống kê vi phạm',
      'Phân tích xu hướng',
      'Đánh giá hiệu quả',
      'Kế hoạch tháng tới'
    ]
  },
  {
    id: 'quarterly',
    name: 'Mẫu báo cáo quý',
    description: 'Báo cáo tổng hợp hoạt động theo quý',
    sections: [
      'Tổng quan tình hình',
      'Thống kê toàn diện',
      'So sánh các quý',
      'Phân tích chuyên sâu',
      'Đề xuất chính sách',
      'Kế hoạch quý tới'
    ]
  }
];

/**
 * Mock Topics
 */
export const mockTopics = [
  'An toàn thực phẩm',
  'Hàng giả',
  'Hàng cấm',
  'Hàng lậu',
  'Bảo vệ người tiêu dùng',
  'Cạnh tranh không lành mạnh',
  'Kinh doanh đa cấp',
  'Quảng cáo vi phạm',
  'Kiểm tra Tết',
  'Kiểm tra lễ hội',
  'Tổng hợp'
];

// Alias exports for backward compatibility
export const topics = mockTopics;

/**
 * Mock Provinces
 */
export const provinces = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Nghệ An',
  'Thanh Hóa',
  'Bình Dương',
  'Đồng Nai',
  'Khánh Hòa'
];

/**
 * Mock data cho Compare KPI
 */
const categoryGroups = ['Ăn uống', 'Dịch vụ', 'Bán lẻ', 'Sản xuất', 'Vận tải', 'Khác'];

const units = [
  // Cục level
  { level: 'cuc' as const, id: 'cuc-hn', name: 'Cục QLTT Hà Nội', province: 'Hà Nội' },
  { level: 'cuc' as const, id: 'cuc-hcm', name: 'Cục QLTT Hà Nội', province: 'TP. Hồ Chí Minh' },
  { level: 'cuc' as const, id: 'cuc-dn', name: 'Cục QLTT Đà Nẵng', province: 'Đà Nẵng' },
  { level: 'cuc' as const, id: 'cuc-hp', name: 'Cục QLTT Hải Phòng', province: 'Hải Phòng' },
  { level: 'cuc' as const, id: 'cuc-na', name: 'Cục QLTT Nghệ An', province: 'Nghệ An' },
  
  // Chi cục level - Hà Nội
  { level: 'chicuc' as const, id: 'cc-hd', name: 'Chi cục QLTT Hoàn Kiếm', province: 'Hà Nội' },
  { level: 'chicuc' as const, id: 'cc-bd', name: 'Chi cục QLTT Ba Đình', province: 'Hà Nội' },
  { level: 'chicuc' as const, id: 'cc-cg', name: 'Chi cục QLTT Cầu Giấy', province: 'Hà Nội' },
  { level: 'chicuc' as const, id: 'cc-hm', name: 'Chi cục QLTT Hai Bà Trưng', province: 'Hà Nội' },
  
  // Chi cục level - Hà Nội
  { level: 'chicuc' as const, id: 'cc-q1', name: 'Chi cục QLTT Phường 1', province: 'TP. Hồ Chí Minh' },
  { level: 'chicuc' as const, id: 'cc-q3', name: 'Chi cục QLTT Phường 3', province: 'TP. Hồ Chí Minh' },
  { level: 'chicuc' as const, id: 'cc-td', name: 'Chi cục QLTT Thủ Đức', province: 'TP. Hồ Chí Minh' },
  { level: 'chicuc' as const, id: 'cc-tb', name: 'Chi cục QLTT Tân Bình', province: 'TP. Hồ Chí Minh' },
  
  // Chi cục level - Đà Nẵng
  { level: 'chicuc' as const, id: 'cc-hc', name: 'Chi cục QLTT Hải Châu', province: 'Đà Nẵng' },
  { level: 'chicuc' as const, id: 'cc-tk', name: 'Chi cục QLTT Thanh Khê', province: 'Đà Nẵng' },
  
  // Đội level - Hà Nội
  { level: 'doi' as const, id: 'doi-hd-1', name: 'Đội QLTT 1 Hoàn Kiếm', province: 'Hà Nội' },
  { level: 'doi' as const, id: 'doi-hd-2', name: 'Đội QLTT 2 Hoàn Kiếm', province: 'Hà Nội' },
  { level: 'doi' as const, id: 'doi-bd-1', name: 'Đội QLTT 1 Ba Đình', province: 'Hà Nội' },
  { level: 'doi' as const, id: 'doi-cg-1', name: 'Đội QLTT 1 Cầu Giấy', province: 'Hà Nội' },
  
  // Đội level - Hà Nội
  { level: 'doi' as const, id: 'doi-q1-1', name: 'Đội QLTT 1 Phường 1', province: 'TP. Hồ Chí Minh' },
  { level: 'doi' as const, id: 'doi-q1-2', name: 'Đội QLTT 2 Phường 1', province: 'TP. Hồ Chí Minh' },
  { level: 'doi' as const, id: 'doi-q3-1', name: 'Đội QLTT 1 Phường 3', province: 'TP. Hồ Chí Minh' },
  { level: 'doi' as const, id: 'doi-td-1', name: 'Đội QLTT 1 Thủ Đức', province: 'TP. Hồ Chí Minh' },
];

// Generate mock data for last 90 days
function generateMockUnitData(): UnitData[] {
  const data: UnitData[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 90);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    
    units.forEach(unit => {
      categoryGroups.forEach(category => {
        // Base values with some randomization
        const baseMultiplier = 
          unit.level === 'cuc' ? 10 : 
          unit.level === 'chicuc' ? 5 : 
          2;
        
        const categoryMultiplier = {
          'Ăn uống': 1.5,
          'Dịch vụ': 1.2,
          'Bán lẻ': 1.3,
          'Sản xuất': 0.8,
          'Vận tải': 0.6,
          'Khác': 0.5
        }[category] || 1;

        const random = () => Math.random() * 0.4 + 0.8; // 0.8 to 1.2

        data.push({
          date: dateStr,
          province: unit.province,
          unitLevel: unit.level,
          unitId: unit.id,
          unitName: unit.name,
          categoryGroup: category,
          leads: Math.floor(baseMultiplier * categoryMultiplier * 15 * random()),
          tasks: Math.floor(baseMultiplier * categoryMultiplier * 12 * random()),
          overdue: Math.floor(baseMultiplier * categoryMultiplier * 2 * random()),
          violations: Math.floor(baseMultiplier * categoryMultiplier * 5 * random()),
          hotspots: Math.floor(baseMultiplier * categoryMultiplier * 3 * random())
        });
      });
    });
  }

  return data;
}

export const mockCompareData: UnitData[] = generateMockUnitData();