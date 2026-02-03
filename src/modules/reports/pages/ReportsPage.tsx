import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '@/layouts/PageHeader';
import {
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  Building2,
  MapPin,
  TrendingUp,
  Users,
  Eye,
  ChevronDown,
  History,
  ShieldAlert,
  X,
  AlertCircle,
} from 'lucide-react';
import { ExportDialog, ExportFormat } from '@/components/reports/ExportDialog';
import { ExportHistoryDialog, ExportHistoryItem } from '@/components/reports/ExportHistoryDialog';
import { ToastNotification, ToastType } from '@/components/reports/ToastNotification';
import { exportFacilityReportToExcel, formatExportDate } from '@/utils/excelExport';
import { quan1FacilitiesData } from '@/utils/data/quan1Facilities';
import { quan3FacilitiesData } from '@/utils/data/quan3Facilities';

export default function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dashboardState = location.state as {
    reportType?: string;
    filters?: Record<string, any>;
    fromDashboard?: boolean;
    kpiTitle?: string;
  } | null;

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchText, setSearchText] = useState('');
  
  // Export & History states
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([
    {
      id: 'EXP-001',
      reportName: 'Báo cáo tình hình cơ sở ATTP - Thành phố Hồ Chí Minh',
      format: 'excel',
      status: 'completed',
      createdBy: 'Nguyễn Văn A',
      createdAt: '08/01/2025 14:30',
      fileSize: '2.3 MB',
    },
    {
      id: 'EXP-002',
      reportName: 'Báo cáo kiểm tra vệ sinh ATTP - Phường 3',
      format: 'pdf',
      status: 'completed',
      createdBy: 'Trần Thị B',
      createdAt: '07/01/2025 10:15',
      fileSize: '1.8 MB',
    },
    {
      id: 'EXP-003',
      reportName: 'Tổng hợp nguồn tin rủi ro',
      format: 'csv',
      status: 'failed',
      createdBy: 'Lê Văn C',
      createdAt: '05/01/2025 16:45',
    },
  ]);

  // Toast states
  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    title: string;
    message: string;
  }>({
    show: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Permission states
  const [userPermissions, setUserPermissions] = useState({
    canView: true,
    canExport: true,
    canExportPDF: true,
    canExportExcel: true,
    canExportCSV: true,
  });

  // Mock reports data
  const reports = [
    {
    id: 'RPT-2025-001',
    name: 'Báo cáo tình hình cơ sở ATTP - Thành phố Hồ Chí Minh',
    type: 'Cơ sở quản lý',
      period: 'Tháng 01/2025',
      region: 'Thành phố Hồ Chí Minh',
      createdDate: '2025-01-08',
      createdBy: 'Nguyễn Văn A',
      status: 'completed',
      size: '2.3 MB',
    },
    {
      id: 'RPT-2025-002',
      name: 'Báo cáo kiểm tra vệ sinh ATTP - Phường 3',
      type: 'Nhiệm vụ hiện trường',
      period: 'Tuần 1/2025',
      region: 'Phường 3',
      createdDate: '2025-01-07',
      createdBy: 'Trần Thị B',
      status: 'completed',
      size: '1.8 MB',
    },
    {
      id: 'RPT-2025-003',
      name: 'Tổng hợp nguồn tin rủi ro - Toàn thành phố',
      type: 'Nguồn tin / Risk',
      period: 'Tháng 12/2024',
      region: 'Toàn thành phố',
      createdDate: '2025-01-05',
      createdBy: 'Lê Văn C',
      status: 'completed',
      size: '4.1 MB',
    },
    {
      id: 'RPT-2025-004',
      name: 'Báo cáo KPI cán bộ kiểm tra',
      type: 'KPI & Hiệu suất',
      period: 'Q4/2024',
      region: 'Toàn thành phố',
      createdDate: '2025-01-04',
      createdBy: 'Phạm Thị D',
      status: 'completed',
      size: '856 KB',
    },
    {
      id: 'RPT-2025-005',
      name: 'Báo cáo kế hoạch tác nghiệp - Phường 5',
      type: 'Kế hoạch',
      period: 'Tháng 01/2025',
      region: 'Phường 5',
      createdDate: '2025-01-03',
      createdBy: 'Hoàng Văn E',
      status: 'draft',
      size: '1.2 MB',
    },
  ];

  const reportTemplates = [
    { id: 1, name: 'Báo cáo tình hình cơ sở theo khu vực', icon: Building2, path: '/facility-report' },
    { id: 2, name: 'Báo cáo tiến độ nhiệm vụ', icon: TrendingUp, path: '/task-progress-report' },
    { id: 3, name: 'Báo cáo nguồn tin và rủi ro', icon: FileText, path: '/risk-source-report' },
    { id: 4, name: 'Báo cáo hiệu suất cán bộ', icon: Users, path: '/staff-performance-report' },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      searchText === '' ||
      report.name.toLowerCase().includes(searchText.toLowerCase()) ||
      report.id.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesRegion = selectedRegion === 'all' || report.region === selectedRegion;
    
    return matchesSearch && matchesRegion;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: { bg: '#10b98115', color: '#10b981', text: 'Hoàn thành' },
      draft: { bg: '#f59e0b15', color: '#f59e0b', text: 'Bản nháp' },
      pending: { bg: '#3b82f615', color: '#3b82f6', text: 'Đang xử lý' },
    };
    
    const style = styles[status as keyof typeof styles] || styles.pending;
    
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: 'calc(var(--radius, 6px) * 0.75)',
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          background: style.bg,
          color: style.color,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {style.text}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      {/* Page Header - NO PADDING */}
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Báo cáo & KPI', href: '/reports' },
          { label: 'Báo cáo' },
        ]}
        title="Báo cáo"
        description="Chạy và xem các báo cáo chuẩn của hệ thống"
        actions={
          <div style={{ display: 'flex', gap: 'var(--spacing-3, 12px)' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2, 8px)',
                padding: 'var(--spacing-3, 12px) var(--spacing-5, 20px)',
                background: 'var(--primary, #005cb6)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius, 6px)',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              <FileText size={16} />
              Chạy báo cáo
            </button>
          </div>
        }
      />

      {/* Content with padding */}
      <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Applied Filters from Dashboard */}
        {dashboardState?.fromDashboard && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--spacing-3, 12px)',
              padding: 'var(--spacing-4, 16px)',
              background: 'rgba(0, 92, 182, 0.05)',
              border: '1px solid rgba(0, 92, 182, 0.2)',
              borderRadius: 'var(--radius, 6px)',
            }}
          >
            <AlertCircle size={20} style={{ color: 'var(--primary, #005cb6)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--foreground, #111827)',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: 'var(--spacing-2, 8px)',
                }}
              >
                Báo cáo từ Dashboard: {dashboardState.kpiTitle}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--spacing-2, 8px)',
                }}
              >
                {Object.entries(dashboardState.filters || {}).map(([key, value]) => (
                  <span
                    key={key}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-1, 4px)',
                      padding: '4px 10px',
                      background: 'var(--card, #ffffff)',
                      border: '1px solid rgba(0, 92, 182, 0.3)',
                      borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: 'var(--primary, #005cb6)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <strong>{key}:</strong> {value as string}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => window.history.replaceState({}, document.title)}
              style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                borderRadius: 'calc(var(--radius, 6px) * 0.5)',
                color: 'var(--muted-foreground, #6b7280)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              title="Xóa bộ lọc"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Quick Templates */}
        <div
          style={{
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: 'var(--radius, 6px)',
            padding: 'var(--spacing-5, 20px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-2, 8px)' }}>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--foreground, #111827)',
                fontFamily: 'Inter, sans-serif',
                margin: 0,
              }}
            >
              Báo cáo chuẩn của hệ thống
            </h3>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--muted-foreground, #9ca3af)',
                fontFamily: 'Inter, sans-serif',
                margin: 0,
              }}
            >
              Click để chạy báo cáo với tham số
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--spacing-3, 12px)',
              marginTop: 'var(--spacing-4, 16px)',
            }}
          >
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => navigate(template.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-3, 12px)',
                    padding: 'var(--spacing-4, 16px)',
                    background: 'var(--muted, #f9fafb)',
                    border: '1px solid var(--border, #e5e7eb)',
                    borderRadius: 'var(--radius, 6px)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--card, #ffffff)';
                    e.currentTarget.style.borderColor = 'var(--primary, #005cb6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--muted, #f9fafb)';
                    e.currentTarget.style.borderColor = 'var(--border, #e5e7eb)';
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                      background: 'rgba(0, 92, 182, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} style={{ color: 'var(--primary, #005cb6)' }} />
                  </div>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--foreground, #111827)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {template.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: 'var(--radius, 6px)',
            padding: 'var(--spacing-4, 16px)',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--spacing-3, 12px)', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted-foreground, #9ca3af)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Tìm báo cáo theo tên, mã..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3, 12px) var(--spacing-3, 12px) var(--spacing-3, 12px) 40px',
                  border: '1px solid var(--border, #e5e7eb)',
                  borderRadius: 'var(--radius, 6px)',
                  fontSize: '13px',
                  fontFamily: 'Inter, sans-serif',
                  color: 'var(--foreground, #111827)',
                  background: 'var(--card, #ffffff)',
                }}
              />
            </div>

            {/* Period Filter */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                padding: 'var(--spacing-3, 12px) var(--spacing-4, 16px)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'var(--radius, 6px)',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                color: 'var(--foreground, #111827)',
                background: 'var(--card, #ffffff)',
                cursor: 'pointer',
              }}
            >
              <option value="thisMonth">Tháng này</option>
              <option value="lastMonth">Tháng trước</option>
              <option value="thisQuarter">Quý này</option>
              <option value="thisYear">Năm nay</option>
              <option value="custom">Tùy chỉnh</option>
            </select>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{
                padding: 'var(--spacing-3, 12px) var(--spacing-4, 16px)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'var(--radius, 6px)',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                color: 'var(--foreground, #111827)',
                background: 'var(--card, #ffffff)',
                cursor: 'pointer',
              }}
            >
              <option value="all">Tất cả khu vực</option>
              <option value="Phường 1">Phường 1</option>
              <option value="Phường 3">Phường 3</option>
              <option value="Phường 5">Phường 5</option>
              <option value="Toàn thành phố">Toàn thành phố</option>
            </select>

            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2, 8px)',
                padding: 'var(--spacing-3, 12px) var(--spacing-4, 16px)',
                background: 'var(--card, #ffffff)',
                color: 'var(--foreground, #111827)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'var(--radius, 6px)',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              <Filter size={16} />
              Lọc nâng cao
            </button>
          </div>
        </div>

        {/* Reports Table */}
        <div
          style={{
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: 'var(--radius, 6px)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr
                style={{
                  background: 'var(--muted, #f9fafb)',
                  borderBottom: '1px solid var(--border, #e5e7eb)',
                }}
              >
                <th
                  style={{
                    padding: 'var(--spacing-4, 16px)',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--muted-foreground, #6b7280)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Mã báo cáo
                </th>
                <th
                  style={{
                    padding: 'var(--spacing-4, 16px)',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--muted-foreground, #6b7280)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Tên báo cáo
                </th>
                <th
                  style={{
                    padding: 'var(--spacing-4, 16px)',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--muted-foreground, #6b7280)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Loại
                </th>
                <th
                  style={{
                    padding: 'var(--spacing-4, 16px)',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--muted-foreground, #6b7280)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Kỳ báo cáo
                </th>
                <th
                  style={{
                    padding: 'var(--spacing-4, 16px)',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--muted-foreground, #6b7280)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Khu vực
                </th>
                <th
                  style={{
                    padding: 'var(--spacing-4, 16px)',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--muted-foreground, #6b7280)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Trạng thái
                </th>
                <th
                  style={{
                    padding: 'var(--spacing-4, 16px)',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--muted-foreground, #6b7280)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  style={{
                    borderBottom: '1px solid var(--border, #e5e7eb)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--muted, #f9fafb)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td
                    style={{
                      padding: 'var(--spacing-4, 16px)',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      color: 'var(--foreground, #111827)',
                    }}
                  >
                    <code
                      style={{
                        padding: '4px 8px',
                        background: 'var(--muted, #f3f4f6)',
                        border: '1px solid var(--border, #e5e7eb)',
                        borderRadius: 'calc(var(--radius, 6px) * 0.5)',
                        fontSize: '11px',
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 600,
                      }}
                    >
                      {report.id}
                    </code>
                  </td>
                  <td
                    style={{
                      padding: 'var(--spacing-4, 16px)',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      color: 'var(--foreground, #111827)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2, 8px)' }}>
                      <FileText size={16} style={{ color: 'var(--muted-foreground, #6b7280)', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 500 }}>{report.name}</div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--muted-foreground, #9ca3af)',
                            marginTop: '2px',
                          }}
                        >
                          Tạo bởi {report.createdBy} • {report.size}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: 'var(--spacing-4, 16px)',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      color: 'var(--muted-foreground, #6b7280)',
                    }}
                  >
                    {report.type}
                  </td>
                  <td
                    style={{
                      padding: 'var(--spacing-4, 16px)',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      color: 'var(--muted-foreground, #6b7280)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      {report.period}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: 'var(--spacing-4, 16px)',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      color: 'var(--muted-foreground, #6b7280)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} />
                      {report.region}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4, 16px)', textAlign: 'center' }}>
                    {getStatusBadge(report.status)}
                  </td>
                  <td style={{ padding: 'var(--spacing-4, 16px)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-2, 8px)', justifyContent: 'center' }}>
                      <button
                        onClick={() => {
                          // Navigate to FacilityReportPage with drill-down state
                          if (report.id === 'RPT-2025-001') {
                            navigate('/facility-report', {
                              state: {
                                viewMode: 'drill-down',
                                selectedDistrict: 'Thành phố Hồ Chí Minh',
                              },
                            });
                          } else if (report.id === 'RPT-2025-002') {
                            navigate('/facility-report', {
                              state: {
                                viewMode: 'drill-down',
                                selectedDistrict: 'Phường 3',
                              },
                            });
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          background: 'none',
                          border: '1px solid var(--border, #e5e7eb)',
                          borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                          color: 'var(--muted-foreground, #6b7280)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        title="Xem báo cáo"
                      >
                        <Eye size={16} />
                      </button>
                      {userPermissions.canExport ? (
                        <button
                          onClick={() => {
                            setSelectedReport(report.name);
                            setExportDialogOpen(true);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            background: 'none',
                            border: '1px solid var(--border, #e5e7eb)',
                            borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                            color: 'var(--muted-foreground, #6b7280)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          title="Xuất dữ liệu"
                        >
                          <Download size={16} />
                        </button>
                      ) : (
                        <button
                          disabled
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            background: 'var(--muted, #f3f4f6)',
                            border: '1px solid var(--border, #e5e7eb)',
                            borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                            color: 'var(--muted-foreground, #9ca3af)',
                            cursor: 'not-allowed',
                            opacity: 0.5,
                          }}
                          title="Bạn không có quyền xuất dữ liệu"
                        >
                          <Download size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReports.length === 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-3, 12px)',
                padding: 'var(--spacing-8, 32px)',
                color: 'var(--muted-foreground, #6b7280)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
              }}
            >
              <FileText size={48} style={{ opacity: 0.3 }} />
              <div>Không tìm thấy báo cáo nào</div>
            </div>
          )}

          {/* Table Footer */}
          <div
            style={{
              borderTop: '1px solid var(--border, #e5e7eb)',
              padding: 'var(--spacing-4, 16px)',
              background: 'var(--muted, #f9fafb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--spacing-3, 12px)',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: 'var(--muted-foreground, #6b7280)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Hiển thị {filteredReports.length} báo cáo
            </div>
            <button
              onClick={() => setHistoryDialogOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2, 8px)',
                padding: 'var(--spacing-2, 8px) var(--spacing-3, 12px)',
                background: 'none',
                color: 'var(--primary, #005cb6)',
                border: 'none',
                borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 92, 182, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              <History size={14} />
              Xem lịch sử xuất dữ liệu
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        reportName={selectedReport}
        onExport={(format: ExportFormat) => {
          // Check if this is the TPHCM report - if so, export real data
          if (selectedReport === 'Báo cáo tình hình cơ sở ATTP - Thành phố Hồ Chí Minh') {
            // Prepare data for export with real quan1FacilitiesData
            const areaSummary = [{
              area: 'Thành phố Hồ Chí Minh',
              totalFacilities: quan1FacilitiesData.length,
              activeFacilities: quan1FacilitiesData.filter(f => f.status === 'active').length,
              highRisk: quan1FacilitiesData.filter(f => f.riskLevel === 'high').length,
              violations: quan1FacilitiesData.reduce((sum, f) => sum + (f.violations || 0), 0),
              resolved: Math.floor(quan1FacilitiesData.reduce((sum, f) => sum + (f.violations || 0), 0) * 0.8),
              riskRate: (quan1FacilitiesData.filter(f => f.riskLevel === 'high').length / quan1FacilitiesData.length) * 100,
            }];

            const facilityDetails = quan1FacilitiesData.map(f => ({
              code: f.id,
              name: f.name,
              type: f.type,
              address: f.address,
              ward: f.ward || 'Phường Bến Nghé',
              district: 'Thành phố Hồ Chí Minh',
              riskLevel: f.riskLevel,
              legalStatus: f.legalStatus || 'Đầy đủ',
              status: f.status || ('active' as const),
            }));

            // Calculate type summary from actual facilities data
            const typeGroups: Record<string, { total: number; highRisk: number; violations: number }> = {};
            quan1FacilitiesData.forEach(f => {
              if (!typeGroups[f.type]) {
                typeGroups[f.type] = { total: 0, highRisk: 0, violations: 0 };
              }
              typeGroups[f.type].total++;
              if (f.riskLevel === 'high') typeGroups[f.type].highRisk++;
              if (f.violations && f.violations > 0) typeGroups[f.type].violations += f.violations;
            });

            const typeSummary = Object.entries(typeGroups).map(([type, stats]) => ({
              type,
              total: stats.total,
              highRisk: stats.highRisk,
              violations: stats.violations,
            }));

            const options = {
              period: 'Tháng 01/2025',
              area: 'Thành phố Hồ Chí Minh',
              exportDate: formatExportDate(),
            };

            // Export real data using the Excel export utility
            const fileName = exportFacilityReportToExcel(areaSummary, facilityDetails, typeSummary, options);
            
            // Add to history
            const newExport: ExportHistoryItem = {
              id: `EXP-${String(exportHistory.length + 1).padStart(3, '0')}`,
              reportName: selectedReport,
              format: 'excel',
              status: 'completed',
              createdBy: 'Nguyễn Văn A',
              createdAt: new Date().toLocaleString('vi-VN'),
              fileSize: '850 KB',
            };
            setExportHistory([newExport, ...exportHistory]);
            
            // Show detailed toast
            setToast({
              show: true,
              type: 'success',
              title: 'Xuất Excel thành công!',
              message: `File: ${fileName}\nSố sheets: 4 | Tổng records: ${quan1FacilitiesData.length}`,
            });
          } else if (selectedReport === 'Báo cáo kiểm tra vệ sinh ATTP - Phường 3') {
            // Prepare data for export with real quan3FacilitiesData
            const areaSummary = [{
              area: 'Phường 3',
              totalFacilities: quan3FacilitiesData.length,
              activeFacilities: quan3FacilitiesData.filter(f => f.status === 'active').length,
              highRisk: quan3FacilitiesData.filter(f => f.riskLevel === 'high').length,
              violations: quan3FacilitiesData.reduce((sum, f) => sum + (f.violations || 0), 0),
              resolved: Math.floor(quan3FacilitiesData.reduce((sum, f) => sum + (f.violations || 0), 0) * 0.8),
              riskRate: (quan3FacilitiesData.filter(f => f.riskLevel === 'high').length / quan3FacilitiesData.length) * 100,
            }];

            const facilityDetails = quan3FacilitiesData.map(f => ({
              code: f.id,
              name: f.name,
              type: f.type,
              address: f.address,
              ward: f.ward || 'Phường Bến Nghé',
              district: 'Phường 3',
              riskLevel: f.riskLevel,
              legalStatus: f.legalStatus || 'Đầy đủ',
              status: f.status || ('active' as const),
            }));

            // Calculate type summary from actual facilities data
            const typeGroups: Record<string, { total: number; highRisk: number; violations: number }> = {};
            quan3FacilitiesData.forEach(f => {
              if (!typeGroups[f.type]) {
                typeGroups[f.type] = { total: 0, highRisk: 0, violations: 0 };
              }
              typeGroups[f.type].total++;
              if (f.riskLevel === 'high') typeGroups[f.type].highRisk++;
              if (f.violations && f.violations > 0) typeGroups[f.type].violations += f.violations;
            });

            const typeSummary = Object.entries(typeGroups).map(([type, stats]) => ({
              type,
              total: stats.total,
              highRisk: stats.highRisk,
              violations: stats.violations,
            }));

            const options = {
              period: 'Tháng 01/2025',
              area: 'Phường 3',
              exportDate: formatExportDate(),
            };

            // Export real data using the Excel export utility
            const fileName = exportFacilityReportToExcel(areaSummary, facilityDetails, typeSummary, options);
            
            // Add to history
            const newExport: ExportHistoryItem = {
              id: `EXP-${String(exportHistory.length + 1).padStart(3, '0')}`,
              reportName: selectedReport,
              format: 'excel',
              status: 'completed',
              createdBy: 'Nguyễn Văn A',
              createdAt: new Date().toLocaleString('vi-VN'),
              fileSize: '850 KB',
            };
            setExportHistory([newExport, ...exportHistory]);
            
            // Show detailed toast
            setToast({
              show: true,
              type: 'success',
              title: 'Xuất Excel thành công!',
              message: `File: ${fileName}\nSố sheets: 4 | Tổng records: ${quan3FacilitiesData.length}`,
            });
          } else {
            // Generic export for other reports
            const newExport: ExportHistoryItem = {
              id: `EXP-${String(exportHistory.length + 1).padStart(3, '0')}`,
              reportName: selectedReport,
              format,
              status: 'completed',
              createdBy: 'Nguyễn Văn A',
              createdAt: new Date().toLocaleString('vi-VN'),
              fileSize: '2.5 MB',
            };
            setExportHistory([newExport, ...exportHistory]);
            
            // Show toast
            setToast({
              show: true,
              type: 'success',
              title: 'Xuất dữ liệu thành công',
              message: `File ${format.toUpperCase()} đã được tạo và sẵn sàng tải xuống.`,
            });
          }
        }}
      />

      <ExportHistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        history={exportHistory}
      />

      {/* Toast Notification */}
      <ToastNotification
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
