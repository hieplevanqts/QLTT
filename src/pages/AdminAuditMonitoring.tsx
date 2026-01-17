/**
 * Admin Audit & Monitoring Module - MAPPA Portal
 * Module Quản trị - Audit và Giám sát
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState } from 'react';
import {
  FileText,
  GitCompare,
  Download,
  Shield,
  Activity,
  Server,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import styles from './AdminAuditMonitoring.module.css';

// Import các tabs
import { AuditLogTab } from './AuditLogTab';
import { DataChangesTab } from './DataChangesTab';
import { ExportCenterTab } from './ExportCenterTab';
import { ExportLogTab } from './ExportLogTab';
import { SecurityConfigTab } from './SecurityConfigTab';
import { IntegrationStatusTab } from './IntegrationStatusTab';
import { SystemMonitorTab } from './SystemMonitorTab';
import { SystemHealthTab } from './SystemHealthTab';

// ============================================
// TYPES
// ============================================

type TabKey =
  | 'system-health'
  | 'system-monitor'
  | 'audit-log'
  | 'data-changes'
  | 'export-center'
  | 'export-log'
  | 'security-config'
  | 'integration-status';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  description?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const AdminAuditMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('system-health');

  // ============================================
  // TAB CONFIGURATION
  // ============================================

  const tabs: TabConfig[] = [
    {
      key: 'system-health',
      label: 'Trạng thái hệ thống',
      icon: <TrendingUp size={16} />,
      component: <SystemHealthTab />,
      description: 'Dashboard tổng quan về tình trạng hệ thống',
    },
    {
      key: 'system-monitor',
      label: 'Giám sát hệ thống',
      icon: <Server size={16} />,
      component: <SystemMonitorTab />,
      description: 'Theo dõi job monitoring real-time',
    },
    {
      key: 'audit-log',
      label: 'Nhật ký hệ thống',
      icon: <FileText size={16} />,
      component: <AuditLogTab />,
      description: 'Audit events và system logs',
    },
    {
      key: 'data-changes',
      label: 'Biến động dữ liệu',
      icon: <GitCompare size={16} />,
      component: <DataChangesTab />,
      description: 'Theo dõi thay đổi dữ liệu',
    },
    {
      key: 'export-center',
      label: 'Trung tâm xuất dữ liệu',
      icon: <BarChart3 size={16} />,
      component: <ExportCenterTab />,
      description: 'Quản lý export jobs',
    },
    {
      key: 'export-log',
      label: 'Nhật ký tải / xuất',
      icon: <Download size={16} />,
      component: <ExportLogTab />,
      description: 'Lịch sử tải và xuất file',
    },
    {
      key: 'security-config',
      label: 'Cấu hình bảo mật',
      icon: <Shield size={16} />,
      component: <SecurityConfigTab />,
      description: 'Cài đặt và chính sách bảo mật',
    },
    {
      key: 'integration-status',
      label: 'Trạng thái tích hợp',
      icon: <Activity size={16} />,
      component: <IntegrationStatusTab />,
      description: 'Service health monitoring',
    },
  ];

  const activeTabConfig = tabs.find((t) => t.key === activeTab);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Audit & Monitoring</h1>
          <p className={styles.subtitle}>Quản trị hệ thống, giám sát và báo cáo</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <div className={styles.tabList}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={activeTab === tab.key ? styles.tabButtonActive : styles.tabButton}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Description */}
      {activeTabConfig?.description && (
        <div className={styles.tabDescription}>
          <p>{activeTabConfig.description}</p>
        </div>
      )}

      {/* Tab Content */}
      <div className={styles.tabContent}>{activeTabConfig?.component}</div>
    </div>
  );
};

export default AdminAuditMonitoring;
