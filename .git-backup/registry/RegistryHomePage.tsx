import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  FileSearch, 
  CheckCircle2, 
  Upload,
  History,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../../layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import styles from './RegistryHomePage.module.css';

export default function RegistryHomePage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Quản lý cơ sở',
      description: 'Tra cứu, chỉnh sửa và quản lý thông tin cơ sở',
      icon: Building2,
      variant: 'primary' as const,
      path: '/registry/stores',
    },
    {
      title: 'Nhập dữ liệu',
      description: 'Import dữ liệu cơ sở từ file Excel/CSV',
      icon: Upload,
      variant: 'secondary' as const,
      path: '/registry/import',
    },
    {
      title: 'Xác minh hồ sơ',
      description: 'Xem và xử lý hàng đợi xác minh',
      icon: FileSearch,
      variant: 'secondary' as const,
      path: '/registry/verification',
    },
    {
      title: 'Phê duyệt',
      description: 'Duyệt các yêu cầu chờ xử lý',
      icon: CheckCircle2,
      variant: 'secondary' as const,
      path: '/registry/approvals',
    },
  ];

  const workflows = [
    {
      title: 'Loại bỏ trùng lặp',
      description: 'Tìm và hợp nhất các bản ghi trùng lặp',
      icon: Users,
      path: '/registry/dedup',
      badge: '3 pending',
    },
    {
      title: 'Nhật ký kiểm toán',
      description: 'Xem lịch sử thay đổi và hoạt động',
      icon: History,
      path: '/registry/audit',
    },
  ];

  const stats = [
    {
      label: 'Tổng số cơ sở',
      value: '2,847',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Chờ xác minh',
      value: '45',
      trend: '-8%',
      trendUp: false,
    },
    {
      label: 'Chờ phê duyệt',
      value: '12',
      trend: '+3',
      trendUp: true,
    },
    {
      label: 'Trùng lặp phát hiện',
      value: '3',
      trend: 'New',
      trendUp: false,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Hệ thống đăng ký' },
        ]}
        title="Hệ thống đăng ký cơ sở"
        description="Quản lý thông tin cơ sở kinh doanh và quy trình xác minh"
      />

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className={styles.statCard}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={`${styles.statTrend} ${stat.trendUp ? styles.trendUp : styles.trendDown}`}>
                {stat.trendUp ? <TrendingUp size={14} /> : <AlertCircle size={14} />}
                <span>{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Thao tác nhanh</h2>
        <div className={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <Card key={index} className={styles.actionCard}>
              <CardHeader className={styles.actionHeader}>
                <div className={styles.actionIcon}>
                  <action.icon size={24} />
                </div>
                <CardTitle className={styles.actionTitle}>{action.title}</CardTitle>
              </CardHeader>
              <CardContent className={styles.actionContent}>
                <p className={styles.actionDescription}>{action.description}</p>
                <Button
                  variant={action.variant === 'primary' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => navigate(action.path)}
                  className={styles.actionButton}
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflows */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quy trình làm việc</h2>
        <div className={styles.workflowsGrid}>
          {workflows.map((workflow, index) => (
            <Card key={index} className={styles.workflowCard}>
              <CardContent className={styles.workflowContent}>
                <div className={styles.workflowIcon}>
                  <workflow.icon size={20} />
                </div>
                <div className={styles.workflowInfo}>
                  <div className={styles.workflowTitle}>
                    {workflow.title}
                    {workflow.badge && (
                      <span className={styles.workflowBadge}>{workflow.badge}</span>
                    )}
                  </div>
                  <div className={styles.workflowDescription}>{workflow.description}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(workflow.path)}
                >
                  Mở
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
