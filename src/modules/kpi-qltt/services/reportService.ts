/**
 * Report Service - Quản lý báo cáo với localStorage
 */

import { Report, mockReports, mockReportTemplates, mockKpiMetrics, mockCompareData } from '../data/mock';
import type { CompareFilters, CompareRow, UnitData } from '../types';

const STORAGE_KEY = 'mappa_kpi_reports';

export interface ReportFilters {
  search?: string;
  province?: string;
  topic?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class ReportService {
  private getReportsFromStorage(): Report[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading reports from storage:', error);
    }
    return [...mockReports];
  }

  private saveReportsToStorage(reports: Report[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error('Error saving reports to storage:', error);
    }
  }

  /**
   * Lấy danh sách báo cáo với filters và pagination
   */
  getReports(filters: ReportFilters = {}, pagination: PaginationParams = { page: 1, pageSize: 10 }): PaginatedResult<Report> {
    let reports = this.getReportsFromStorage();

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      reports = reports.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.location.toLowerCase().includes(searchLower)
      );
    }

    if (filters.province) {
      reports = reports.filter(r => r.province === filters.province);
    }

    if (filters.topic) {
      reports = reports.filter(r => r.topic === filters.topic);
    }

    if (filters.status) {
      reports = reports.filter(r => r.status === filters.status);
    }

    if (filters.dateFrom) {
      reports = reports.filter(r => new Date(r.createdAt) >= new Date(filters.dateFrom!));
    }

    if (filters.dateTo) {
      reports = reports.filter(r => new Date(r.createdAt) <= new Date(filters.dateTo!));
    }

    // Sort by created date (newest first)
    reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const total = reports.length;
    const totalPages = Math.ceil(total / pagination.pageSize);
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const paginatedData = reports.slice(start, end);

    return {
      data: paginatedData,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages
    };
  }

  /**
   * Lấy báo cáo theo ID
   */
  getReportById(id: string): Report | null {
    const reports = this.getReportsFromStorage();
    return reports.find(r => r.id === id) || null;
  }

  /**
   * Tạo báo cáo mới
   */
  createReport(data: Omit<Report, 'id' | 'createdAt'>): Report {
    const reports = this.getReportsFromStorage();
    const newReport: Report = {
      ...data,
      id: `rpt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    reports.push(newReport);
    this.saveReportsToStorage(reports);
    return newReport;
  }

  /**
   * Cập nhật báo cáo
   */
  updateReport(id: string, data: Partial<Report>): Report | null {
    const reports = this.getReportsFromStorage();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return null;

    reports[index] = { ...reports[index], ...data };
    this.saveReportsToStorage(reports);
    return reports[index];
  }

  /**
   * Xóa báo cáo
   */
  deleteReport(id: string): boolean {
    const reports = this.getReportsFromStorage();
    const filtered = reports.filter(r => r.id !== id);
    if (filtered.length === reports.length) return false;
    
    this.saveReportsToStorage(filtered);
    return true;
  }

  /**
   * Xuất báo cáo ra CSV
   */
  exportReportToCSV(report: Report): Blob {
    const headers = ['Trường', 'Giá trị'];
    const rows = [
      ['Tiêu đề', report.title],
      ['Mẫu báo cáo', report.templateName],
      ['Địa bàn', report.location],
      ['Tỉnh/TP', report.province],
      ['Chuyên đề', report.topic],
      ['Trạng thái', report.status === 'draft' ? 'Nháp' : report.status === 'completed' ? 'Hoàn thành' : 'Lưu trữ'],
      ['Người tạo', report.createdBy],
      ['Ngày tạo', new Date(report.createdAt).toLocaleString('vi-VN')],
      ['Ngày hoàn thành', report.completedAt ? new Date(report.completedAt).toLocaleString('vi-VN') : 'N/A'],
      ['', ''],
      ['Dữ liệu:', ''],
      ...Object.entries(report.data).map(([key, value]) => [key, String(value)])
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Add BOM for UTF-8
    const BOM = '\uFEFF';
    return new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  /**
   * Lấy danh sách templates
   */
  getTemplates() {
    return mockReportTemplates;
  }

  /**
   * Lấy KPI metrics
   */
  getKpiMetrics(period: '7d' | '30d' | '90d' = '7d') {
    // Trong thực tế sẽ tính toán dựa trên period
    return mockKpiMetrics;
  }

  /**
   * Lấy dữ liệu so sánh KPI theo đơn vị
   */
  getCompareByUnit(filters: CompareFilters): CompareRow[] {
    const data = mockCompareData as UnitData[];
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    const days = filters.period === '7d' ? 7 : filters.period === '30d' ? 30 : 90;
    startDate.setDate(endDate.getDate() - days);

    // Filter by date range and province
    let filtered = data.filter(d => {
      const date = new Date(d.date);
      const inRange = date >= startDate && date <= endDate;
      const inProvince = !filters.province || d.province === filters.province;
      return inRange && inProvince;
    });

    // Group by unit
    const grouped = new Map<string, UnitData[]>();
    filtered.forEach(item => {
      const key = item.unitId;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(item);
    });

    // Aggregate and create CompareRow
    const rows: CompareRow[] = [];
    grouped.forEach((items, unitId) => {
      const first = items[0];
      const totals = items.reduce((acc, item) => ({
        leads: acc.leads + item.leads,
        tasks: acc.tasks + item.tasks,
        overdue: acc.overdue + item.overdue,
        violations: acc.violations + item.violations,
        hotspots: acc.hotspots + item.hotspots
      }), { leads: 0, tasks: 0, overdue: 0, violations: 0, hotspots: 0 });

      const total = totals.leads + totals.tasks + totals.violations + totals.hotspots;
      
      // Calculate trend (mock: random between -20 to 20)
      const trend = Math.random() * 40 - 20;

      rows.push({
        id: unitId,
        name: first.unitName,
        type: 'unit',
        ...totals,
        total,
        trend,
        deviation: 0 // Will calculate after we know average
      });
    });

    // Calculate average and deviation
    if (rows.length > 0) {
      const avg = rows.reduce((sum, r) => sum + r.total, 0) / rows.length;
      rows.forEach(r => {
        r.deviation = ((r.total - avg) / avg) * 100;
      });
    }

    // Sort by total descending
    rows.sort((a, b) => b.total - a.total);

    return rows;
  }

  /**
   * Lấy dữ liệu so sánh KPI theo nhóm ngành hàng
   */
  getCompareByCategory(filters: CompareFilters): CompareRow[] {
    const data = mockCompareData as UnitData[];
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    const days = filters.period === '7d' ? 7 : filters.period === '30d' ? 30 : 90;
    startDate.setDate(endDate.getDate() - days);

    // Filter by date range and province
    let filtered = data.filter(d => {
      const date = new Date(d.date);
      const inRange = date >= startDate && date <= endDate;
      const inProvince = !filters.province || d.province === filters.province;
      return inRange && inProvince;
    });

    // Group by category
    const grouped = new Map<string, UnitData[]>();
    filtered.forEach(item => {
      const key = item.categoryGroup;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(item);
    });

    // Aggregate and create CompareRow
    const rows: CompareRow[] = [];
    grouped.forEach((items, category) => {
      const totals = items.reduce((acc, item) => ({
        leads: acc.leads + item.leads,
        tasks: acc.tasks + item.tasks,
        overdue: acc.overdue + item.overdue,
        violations: acc.violations + item.violations,
        hotspots: acc.hotspots + item.hotspots
      }), { leads: 0, tasks: 0, overdue: 0, violations: 0, hotspots: 0 });

      const total = totals.leads + totals.tasks + totals.violations + totals.hotspots;
      
      // Calculate trend (mock: random between -20 to 20)
      const trend = Math.random() * 40 - 20;

      rows.push({
        id: category,
        name: category,
        type: 'category',
        ...totals,
        total,
        trend,
        deviation: 0 // Will calculate after we know average
      });
    });

    // Calculate average and deviation
    if (rows.length > 0) {
      const avg = rows.reduce((sum, r) => sum + r.total, 0) / rows.length;
      rows.forEach(r => {
        r.deviation = ((r.total - avg) / avg) * 100;
      });
    }

    // Sort by total descending
    rows.sort((a, b) => b.total - a.total);

    return rows;
  }

  /**
   * Xuất dữ liệu so sánh ra CSV
   */
  exportCompareToCSV(rows: CompareRow[], filters: CompareFilters): Blob {
    const metricLabels = {
      leads: 'Nguồn tin',
      tasks: 'Nhiệm vụ',
      overdue: 'Quá hạn',
      violations: 'Vi phạm',
      hotspots: 'Điểm nóng'
    };

    const modeLabel = filters.mode === 'unit' ? 'Đơn vị' : 'Nhóm ngành hàng';
    const periodLabel = filters.period === '7d' ? '7 ngày' : filters.period === '30d' ? '30 ngày' : '90 ngày';

    const headers = [
      modeLabel,
      'Nguồn tin',
      'Nhiệm vụ',
      'Quá hạn',
      'Vi phạm',
      'Điểm nóng',
      'Tổng',
      'Xu hướng (%)',
      'Chênh lệch (%)'
    ];

    const csvRows = rows.map(row => [
      row.name,
      row.leads,
      row.tasks,
      row.overdue,
      row.violations,
      row.hotspots,
      row.total,
      row.trend.toFixed(1),
      row.deviation.toFixed(1)
    ]);

    const csvContent = [
      `# So sánh KPI - ${periodLabel}`,
      `# Chế độ: ${filters.mode === 'unit' ? 'Theo đơn vị' : 'Theo nhóm ngành hàng'}`,
      `# Địa bàn: ${filters.province || 'Tất cả'}`,
      `# Xuất lúc: ${new Date().toLocaleString('vi-VN')}`,
      '',
      headers.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Add BOM for UTF-8
    const BOM = '\uFEFF';
    return new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  }
}

export const reportService = new ReportService();
