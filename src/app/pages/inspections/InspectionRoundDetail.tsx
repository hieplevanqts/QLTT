import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  FileText,
  Users,
  Plus,
  TrendingUp,
  Download,
  Edit,
  CheckCircle,
  AlertCircle,
  Target,
  ClipboardCheck,
  BarChart3,
  Eye,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react';

import styles from './InspectionRoundDetail.module.css';
import { InspectionRoundStatusBadge } from '../../components/inspections/InspectionRoundStatusBadge';
import { CreateSessionDialog } from '../../components/inspections/CreateSessionDialog';
import { InsFormDetailDialog } from '../../components/inspections/InsFormDetailDialog';

import { useSupabaseInspectionRound } from '@/hooks/useSupabaseInspectionRound';
import { toast } from 'sonner';

type TabType = 'overview' | 'sessions' | 'team' | 'scope' | 'history';

const TABS = [
  { id: 'overview' as TabType, label: 'Tổng quan' },
  { id: 'sessions' as TabType, label: 'Phiên kiểm tra', badge: 6 },
  { id: 'team' as TabType, label: 'Nhân sự', badge: 4 },
  { id: 'scope' as TabType, label: 'Phạm vi' },
  { id: 'history' as TabType, label: 'Lịch sử cập nhật', badge: 12 },
];





// Mock sessions data
const mockSessions = [
  {
    id: 'PS-001',
    storeCode: 'CH-001',
    storeName: 'Cửa hàng Thực phẩm An Khang',
    address: '123 Nguyễn Trãi, P. Bến Nghé, Q.1',
    inspector: 'Nguyễn Văn A',
    date: '2025-01-05',
    time: '09:00',
    status: 'completed' as const,
    violationCount: 2,
  },
  {
    id: 'PS-002',
    storeCode: 'CH-002',
    storeName: 'Siêu thị mini Phú Thọ',
    address: '456 Lê Hồng Phong, P. Bến Thành, Q.1',
    inspector: 'Trần Thị B',
    date: '2025-01-05',
    time: '14:00',
    status: 'completed' as const,
    violationCount: 0,
  },
  {
    id: 'PS-003',
    storeCode: 'CH-003',
    storeName: 'Cửa hàng Sức khỏe Việt',
    address: '789 Võ Văn Tần, P. Nguyễn Thái Bình, Q.1',
    inspector: 'Lê Văn C',
    date: '2025-01-06',
    time: '10:30',
    status: 'in_progress' as const,
    violationCount: 1,
  },
  {
    id: 'PS-004',
    storeCode: 'CH-004',
    storeName: 'Chợ Bến Thành - Gian hàng A12',
    address: 'Lê Lợi, P. Bến Thành, Q.1',
    inspector: 'Nguyễn Văn A',
    date: '2025-01-07',
    time: '08:00',
    status: 'scheduled' as const,
    violationCount: 0,
  },
  {
    id: 'PS-005',
    storeCode: 'CH-005',
    storeName: 'Cửa hàng Thực phẩm Sạch Hà Thành',
    address: '234 Hai Bà Trưng, P. Tân Định, Q.1',
    inspector: 'Phạm Thị D',
    date: '2025-01-07',
    time: '13:30',
    status: 'scheduled' as const,
    violationCount: 0,
  },
  {
    id: 'PS-006',
    storeCode: 'CH-006',
    storeName: 'Siêu thị CoopMart Cống Quỳnh',
    address: '168 Cống Quỳnh, P. Phạm Ngũ Lão, Q.1',
    inspector: 'Trần Thị B',
    date: '2025-01-08',
    time: '09:30',
    status: 'scheduled' as const,
    violationCount: 0,
  },
];

// Mock team members data
const mockTeamMembers = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    position: 'Đội trưởng',
    role: 'leader',
    avatar: 'NVA',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    position: 'Thanh tra viên',
    role: 'member',
    avatar: 'TTB',
  },
  {
    id: '3',
    name: 'Lê Văn C',
    position: 'Thanh tra viên',
    role: 'member',
    avatar: 'LVC',
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    position: 'Thanh tra viên',
    role: 'member',
    avatar: 'PTD',
  },
];

// Mock history data với tham chiếu biểu mẫu INS
const mockHistory = [
  {
    id: 'h-12',
    timestamp: '2025-01-15T16:30:00',
    user: 'Nguyễn Văn A',
    action: 'Cập nhật tiến độ đợt kiểm tra',
    type: 'update' as const,
    description: 'Đã hoàn thành 9/15 phiên kiểm tra, cập nhật tiến độ từ 55% lên 65%',
    insForm: null,
  },
  {
    id: 'h-11',
    timestamp: '2025-01-14T10:15:00',
    user: 'Trần Thị B',
    action: 'Hoàn thành phiên kiểm tra',
    type: 'session_complete' as const,
    description: 'Đã hoàn thành phiên kiểm tra PS-009 tại Siêu thị CoopMart',
    insForm: {
      code: 'BB-KT-009',
      type: 'Mẫu 06',
      name: 'Biên bản kiểm tra',
    },
  },
  {
    id: 'h-10',
    timestamp: '2025-01-12T14:45:00',
    user: 'Nguyễn Văn A',
    action: 'Chỉnh sửa thông tin đợt kiểm tra',
    type: 'edit' as const,
    description: 'Cập nhật phạm vi kiểm tra: thêm phường Nguyễn Cư Trinh vào danh sách',
    insForm: {
      code: '01/QĐ-KT',
      type: 'Mẫu 01',
      name: 'Quyết định kiểm tra',
    },
  },
  {
    id: 'h-9',
    timestamp: '2025-01-10T09:20:00',
    user: 'Lê Văn C',
    action: 'Tạo phiên kiểm tra mới',
    type: 'session_create' as const,
    description: 'Đã tạo phiên kiểm tra PS-008 tại Cửa hàng Thực phẩm Sạch',
    insForm: null,
  },
  {
    id: 'h-8',
    timestamp: '2025-01-09T11:00:00',
    user: 'Nguyễn Văn A',
    action: 'Import biểu mẫu từ INS',
    type: 'import' as const,
    description: 'Đã import Thông báo KT-TB từ hệ thống INS',
    insForm: {
      code: '03/KT-TB',
      type: 'Mẫu 03',
      name: 'Thông báo kiểm tra',
    },
  },
  {
    id: 'h-7',
    timestamp: '2025-01-08T15:30:00',
    user: 'Phạm Thị D',
    action: 'Xóa phiên kiểm tra',
    type: 'session_delete' as const,
    description: 'Đã xóa phiên kiểm tra PS-007 do cơ sở đã ngưng hoạt động',
    insForm: null,
  },
  {
    id: 'h-6',
    timestamp: '2025-01-07T08:45:00',
    user: 'Nguyễn Văn A',
    action: 'Cập nhật nhân sự',
    type: 'team_update' as const,
    description: 'Thêm Phạm Thị D vào đội kiểm tra',
    insForm: {
      code: '05/QĐ-PC',
      type: 'Mẫu 02',
      name: 'Quyết định phân công',
    },
  },
  {
    id: 'h-5',
    timestamp: '2025-01-05T16:00:00',
    user: 'Trần Thị B',
    action: 'Hoàn thành phiên kiểm tra',
    type: 'session_complete' as const,
    description: 'Đã hoàn thành phiên kiểm tra PS-002 tại Siêu thị mini Phú Thọ - Không vi phạm',
    insForm: {
      code: 'BB-KT-002',
      type: 'Mẫu 06',
      name: 'Biên bản kiểm tra',
    },
  },
  {
    id: 'h-4',
    timestamp: '2025-01-05T13:30:00',
    user: 'Nguyễn Văn A',
    action: 'Hoàn thành phiên kiểm tra',
    type: 'session_complete' as const,
    description: 'Đã hoàn thành phiên kiểm tra PS-001 tại Cửa hàng Thực phẩm An Khang - Phát hiện 2 vi phạm',
    insForm: {
      code: 'BB-KT-001',
      type: 'Mẫu 06',
      name: 'Biên bản kiểm tra',
    },
  },
  {
    id: 'h-3',
    timestamp: '2025-01-03T10:00:00',
    user: 'Nguyễn Văn A',
    action: 'Import biểu mẫu từ INS',
    type: 'import' as const,
    description: 'Đã import Quyết định phân công từ hệ thống INS',
    insForm: {
      code: '05/QĐ-PC',
      type: 'Mẫu 02',
      name: 'Quyết định phân công',
    },
  },
  {
    id: 'h-2',
    timestamp: '2025-01-02T14:30:00',
    user: 'Nguyễn Văn A',
    action: 'Import biểu mẫu từ INS',
    type: 'import' as const,
    description: 'Đã import Quyết định kiểm tra từ hệ thống INS',
    insForm: {
      code: '01/QĐ-KT',
      type: 'Mẫu 01',
      name: 'Quyết định kiểm tra',
    },
  },
  {
    id: 'h-1',
    timestamp: '2025-01-01T09:00:00',
    user: 'Nguyễn Văn A',
    action: 'Tạo đợt kiểm tra',
    type: 'create' as const,
    description: 'Đã tạo đợt kiểm tra mới "Kiểm tra Tết Nguyên Đán 2025"',
    insForm: null,
  },
];

export default function InspectionRoundDetail() {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const { round: data, loading, error, updateStatus } = useSupabaseInspectionRound(roundId);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sessions, setSessions] = useState(mockSessions);
  const [showInsFormDetail, setShowInsFormDetail] = useState(false);
  const [selectedInsForm, setSelectedInsForm] = useState<{ code: string; type: string; name: string } | null>(null);


  const handleCreateSession = (sessionData: {
    storeId: string;
    storeName: string;
    storeAddress: string;
    inspectorId: string;
    inspectorName: string;
    startDate: string;
    endDate: string;
    notes: string;
  }) => {
    // Generate new session ID
    const newId = `PS-${String(sessions.length + 1).padStart(3, '0')}`;
    const storeCodeNum = String(sessions.length + 1).padStart(3, '0');
    
    const newSession = {
      id: newId,
      storeCode: `CH-${storeCodeNum}`,
      storeName: sessionData.storeName,
      address: sessionData.storeAddress,
      inspector: sessionData.inspectorName,
      date: sessionData.startDate,
      time: '09:00',
      status: 'scheduled' as const,
      violationCount: 0,
    };

    setSessions([...sessions, newSession]);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <RefreshCw className={styles.loadingIcon} size={40} />
          <p>Đang tải thông tin đợt kiểm tra...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>{error || 'Không tìm thấy đợt kiểm tra'}</h3>
          <button className={styles.primaryButton} onClick={() => navigate('/plans/inspection-rounds')}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const percentIncrease = data.stats 
    ? Math.round(((data.stats.storesInspected - data.stats.storesPlanned) / data.stats.storesPlanned) * 100)
    : 0;

  const handleBack = () => {
    navigate('/plans/inspection-rounds');
  };

  const handleEdit = () => {
    navigate(`/plans/inspection-rounds/create-new?mode=edit&id=${encodeURIComponent(data.id)}`);
  };

  const handleComplete = async () => {
    try {
      await updateStatus('completed');
      toast.success('Đã hoàn thành đợt kiểm tra');
    } catch (err) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleInsFormClick = (insForm: { code: string; type: string; name: string }) => {
    setSelectedInsForm(insForm);
    setShowInsFormDetail(true);
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
              <span className={styles.roundId}>{data.code}</span>
              <InspectionRoundStatusBadge type="round" value={data.status} size="sm" />
              <InspectionRoundStatusBadge type="inspectionType" value={data.type} size="sm" />
            </div>
            <h1 className={styles.pageTitle}>{data.name}</h1>
            <p className={styles.pageSubtitle}>
              Thuộc {data.planCode} - {data.planName} - {data.quarter}
            </p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.primaryButton} onClick={handleComplete}>
              <ClipboardCheck size={18} />
              Hoàn thành
            </button>
            <button className={styles.outlineButton} onClick={handleEdit}>
              <Edit size={18} />
              Sửa đợt
            </button>
            <button className={styles.outlineButton}>
              <Download size={18} />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.badge && <span className={styles.tabBadge}>{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.overviewContent}>
            {/* Summary Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#8B5CF6' }}>
                  <ClipboardCheck size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Tổng phiên kiểm tra</div>
                  <div className={styles.statValue}>{data.stats?.totalSessions || 0}</div>
                  <div className={styles.statSubtext}>
                    {data.stats?.completedSessions || 0} đã hoàn thành
                  </div>
                </div>

              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#10B981' }}>
                  <Target size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Cửa hàng đã kiểm tra</div>
                  <div className={styles.statValue}>{data.stats?.storesInspected || 0}</div>
                  <div className={`${styles.statSubtext} ${styles.statPositive}`}>
                    +{percentIncrease}% so vi dự kiến
                  </div>
                </div>

              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#F59E0B' }}>
                  <AlertCircle size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Vi phạm phát hiện</div>
                  <div className={`${styles.statValue} ${styles.statDanger}`}>
                    {data.stats?.violationsFound || 0}
                  </div>
                  <div className={styles.statSubtext}>
                    {data.stats?.violationRate || 0}% tỷ lệ phát hiện
                  </div>
                </div>

              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#005cb6' }}>
                  <TrendingUp size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Tiến độ</div>
                  <div className={styles.statValue}>{data.stats?.progress || 0}%</div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${data.stats?.progress || 0}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Basic Info */}
            <div className={styles.infoContent}>
              <h2 className={styles.sectionTitle}>Thông tin cơ bản</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Mã đợt kiểm tra</div>
                  <div className={styles.infoValue}>
                    <FileText size={16} className={styles.infoIcon} />
                    {data.code}
                  </div>
                </div>

                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Loại kiểm tra</div>
                  <div className={styles.infoValue}>
                    <ClipboardCheck size={16} className={styles.infoIcon} />
                    <InspectionRoundStatusBadge type="inspectionType" value={data.type} size="sm" />
                  </div>
                </div>

                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Thời gian triển khai</div>
                  <div className={styles.infoValue}>
                    <Calendar size={16} className={styles.infoIcon} />
                    {new Date(data.startDate).toLocaleDateString('vi-VN')} -{' '}
                    {new Date(data.endDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>

                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Đơn vị chủ trì</div>
                  <div className={styles.infoValue}>
                    <Users size={16} className={styles.infoIcon} />
                    {data.leadUnit}
                  </div>
                </div>

                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Phạm vi</div>
                  <div className={styles.infoValue}>
                    <MapPin size={16} className={styles.infoIcon} />
                    {data.scope || 'Chưa xác định'}
                  </div>
                </div>

                <div className={styles.infoField}>
                  <div className={styles.infoLabel}>Đội trưởng</div>
                  <div className={styles.infoValue}>
                    <Users size={16} className={styles.infoIcon} />
                    {data.teamLeader || 'Chưa xác định'}
                  </div>
                </div>

                <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                  <div className={styles.infoLabel}>Biểu mẫu kiểm tra</div>
                  <div className={styles.infoValue}>
                    <FileText size={16} className={styles.infoIcon} />
                    {data.formTemplate}
                  </div>
                </div>

                <div className={`${styles.infoField} ${styles.infoFieldFull}`}>
                  <div className={styles.infoLabel}>Ghi chú</div>
                  <div className={styles.infoValue}>{data.notes}</div>
                </div>
              </div>
            </div>

            {/* Biểu mẫu từ INS */}
            <div className={styles.infoContent}>
              <h2 className={styles.sectionTitle}>Biểu mẫu từ INS</h2>
              <div className={styles.decisionsGrid}>
                <div className={styles.decisionCard}>
                  <div className={styles.decisionHeader}>
                    <FileText size={20} className={styles.decisionIcon} style={{ color: '#005cb6' }} />
                    <div>
                      <div className={styles.decisionLabel}>Quyết định kiểm tra</div>
                      <div className={styles.decisionCode}>01/QĐ-KT</div>
                      <div className={styles.decisionTitle}>QĐ kiểm tra việc chấp hành pháp luật trong sản xuất Q1/2026</div>
                    </div>
                  </div>
                </div>
                <div className={styles.decisionCard}>
                  <div className={styles.decisionHeader}>
                    <Users size={20} className={styles.decisionIcon} style={{ color: '#10B981' }} />
                    <div>
                      <div className={styles.decisionLabel}>Quyết định phân công</div>
                      <div className={styles.decisionCode}>05/QĐ-PC</div>
                      <div className={styles.decisionTitle}>QĐ phân công công chức thực hiện biện pháp nghiệp vụ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.infoContent}>
              <h2 className={styles.sectionTitle}>Thao tác nhanh</h2>
              <div className={styles.actionButtons}>
                <button className={styles.actionButton} onClick={() => setShowCreateDialog(true)}>
                  <Plus size={20} />
                  <div>
                    <div className={styles.actionButtonTitle}>Tạo phiên kiểm tra</div>
                    <div className={styles.actionButtonDesc}>Lập phiên kiểm tra mới</div>
                  </div>
                </button>
                <button className={styles.actionButton}>
                  <Users size={20} />
                  <div>
                    <div className={styles.actionButtonTitle}>Phân công nhân sự</div>
                    <div className={styles.actionButtonDesc}>Bổ nhiệm đội ngũ</div>
                  </div>
                </button>
                <button className={styles.actionButton} onClick={() => navigate(`/plans/inspection-rounds/${encodeURIComponent(data.id)}/statistics`)}>
                  <BarChart3 size={20} />
                  <div>
                    <div className={styles.actionButtonTitle}>Theo dõi tiến độ</div>
                    <div className={styles.actionButtonDesc}>Xem báo cáo chi tiết</div>
                  </div>
                </button>
                <button className={styles.actionButton}>
                  <Download size={20} />
                  <div>
                    <div className={styles.actionButtonTitle}>Xuất báo cáo</div>
                    <div className={styles.actionButtonDesc}>Tải file PDF/Excel</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className={styles.sessionsContent}>
            {/* Header with Create Button */}
            <div className={styles.sessionsHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Danh sách phiên kiểm tra</h2>
                <p className={styles.sectionDesc}>
                  Tổng {sessions.length} phiên - {sessions.filter(s => s.status === 'completed').length} đã hoàn thành
                </p>
              </div>
              <button className={styles.primaryButton} onClick={() => setShowCreateDialog(true)}>
                <Plus size={18} />
                Tạo phiên mới
              </button>
            </div>

            {/* Sessions Table */}
            <div className={styles.sessionsTable}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>STT</th>
                    <th style={{ width: '100px' }}>Mã phiên</th>
                    <th>Cửa hàng</th>
                    <th>Địa chỉ</th>
                    <th style={{ width: '140px' }}>Thanh tra viên</th>
                    <th style={{ width: '160px' }}>Ngày giờ</th>
                    <th style={{ width: '120px' }}>Trạng thái</th>
                    <th style={{ width: '100px' }}>Vi phạm</th>
                    <th style={{ width: '100px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, index) => (

                    <tr key={session.id}>
                      <td className={styles.textCenter}>{index + 1}</td>
                      <td>
                        <span className={styles.sessionCode}>{session.id}</span>
                      </td>
                      <td>
                        <div className={styles.storeInfo}>
                          <div className={styles.storeName}>{session.storeName}</div>
                          <div className={styles.storeCode}>{session.storeCode}</div>
                        </div>
                      </td>
                      <td className={styles.addressCell}>{session.address}</td>
                      <td>{session.inspector}</td>
                      <td>
                        <div className={styles.dateTimeCell}>
                          <div className={styles.dateText}>
                            {new Date(session.date).toLocaleDateString('vi-VN')}
                          </div>
                          <div className={styles.timeText}>{session.time}</div>
                        </div>
                      </td>
                      <td>
                        <InspectionRoundStatusBadge type="round" value={session.status as any} size="sm" />
                      </td>
                      <td className={styles.textCenter}>
                        {session.violationCount > 0 ? (
                          <span className={styles.violationBadge}>
                            {session.violationCount}
                          </span>
                        ) : (
                          <span className={styles.noViolation}>0</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionCell}>
                          <button className={styles.iconButton} title="Xem chi tiết">
                            <Eye size={16} />
                          </button>
                          <button className={styles.iconButton} title="Sửa">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Pagination */}
            <div className={styles.tableFooter}>
              <div className={styles.footerInfo}>
                Hiển thị <strong>1-{sessions.length}</strong> trong tổng số <strong>{sessions.length}</strong> phiên
              </div>
              <div className={styles.pagination}>
                <button className={styles.paginationButton} disabled>
                  Trước
                </button>
                <button className={`${styles.paginationButton} ${styles.paginationActive}`}>
                  1
                </button>
                <button className={styles.paginationButton} disabled>
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className={styles.teamContent}>
            {/* Header with Assign Button */}
            <div className={styles.teamHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Nhân sự tham gia</h2>
              </div>
              <button className={styles.primaryButton}>
                <Users size={18} />
                Phân công
              </button>
            </div>

            {/* Team Members List */}
            <div className={styles.teamList}>
              {mockTeamMembers.map((member) => (
                <div key={member.id} className={styles.teamMember}>
                  <div
                    className={styles.memberAvatar}
                    style={{
                      background: member.role === 'leader' ? '#8B5CF6' : '#E5E7EB',
                      color: member.role === 'leader' ? 'white' : '#6B7280',
                    }}
                  >
                    {member.avatar}
                  </div>
                  <div className={styles.memberInfo}>
                    <div className={styles.memberName}>{member.name}</div>
                    <div className={styles.memberPosition}>{member.position}</div>
                  </div>
                  {member.role === 'leader' && (
                    <span className={styles.leaderBadge}>Đội trưởng</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scope' && (
          <div className={styles.scopeContent}>
            <h2 className={styles.sectionTitle}>Phạm vi kiểm tra</h2>
            
            <div className={styles.scopeHeader}>
              <p className={styles.scopeDesc}>
                Danh sách phường/xã ({data.scopeDetails?.wards?.length || 0})
              </p>
            </div>

            <div className={styles.wardsList}>
              {data.scopeDetails?.wards?.map((ward: string, index: number) => (
                <div key={index} className={styles.wardItem}>
                  <MapPin size={20} className={styles.wardIcon} />
                  <span className={styles.wardName}>{ward}</span>
                </div>
              ))}
              {(!data.scopeDetails?.wards || data.scopeDetails.wards.length === 0) && (
                <p className={styles.emptyText}>Chưa xác định phạm vi kiểm tra</p>
              )}
            </div>

          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Lịch sử cập nhật</h2>
            
            <div className={styles.historyList}>
              {mockHistory.map((historyItem) => (
                <div key={historyItem.id} className={styles.historyItem}>
                  <div className={styles.historyIcon}>
                    {historyItem.type === 'create' && <Plus size={20} />}
                    {historyItem.type === 'update' && <RefreshCw size={20} />}
                    {historyItem.type === 'edit' && <Edit size={20} />}
                    {historyItem.type === 'import' && <Upload size={20} />}
                    {historyItem.type === 'session_create' && <Plus size={20} />}
                    {historyItem.type === 'session_complete' && <CheckCircle size={20} />}
                    {historyItem.type === 'session_delete' && <Trash2 size={20} />}
                    {historyItem.type === 'team_update' && <Users size={20} />}
                  </div>
                  <div className={styles.historyInfo}>
                    <div className={styles.historyDate}>
                      {new Date(historyItem.timestamp).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className={styles.historyAction}>
                      <strong>{historyItem.user}</strong> - {historyItem.action}
                    </div>
                    <div className={styles.historyDescription}>{historyItem.description}</div>
                    {historyItem.insForm && (
                      <div className={styles.historyInsForm} onClick={() => handleInsFormClick(historyItem.insForm)}>
                        <FileText size={16} className={styles.historyInsFormIcon} />
                        <span>
                          <strong>{historyItem.insForm.type}</strong> - {historyItem.insForm.name} ({historyItem.insForm.code})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Session Dialog */}
      <CreateSessionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        roundId={data.id}
        roundName={data.name}
        onCreateSession={handleCreateSession}
      />

      {/* InsForm Detail Dialog */}
      <InsFormDetailDialog
        isOpen={showInsFormDetail}
        onClose={() => setShowInsFormDetail(false)}
        formData={selectedInsForm ? {
          type: selectedInsForm.type.includes('01') ? 'decision' : 
                selectedInsForm.type.includes('02') ? 'assignment' : 
                selectedInsForm.type.includes('03') ? 'notification' : 
                selectedInsForm.type.includes('06') ? 'inspection' : 
                'violation',
          code: selectedInsForm.code,
          title: selectedInsForm.name,
          issueDate: '15/01/2026',
          issuer: {
            name: 'Nguyễn Văn Long',
            position: 'Chi cục trưởng',
            unit: 'Chi cục Quản lý thị trường Quận 1',
          },
          content: {},
        } : null}
      />
    </div>
  );
}