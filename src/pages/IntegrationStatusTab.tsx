/**
 * Integration Status Tab - MAPPA Portal
 * Trạng thái tích hợp - Grid card dashboard với modal chi tiết
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  RefreshCw,
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Database,
  Globe,
  Server,
  Cloud,
  Mail,
  Calendar,
  Loader2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import styles from './IntegrationStatusTab.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// ============================================
// TYPES
// ============================================

type ServiceStatus = 'healthy' | 'warning' | 'error';

interface IntegrationService {
  service_id: string;
  service_name: string;
  service_type: string;
  service_status: ServiceStatus;
  service_last_sync: string;
  service_uptime_percent?: number;
  service_response_time_ms?: number;
  service_request_count_24h?: number;
  service_error_count_24h?: number;
  service_last_error?: string;
  service_last_error_time?: string;
  service_endpoint?: string;
}

interface ErrorLog {
  error_id: string;
  error_timestamp: string;
  error_message: string;
  error_code?: string;
  error_stack?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const IntegrationStatusTab: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<IntegrationService[]>([]);
  const [selectedService, setSelectedService] = useState<IntegrationService | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchServices = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('integration_services')
        .select('*, id:_id')
        .order('service_name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching services:', error);
        toast.error(`Lỗi tải dữ liệu: ${error.message}`);
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Lỗi kết nối cơ sở dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchErrorLogs = async (serviceId: string) => {
    try {

      const { data, error } = await supabase
        .from('integration_error_logs')
        .select('*, id:_id')
        .eq('service_id', serviceId)
        .order('error_timestamp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Error fetching error logs:', error);
        return;
      }

      setErrorLogs(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchServices();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleCardClick = (service: IntegrationService) => {
    setSelectedService(service);
    setModalOpen(true);
    fetchErrorLogs(service.service_id);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setSelectedService(null);
      setErrorLogs([]);
    }, 300);
  };

  const handleRefresh = () => {
    toast.info('Đang làm mới dữ liệu...');
    fetchServices();
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.success(autoRefresh ? 'Đã tắt auto-refresh' : 'Đã bật auto-refresh (10s)');
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTimeSince = (timestamp: string): string => {
    const now = new Date().getTime();
    const then = new Date(timestamp).getTime();
    const diffMs = now - then;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getStatusConfig = (status: ServiceStatus) => {
    const configs = {
      healthy: {
        bg: '#d4edda',
        color: '#155724',
        label: 'HEALTHY',
        icon: <CheckCircle size={24} />,
        cardBg: 'rgba(212, 237, 218, 0.15)',
        borderColor: '#15803d',
      },
      warning: {
        bg: '#fff3cd',
        color: '#856404',
        label: 'WARNING',
        icon: <AlertTriangle size={24} />,
        cardBg: 'rgba(255, 243, 205, 0.15)',
        borderColor: '#f59e0b',
      },
      error: {
        bg: '#f8d7da',
        color: '#721c24',
        label: 'ERROR',
        icon: <XCircle size={24} />,
        cardBg: 'rgba(248, 215, 218, 0.15)',
        borderColor: '#dc2626',
      },
    };
    return configs[status];
  };

  const getServiceIcon = (serviceType: string) => {
    const lower = serviceType.toLowerCase();
    if (lower.includes('database')) return <Database size={32} />;
    if (lower.includes('api')) return <Globe size={32} />;
    if (lower.includes('server')) return <Server size={32} />;
    if (lower.includes('cloud')) return <Cloud size={32} />;
    if (lower.includes('email')) return <Mail size={32} />;
    return <Zap size={32} />;
  };

  // Stats
  const healthyCount = services.filter((s) => s.service_status === 'healthy').length;
  const warningCount = services.filter((s) => s.service_status === 'warning').length;
  const errorCount = services.filter((s) => s.service_status === 'error').length;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Activity className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Trạng thái Tích hợp</h1>
            <p className={styles.subtitle}>
              Service health monitoring • {services.length} services
            </p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={toggleAutoRefresh}
            className={autoRefresh ? styles.btnAutoRefreshActive : styles.btnSecondary}
          >
            <RefreshCw size={16} className={autoRefresh ? styles.spinning : ''} />
            {autoRefresh ? 'Auto (10s)' : 'Auto-refresh'}
          </button>
          <button onClick={handleRefresh} className={styles.btnPrimary}>
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #15803d' }}>
          <CheckCircle size={24} style={{ color: '#15803d' }} />
          <div>
            <div className={styles.statValue}>{healthyCount}</div>
            <div className={styles.statLabel}>Healthy</div>
          </div>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #f59e0b' }}>
          <AlertTriangle size={24} style={{ color: '#f59e0b' }} />
          <div>
            <div className={styles.statValue}>{warningCount}</div>
            <div className={styles.statLabel}>Warning</div>
          </div>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #dc2626' }}>
          <XCircle size={24} style={{ color: '#dc2626' }} />
          <div>
            <div className={styles.statValue}>{errorCount}</div>
            <div className={styles.statLabel}>Error</div>
          </div>
        </div>
      </div>

      {/* Service Grid */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Đang tải integration status...</p>
        </div>
      ) : services.length === 0 ? (
        <div className={styles.emptyState}>
          <Activity size={64} />
          <p>Không có integration services</p>
        </div>
      ) : (
        <div className={styles.serviceGrid}>
          {services.map((service) => {
            const statusConfig = getStatusConfig(service.service_status);
            const timeSince = getTimeSince(service.service_last_sync);
            const errorRate =
              service.service_request_count_24h && service.service_error_count_24h
                ? (
                    (service.service_error_count_24h / service.service_request_count_24h) *
                    100
                  ).toFixed(2)
                : '0.00';

            return (
              <div
                key={service.service_id}
                className={styles.serviceCard}
                style={{
                  background: statusConfig.cardBg,
                  borderColor: statusConfig.borderColor,
                }}
                onClick={() => handleCardClick(service)}
              >
                {/* Status Badge - Large Corner */}
                <div
                  className={styles.statusBadge}
                  style={{ background: statusConfig.bg, color: statusConfig.color }}
                >
                  {statusConfig.icon}
                  {statusConfig.label}
                </div>

                {/* Service Icon */}
                <div className={styles.serviceIcon} style={{ color: statusConfig.borderColor }}>
                  {getServiceIcon(service.service_type)}
                </div>

                {/* Service Info */}
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceName}>{service.service_name}</h3>
                  <p className={styles.serviceType}>{service.service_type}</p>
                </div>

                {/* Last Sync - Prominent */}
                <div className={styles.lastSync}>
                  <Clock size={16} />
                  <div>
                    <div className={styles.lastSyncLabel}>Last Sync</div>
                    <div className={styles.lastSyncTime}>{timeSince}</div>
                  </div>
                </div>

                {/* Metrics */}
                <div className={styles.metricsRow}>
                  {service.service_uptime_percent !== undefined && (
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>Uptime</div>
                      <div className={styles.metricValue}>
                        {service.service_uptime_percent.toFixed(1)}%
                      </div>
                    </div>
                  )}
                  {service.service_response_time_ms !== undefined && (
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>Response</div>
                      <div className={styles.metricValue}>{service.service_response_time_ms}ms</div>
                    </div>
                  )}
                  {service.service_error_count_24h !== undefined && (
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>Error Rate</div>
                      <div
                        className={styles.metricValue}
                        style={{
                          color: parseFloat(errorRate) > 5 ? '#dc2626' : parseFloat(errorRate) > 1 ? '#f59e0b' : '#15803d',
                        }}
                      >
                        {errorRate}%
                      </div>
                    </div>
                  )}
                </div>

                {/* View Details Link */}
                <div className={styles.viewDetails}>
                  View Details
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal - Error Details */}
      {modalOpen && selectedService && (
        <>
          <div className={styles.modalOverlay} onClick={closeModal} />
          <div className={styles.modal}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>{selectedService.service_name}</h2>
                <p className={styles.modalSubtitle}>{selectedService.service_type}</p>
              </div>
              <button className={styles.modalCloseBtn} onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className={styles.modalContent}>
              {/* Status Overview */}
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Current Status</h3>
                <div
                  className={styles.statusOverview}
                  style={{
                    ...getStatusConfig(selectedService.service_status),
                    background: getStatusConfig(selectedService.service_status).bg,
                    color: getStatusConfig(selectedService.service_status).color,
                  }}
                >
                  {getStatusConfig(selectedService.service_status).icon}
                  <div>
                    <div className={styles.statusOverviewLabel}>
                      {getStatusConfig(selectedService.service_status).label}
                    </div>
                    <div className={styles.statusOverviewTime}>
                      Last sync: {formatDateTime(selectedService.service_last_sync)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>Service Details</h3>
                <div className={styles.detailsGrid}>
                  {selectedService.service_endpoint && (
                    <div className={styles.detailItem}>
                      <label>Endpoint</label>
                      <code>{selectedService.service_endpoint}</code>
                    </div>
                  )}
                  {selectedService.service_uptime_percent !== undefined && (
                    <div className={styles.detailItem}>
                      <label>Uptime (24h)</label>
                      <span>{selectedService.service_uptime_percent.toFixed(2)}%</span>
                    </div>
                  )}
                  {selectedService.service_response_time_ms !== undefined && (
                    <div className={styles.detailItem}>
                      <label>Avg Response Time</label>
                      <span>{selectedService.service_response_time_ms}ms</span>
                    </div>
                  )}
                  {selectedService.service_request_count_24h !== undefined && (
                    <div className={styles.detailItem}>
                      <label>Total Requests (24h)</label>
                      <span>{selectedService.service_request_count_24h.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedService.service_error_count_24h !== undefined && (
                    <div className={styles.detailItem}>
                      <label>Total Errors (24h)</label>
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>
                        {selectedService.service_error_count_24h.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Last Error */}
              {selectedService.service_last_error && (
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>Last Error</h3>
                  <div className={styles.lastErrorBox}>
                    <div className={styles.lastErrorHeader}>
                      <AlertCircle size={20} style={{ color: '#dc2626' }} />
                      <span>
                        {selectedService.service_last_error_time &&
                          formatDateTime(selectedService.service_last_error_time)}
                      </span>
                    </div>
                    <div className={styles.lastErrorMessage}>
                      {selectedService.service_last_error}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Error Logs */}
              <div className={styles.modalSection}>
                <h3 className={styles.modalSectionTitle}>
                  Recent Error Logs ({errorLogs.length})
                </h3>

                {errorLogs.length === 0 ? (
                  <div className={styles.noErrors}>
                    <CheckCircle size={32} style={{ color: '#15803d' }} />
                    <p>No errors in recent history</p>
                  </div>
                ) : (
                  <div className={styles.errorLogsList}>
                    {errorLogs.map((log) => (
                      <div key={log.error_id} className={styles.errorLogItem}>
                        <div className={styles.errorLogHeader}>
                          <XCircle size={16} style={{ color: '#dc2626' }} />
                          <span className={styles.errorLogTime}>
                            {formatDateTime(log.error_timestamp)}
                          </span>
                          {log.error_code && (
                            <code className={styles.errorCode}>{log.error_code}</code>
                          )}
                        </div>
                        <div className={styles.errorLogMessage}>{log.error_message}</div>
                        {log.error_stack && (
                          <details className={styles.errorStackDetails}>
                            <summary>Stack Trace</summary>
                            <pre className={styles.errorStack}>{log.error_stack}</pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
