import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Store,
  Users,
  Calendar,
  MapPin,
  BarChart3,
  PieChart,
  Download,
  FileText,
  Target,
} from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './InspectionRoundStatistics.module.css';
import { InspectionRoundStatusBadge } from '../../components/inspections/InspectionRoundStatusBadge';
import { toast } from 'sonner';

// Mock data cho thống kê
const mockStatisticsData = {
  roundInfo: {
    id: 'DKT-2026-01-001',
    code: 'Đợt 1',
    name: 'Kiểm tra Tết Nguyên Đán 2026',
    status: 'completed' as const,
    type: 'routine' as const,
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    leadUnit: 'Chi cục QLTT Quận 1',
  },
  overview: {
    totalSessions: 48,
    completedSessions: 48,
    totalStores: 42,
    inspectedStores: 42,
    violationsFound: 18,
    violationRate: 42.9,
    complianceRate: 57.1,
    avgInspectionTime: 45, // minutes
  },
  violationsByType: [
    { type: 'An toàn thực phẩm', count: 8, percentage: 44.4, color: '#DC2626' },
    { type: 'Phòng cháy chữa cháy', count: 5, percentage: 27.8, color: '#F59E0B' },
    { type: 'Vệ sinh môi trường', count: 3, percentage: 16.7, color: '#10B981' },
    { type: 'Quản lý giá cả', count: 2, percentage: 11.1, color: '#3B82F6' },
  ],
  violationsByWard: [
    { ward: 'Phường Bến Nghé', stores: 12, violations: 6, rate: 50 },
    { ward: 'Phường Bến Thành', stores: 10, violations: 4, rate: 40 },
    { ward: 'Phường Nguyễn Thái Bình', stores: 8, violations: 3, rate: 37.5 },
    { ward: 'Phường Cô Giang', stores: 7, violations: 3, rate: 42.9 },
    { ward: 'Phường Cầu Kho', stores: 5, violations: 2, rate: 40 },
  ],
  inspectionProgress: [
    { date: '01/01', planned: 5, completed: 4, violations: 1 },
    { date: '05/01', planned: 10, completed: 9, violations: 3 },
    { date: '10/01', planned: 15, completed: 14, violations: 5 },
    { date: '15/01', planned: 25, completed: 24, violations: 9 },
    { date: '20/01', planned: 35, completed: 33, violations: 14 },
    { date: '25/01', planned: 42, completed: 40, violations: 16 },
    { date: '31/01', planned: 42, completed: 42, violations: 18 },
  ],
  topViolations: [
    {
      id: '1',
      storeName: 'Cửa hàng Thực phẩm An Khang',
      storeCode: 'CH-001',
      ward: 'Phường Bến Nghé',
      violationCount: 4,
      severity: 'high' as const,
      types: ['An toàn thực phẩm', 'Vệ sinh môi trường'],
    },
    {
      id: '2',
      storeName: 'Siêu thị mini Phú Thọ',
      storeCode: 'CH-002',
      ward: 'Phường Bến Thành',
      violationCount: 3,
      severity: 'medium' as const,
      types: ['Phòng cháy chữa cháy'],
    },
    {
      id: '3',
      storeName: 'Chợ Bến Thành - Gian hàng A12',
      storeCode: 'CH-004',
      ward: 'Phường Bến Thành',
      violationCount: 3,
      severity: 'medium' as const,
      types: ['An toàn thực phẩm', 'Quản lý giá cả'],
    },
    {
      id: '4',
      storeName: 'Cửa hàng Sức khỏe Việt',
      storeCode: 'CH-003',
      ward: 'Phường Nguyễn Thái Bình',
      violationCount: 2,
      severity: 'low' as const,
      types: ['Vệ sinh môi trường'],
    },
    {
      id: '5',
      storeName: 'Cửa hàng Thực phẩm Sạch Hà Thành',
      storeCode: 'CH-005',
      ward: 'Phường Tân Định',
      violationCount: 2,
      severity: 'low' as const,
      types: ['An toàn thực phẩm'],
    },
  ],
};

const COLORS = ['#DC2626', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

export default function InspectionRoundStatistics() {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const data = mockStatisticsData;

  const handleBack = () => {
    navigate('/plans/inspection-rounds');
  };

  const handleExportPDF = () => {
    toast.success('Đang xuất báo cáo thống kê PDF...');
  };

  const handleExportExcel = () => {
    toast.success('Đang xuất dữ liệu thống kê Excel...');
  };

  const getSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    const config = {
      high: { label: 'Nghiêm trọng', color: '#DC2626', bg: '#FEF2F2' },
      medium: { label: 'Trung bình', color: '#F59E0B', bg: '#FEF3C7' },
      low: { label: 'Nhẹ', color: '#10B981', bg: '#D1FAE5' },
    };
    const { label, color, bg } = config[severity];
    return (
      <span
        className={styles.severityBadge}
        style={{ color, background: bg }}
      >
        {label}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backButton} onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>

          <div className={styles.headerTitle}>
            <div className={styles.headerTitleRow}>
              <span className={styles.roundCode}>{data.roundInfo.code}</span>
              <InspectionRoundStatusBadge type="round" value={data.roundInfo.status} size="sm" />
              <InspectionRoundStatusBadge type="inspectionType" value={data.roundInfo.type} size="sm" />
            </div>
            <h1 className={styles.pageTitle}>Thống kê đợt kiểm tra</h1>
            <p className={styles.pageSubtitle}>{data.roundInfo.name}</p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.outlineButton} onClick={handleExportExcel}>
              <Download size={18} />
              Xuất Excel
            </button>
            <button className={styles.primaryButton} onClick={handleExportPDF}>
              <FileText size={18} />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Info Bar */}
        <div className={styles.infoBar}>
          <div className={styles.infoItem}>
            <Calendar size={16} className={styles.infoIcon} />
            <span>{new Date(data.roundInfo.startDate).toLocaleDateString('vi-VN')} - {new Date(data.roundInfo.endDate).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className={styles.infoItem}>
            <Users size={16} className={styles.infoIcon} />
            <span>{data.roundInfo.leadUnit}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Summary Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#005cb6' }}>
              <Target size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Tổng số cơ sở</div>
              <div className={styles.statValue}>{data.overview.totalStores}</div>
              <div className={styles.statSubtext}>
                {data.overview.inspectedStores}/{data.overview.totalStores} đã kiểm tra
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#10B981' }}>
              <CheckCircle2 size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Tỷ lệ tuân thủ</div>
              <div className={styles.statValue} style={{ color: '#10B981' }}>
                {data.overview.complianceRate}%
              </div>
              <div className={`${styles.statSubtext} ${styles.statPositive}`}>
                <TrendingUp size={14} />
                Đạt chuẩn
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#DC2626' }}>
              <AlertCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Vi phạm phát hiện</div>
              <div className={styles.statValue} style={{ color: '#DC2626' }}>
                {data.overview.violationsFound}
              </div>
              <div className={styles.statSubtext}>
                Tỷ lệ {data.overview.violationRate}%
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#8B5CF6' }}>
              <BarChart3 size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statLabel}>Số phiên kiểm tra</div>
              <div className={styles.statValue}>{data.overview.totalSessions}</div>
              <div className={styles.statSubtext}>
                Hoàn thành 100%
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className={styles.chartsGrid}>
          {/* Tiến độ kiểm tra */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>Tiến độ kiểm tra theo thời gian</h2>
              <BarChart3 size={20} className={styles.chartIcon} />
            </div>
            <div className={styles.chartContent}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.inspectionProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--muted-foreground)"
                    style={{ fontSize: 'var(--text-xs)' }}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)"
                    style={{ fontSize: 'var(--text-xs)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontSize: 'var(--text-sm)',
                      paddingTop: '20px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="planned" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Kế hoạch"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Đã hoàn thành"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="violations" 
                    stroke="#DC2626" 
                    strokeWidth={2}
                    name="Vi phạm"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vi phạm theo loại */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>Phân loại vi phạm</h2>
              <PieChart size={20} className={styles.chartIcon} />
            </div>
            <div className={styles.chartContent}>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={data.violationsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.violationsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Vi phạm theo phường/xã */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div>
              <h2 className={styles.tableTitle}>Thống kê theo phường/xã</h2>
              <p className={styles.tableSubtitle}>Tổng số {data.violationsByWard.length} phường/xã</p>
            </div>
            <MapPin size={20} className={styles.tableIcon} />
          </div>
          <div className={styles.tableContent}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Phường/Xã</th>
                  <th>Số cơ sở</th>
                  <th>Vi phạm</th>
                  <th>Tỷ lệ vi phạm</th>
                  <th>Biểu đồ</th>
                </tr>
              </thead>
              <tbody>
                {data.violationsByWard.map((item, index) => (
                  <tr key={index}>
                    <td className={styles.textCenter}>{index + 1}</td>
                    <td className={styles.wardName}>{item.ward}</td>
                    <td className={styles.textCenter}>{item.stores}</td>
                    <td className={styles.textCenter}>
                      <span className={styles.violationBadge}>{item.violations}</span>
                    </td>
                    <td className={styles.textCenter}>
                      <span style={{ color: item.rate > 45 ? '#DC2626' : item.rate > 35 ? '#F59E0B' : '#10B981' }}>
                        {item.rate}%
                      </span>
                    </td>
                    <td>
                      <div className={styles.progressBarContainer}>
                        <div 
                          className={styles.progressBarFill}
                          style={{ 
                            width: `${item.rate}%`,
                            background: item.rate > 45 ? '#DC2626' : item.rate > 35 ? '#F59E0B' : '#10B981'
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top vi phạm */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div>
              <h2 className={styles.tableTitle}>Cơ sở có vi phạm</h2>
              <p className={styles.tableSubtitle}>Top {data.topViolations.length} cơ sở có nhiều vi phạm nhất</p>
            </div>
            <Store size={20} className={styles.tableIcon} />
          </div>
          <div className={styles.tableContent}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>STT</th>
                  <th>Cửa hàng</th>
                  <th>Phường/Xã</th>
                  <th>Loại vi phạm</th>
                  <th style={{ width: '120px' }}>Số vi phạm</th>
                  <th style={{ width: '140px' }}>Mức độ</th>
                </tr>
              </thead>
              <tbody>
                {data.topViolations.map((item, index) => (
                  <tr key={item.id}>
                    <td className={styles.textCenter}>{index + 1}</td>
                    <td>
                      <div className={styles.storeInfo}>
                        <div className={styles.storeName}>{item.storeName}</div>
                        <div className={styles.storeCode}>{item.storeCode}</div>
                      </div>
                    </td>
                    <td>{item.ward}</td>
                    <td>
                      <div className={styles.typeTags}>
                        {item.types.map((type, i) => (
                          <span key={i} className={styles.typeTag}>{type}</span>
                        ))}
                      </div>
                    </td>
                    <td className={styles.textCenter}>
                      <span className={styles.violationCount}>{item.violationCount}</span>
                    </td>
                    <td className={styles.textCenter}>
                      {getSeverityBadge(item.severity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
