import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/layouts/PageHeader';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Building2,
  Info,
  ShieldAlert,
  RefreshCw,
  Users,
  Target,
  Shield,
  MapPin,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type ViewState = 'normal' | 'loading' | 'empty' | 'error' | 'no-permission';
type UserRole = 'leader' | 'manager' | 'field-team';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<ViewState>('normal');
  const [userRole, setUserRole] = useState<UserRole>('leader');

  // Get role display info
  const getRoleInfo = () => {
    switch (userRole) {
      case 'leader':
        return {
          scope: 'Toàn tỉnh',
          icon: Building2,
          description: 'Phạm vi: Toàn bộ hoạt động',
        };
      case 'manager':
        return {
          scope: 'Đơn vị / Khu vực',
          icon: Users,
          description: 'Phạm vi: Phường 1, 3, 5',
        };
      case 'field-team':
        return {
          scope: 'Đội 01 - Phường 1',
          icon: Target,
          description: 'Phạm vi: Nhiệm vụ của đội',
        };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  // Mock data for charts
  const trendData = [
    { month: 'T1', nguonTin: 45, nhiemVu: 32 },
    { month: 'T2', nguonTin: 52, nhiemVu: 38 },
    { month: 'T3', nguonTin: 48, nhiemVu: 41 },
    { month: 'T4', nguonTin: 61, nhiemVu: 45 },
    { month: 'T5', nguonTin: 55, nhiemVu: 39 },
    { month: 'T6', nguonTin: 67, nhiemVu: 52 },
  ];

  const hotspotData = [
    { name: 'Phường 1', value: 234, status: 'high' },
    { name: 'Phường 3', value: 189, status: 'medium' },
    { name: 'Phường 5', value: 156, status: 'medium' },
    { name: 'Phường 7', value: 145, status: 'low' },
    { name: 'Phường 10', value: 98, status: 'low' },
  ];

  const dataQualityMetrics = [
    { label: 'Dữ liệu đầy đủ', value: 87, color: '#10b981', target: 90 },
    { label: 'Đã xác minh', value: 72, color: '#3b82f6', target: 80 },
    { label: 'Thiếu thông tin', value: 13, color: '#ef4444', target: 10 },
  ];

  // KPI Cards data
  const kpiCards = [
    {
      id: 1,
      title: 'Tổng nguồn thông tin',
      value: '2,458',
      change: '+12.5%',
      trend: 'up' as const,
      icon: FileText,
      status: 'normal',
      description: 'Nguồn tin và hồ sơ',
      reportType: 'risk-sources',
      filterParams: {
        category: 'all',
        status: 'all',
        period: 'current',
      },
    },
    {
      id: 2,
      title: 'Kế hoạch đang triển khai',
      value: '24',
      change: '+3',
      trend: 'up' as const,
      icon: ArrowRight,
      status: 'normal',
      description: 'Kế hoạch / đợt kiểm tra',
      reportType: 'plans-tasks',
      filterParams: {
        status: 'active',
      },
    },
    {
      id: 3,
      title: 'Nhiệm vụ trễ hạn',
      value: '18',
      change: '-5',
      trend: 'down' as const,
      icon: AlertTriangle,
      status: 'warning',
      description: 'Cần xử lý ngay',
      reportType: 'field-tasks',
      filterParams: {
        status: 'overdue',
        sortBy: 'overdue-first',
      },
    },
    {
      id: 4,
      title: 'Minh chứng chờ xử lý',
      value: '156',
      change: '+28',
      trend: 'up' as const,
      icon: Shield,
      status: 'warning',
      description: 'Đang Chờ duyệt',
      reportType: 'evidence',
      filterParams: {
        status: 'pending',
      },
    },
  ];

  // Handle KPI click - navigate to Reports with filters
  const handleKPIClick = (kpi: typeof kpiCards[0]) => {
    navigate('/reports', {
      state: {
        reportType: kpi.reportType,
        filters: kpi.filterParams,
        fromDashboard: true,
        kpiTitle: kpi.title,
      },
    });
  };

  // Handle hotspot click - navigate to Reports filtered by region
  const handleHotspotClick = (region: string) => {
    navigate('/reports', {
      state: {
        reportType: 'risk-sources',
        filters: {
          region,
          period: 'current',
        },
        fromDashboard: true,
        kpiTitle: `Nguồn tin tại ${region}`,
      },
    });
  };

  // Render different states
  if (viewState === 'loading') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Báo cáo & KPI', href: '/reports' },
            { label: 'Dashboard' },
          ]}
          title="Dashboard"
          subtitle="Theo dõi tình hình hoạt động và các chỉ số quan trọng"
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            gap: 'var(--spacing-4, 16px)',
          }}
        >
          <RefreshCw
            size={48}
            style={{ color: 'var(--primary, #005cb6)', animation: 'spin 1s linear infinite' }}
          />
          <div
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: 'var(--foreground, #111827)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Đang tải dữ liệu...
          </div>
        </div>
      </div>
    );
  }

  if (viewState === 'empty') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Báo cáo & KPI', href: '/reports' },
            { label: 'Dashboard' },
          ]}
          title="Dashboard"
          subtitle="Theo dõi tình hình hoạt động và các chỉ số quan trọng"
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            gap: 'var(--spacing-4, 16px)',
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: 'var(--radius, 6px)',
            padding: 'var(--spacing-8, 32px)',
          }}
        >
          <Info size={64} style={{ color: 'var(--muted-foreground, #9ca3af)', opacity: 0.5 }} />
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--foreground, #111827)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Chưa có dữ liệu
          </div>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--muted-foreground, #6b7280)',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              maxWidth: '400px',
            }}
          >
            Dashboard sẽ hiển th số liệu khi hệ thống bắt đầu thu thập dữ liệu từ các nguồn.
          </div>
        </div>
      </div>
    );
  }

  if (viewState === 'error') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Báo cáo & KPI', href: '/reports' },
            { label: 'Dashboard' },
          ]}
          title="Dashboard"
          subtitle="Theo dõi tình hình hoạt động và các chỉ số quan trọng"
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            gap: 'var(--spacing-4, 16px)',
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: 'var(--radius, 6px)',
            padding: 'var(--spacing-8, 32px)',
          }}
        >
          <AlertCircle size={64} style={{ color: '#ef4444' }} />
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--foreground, #111827)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Không thể tải dữ liệu
          </div>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--muted-foreground, #6b7280)',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              maxWidth: '400px',
            }}
          >
            Đã xảy ra lỗi khi tải dữ liệu Dashboard. Vui lòng thử lại sau hoặc liên hệ quản trị viên.
          </div>
          <button
            style={{
              marginTop: 'var(--spacing-4, 16px)',
              padding: 'var(--spacing-3, 12px) var(--spacing-5, 20px)',
              background: 'var(--primary, #005cb6)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius, 6px)',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2, 8px)',
            }}
            onClick={() => setViewState('normal')}
          >
            <RefreshCw size={16} />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (viewState === 'no-permission') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Báo cáo & KPI', href: '/reports' },
            { label: 'Dashboard' },
          ]}
          title="Dashboard"
          subtitle="Theo dõi tình hình hoạt động và các chỉ số quan trọng"
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            gap: 'var(--spacing-4, 16px)',
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: 'var(--radius, 6px)',
            padding: 'var(--spacing-8, 32px)',
          }}
        >
          <ShieldAlert size={64} style={{ color: '#f59e0b' }} />
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--foreground, #111827)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Không có quyền truy cập
          </div>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--muted-foreground, #6b7280)',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              maxWidth: '400px',
            }}
          >
            Bạn không có quyền xem Dashboard. Vui lòng liên hệ quản trị viên để được cấp quyền.
          </div>
        </div>
      </div>
    );
  }

  // Normal state - Full dashboard
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      {/* Page Header - NO PADDING */}
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Báo cáo & KPI', href: '/reports' },
          { label: 'Dashboard' },
        ]}
        title="Dashboard"
        subtitle="Theo dõi tình hình hoạt động và các chỉ số quan trọng"
        actions={
          <div style={{ display: 'flex', gap: 'var(--spacing-2, 8px)', flexWrap: 'wrap' }}>
            {/* Role switcher (for demo) */}
            <button
              style={{
                padding: '6px 12px',
                background: userRole === 'leader' ? 'var(--primary, #005cb6)' : 'var(--card, #ffffff)',
                color: userRole === 'leader' ? '#ffffff' : 'var(--muted-foreground, #6b7280)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
              onClick={() => setUserRole('leader')}
            >
              Lãnh đạo
            </button>
            <button
              style={{
                padding: '6px 12px',
                background: userRole === 'manager' ? 'var(--primary, #005cb6)' : 'var(--card, #ffffff)',
                color: userRole === 'manager' ? '#ffffff' : 'var(--muted-foreground, #6b7280)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
              onClick={() => setUserRole('manager')}
            >
              Quản lý
            </button>
            <button
              style={{
                padding: '6px 12px',
                background: userRole === 'field-team' ? 'var(--primary, #005cb6)' : 'var(--card, #ffffff)',
                color: userRole === 'field-team' ? '#ffffff' : 'var(--muted-foreground, #6b7280)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
              onClick={() => setUserRole('field-team')}
            >
              Đội tác nghiệp
            </button>
            <div style={{ width: '1px', background: 'var(--border, #e5e7eb)', margin: '0 4px' }} />
            <button
              style={{
                padding: '6px 12px',
                background: 'var(--card, #ffffff)',
                color: 'var(--muted-foreground, #6b7280)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
              onClick={() => setViewState('loading')}
            >
              Loading
            </button>
            <button
              style={{
                padding: '6px 12px',
                background: 'var(--card, #ffffff)',
                color: 'var(--muted-foreground, #6b7280)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
              onClick={() => setViewState('empty')}
            >
              Empty
            </button>
            <button
              style={{
                padding: '6px 12px',
                background: 'var(--card, #ffffff)',
                color: 'var(--muted-foreground, #6b7280)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
              onClick={() => setViewState('error')}
            >
              Error
            </button>
            <button
              style={{
                padding: '6px 12px',
                background: 'var(--card, #ffffff)',
                color: 'var(--muted-foreground, #6b7280)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
              onClick={() => setViewState('no-permission')}
            >
              No Permission
            </button>
          </div>
        }
      />

      {/* Content with padding */}
      <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Scope Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-2, 8px)',
            padding: 'var(--spacing-3, 12px) var(--spacing-4, 16px)',
            background: 'rgba(0, 92, 182, 0.1)',
            border: '1px solid rgba(0, 92, 182, 0.2)',
            borderRadius: 'var(--radius, 6px)',
            alignSelf: 'flex-start',
          }}
        >
          <RoleIcon size={16} style={{ color: 'var(--primary, #005cb6)' }} />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--primary, #005cb6)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {roleInfo.scope}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--muted-foreground, #6b7280)',
              fontFamily: 'Inter, sans-serif',
              borderLeft: '1px solid rgba(0, 92, 182, 0.2)',
              paddingLeft: 'var(--spacing-2, 8px)',
            }}
          >
            {roleInfo.description}
          </span>
        </div>
        
        {/* ==================== KHỐI A - KPI TỔNG QUAN ==================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-4, 16px)',
          }}
        >
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
            const statusColor =
              kpi.status === 'warning'
                ? '#f59e0b'
                : kpi.status === 'danger'
                ? '#ef4444'
                : 'var(--primary, #005cb6)';

            return (
              <div
                key={kpi.id}
                style={{
                  background: 'var(--card, #ffffff)',
                  border: '1px solid var(--border, #e5e7eb)',
                  borderRadius: 'var(--radius, 6px)',
                  padding: 'var(--spacing-5, 20px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-3, 12px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => handleKPIClick(kpi)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--muted-foreground, #6b7280)',
                        marginBottom: 'var(--spacing-2, 8px)',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {kpi.title}
                    </div>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        color: kpi.status === 'warning' ? '#f59e0b' : 'var(--foreground, #111827)',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1,
                      }}
                    >
                      {kpi.value}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--muted-foreground, #9ca3af)',
                        marginTop: 'var(--spacing-1, 4px)',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {kpi.description}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                      background: `${statusColor}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} style={{ color: statusColor }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 4px)' }}>
                  <TrendIcon
                    size={14}
                    style={{ color: kpi.trend === 'up' ? '#10b981' : '#ef4444' }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: kpi.trend === 'up' ? '#10b981' : '#ef4444',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {kpi.change}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--muted-foreground, #6b7280)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    so với tháng trước
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================== KHỐI B - BIỂU ĐỒ & ĐIỀU HÀNH ==================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: 'var(--spacing-4, 16px)',
          }}
        >
          {/* Biểu đồ xu hướng */}
          <div
            style={{
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #e5e7eb)',
              borderRadius: 'var(--radius, 6px)',
              padding: 'var(--spacing-5, 20px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-4, 16px)',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--foreground, #111827)',
                    margin: 0,
                    marginBottom: '4px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Xu hướng hoạt động
                </h3>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--muted-foreground, #6b7280)',
                    margin: 0,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Biến động nguồn tin và nhiệm vụ theo tháng
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fill: '#6b7280' }}
                  stroke="#9ca3af"
                />
                <YAxis
                  tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fill: '#6b7280' }}
                  stroke="#9ca3af"
                />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="nguonTin"
                  stroke="#005cb6"
                  strokeWidth={2}
                  name="Nguồn tin"
                  dot={{ fill: '#005cb6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="nhiemVu"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Nhiệm vụ"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Điểm nóng theo khu vực */}
          <div
            style={{
              background: 'var(--card, #ffffff)',
              border: '1px solid var(--border, #e5e7eb)',
              borderRadius: 'var(--radius, 6px)',
              padding: 'var(--spacing-5, 20px)',
            }}
          >
            <div style={{ marginBottom: 'var(--spacing-4, 16px)' }}>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--foreground, #111827)',
                  margin: 0,
                  marginBottom: '4px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Điểm nóng theo khu vực
              </h3>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--muted-foreground, #6b7280)',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Top 5 khu vực có nhiều nguồn tin nhất
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3, 12px)' }}>
              {hotspotData.map((item, index) => {
                const statusColor =
                  item.status === 'high' ? '#ef4444' : item.status === 'medium' ? '#f59e0b' : '#10b981';

                return (
                  <div
                    key={index}
                    style={{
                      padding: 'var(--spacing-4, 16px)',
                      background: 'var(--muted, #f9fafb)',
                      borderRadius: 'var(--radius, 6px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-3, 12px)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--card, #ffffff)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--muted, #f9fafb)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => handleHotspotClick(item.name)}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: `${statusColor}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: statusColor,
                        fontFamily: 'Inter, sans-serif',
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <MapPin size={18} style={{ color: statusColor, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: 'var(--foreground, #111827)',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--muted-foreground, #9ca3af)',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        Nguồn tin
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: statusColor,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================== KHỐI C - CHẤT LƯỢNG DỮ LIỆU ==================== */}
        <div
          style={{
            background: 'var(--card, #ffffff)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: 'var(--radius, 6px)',
            padding: 'var(--spacing-5, 20px)',
          }}
        >
          <div style={{ marginBottom: 'var(--spacing-5, 20px)' }}>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--foreground, #111827)',
                margin: 0,
                marginBottom: '4px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Chất lượng dữ liệu
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--muted-foreground, #6b7280)',
                margin: 0,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Đánh giá độ tin cậy và đầy đủ của dữ liệu trong hệ thống
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--spacing-5, 20px)',
            }}
          >
            {dataQualityMetrics.map((metric, index) => {
              const isGood =
                metric.label === 'Thiếu thông tin'
                  ? metric.value <= metric.target
                  : metric.value >= metric.target;
              const statusColor = isGood ? '#10b981' : metric.value >= metric.target - 10 ? '#f59e0b' : '#ef4444';

              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3, 12px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: 'var(--foreground, #111827)',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {metric.label}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--muted-foreground, #9ca3af)',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        Mục tiêu: {metric.target}%
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 8px)' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 700,
                          color: statusColor,
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {metric.value}%
                      </div>
                      {isGood ? (
                        <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                      ) : (
                        <AlertCircle size={20} style={{ color: statusColor }} />
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '12px',
                      background: 'var(--muted, #f3f4f6)',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: `${metric.value}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}dd 100%)`,
                        borderRadius: '6px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                    {/* Target indicator */}
                    <div
                      style={{
                        position: 'absolute',
                        left: `${metric.target}%`,
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        background: '#111827',
                        opacity: 0.3,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
