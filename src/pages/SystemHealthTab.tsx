/**
 * System Health Tab - MAPPA Portal
 * Trạng thái hệ thống - Dashboard tổng quan với big metrics
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Server,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Database,
  Globe,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import styles from './SystemHealthTab.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// ============================================
// TYPES
// ============================================

interface SystemMetrics {
  uptime_percent: number;
  error_rate_percent: number;
  avg_response_time_ms: number;
  total_requests_24h: number;
  total_errors_24h: number;
  cpu_usage_percent?: number;
  memory_usage_percent?: number;
  disk_usage_percent?: number;
  active_users?: number;
}

interface ServiceHealth {
  service_name: string;
  service_status: 'healthy' | 'warning' | 'error';
  service_uptime_percent: number;
  service_last_check: string;
}

interface RecentIncident {
  incident_id: string;
  incident_timestamp: string;
  incident_type: string;
  incident_message: string;
  incident_severity: 'low' | 'medium' | 'high' | 'critical';
}

interface MetricHistory {
  timestamp: string;
  value: number;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const SystemHealthTab: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [incidents, setIncidents] = useState<RecentIncident[]>([]);
  const [uptimeHistory, setUptimeHistory] = useState<MetricHistory[]>([]);
  const [responseTimeHistory, setResponseTimeHistory] = useState<MetricHistory[]>([]);
  const [errorRateHistory, setErrorRateHistory] = useState<MetricHistory[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchSystemHealth = async () => {
    try {
      if (!metrics) {
        setLoading(true);
      }

      // Fetch main metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('system_metrics')
        .select('*, id:_id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (metricsError && metricsError.code !== 'PGRST116') {
        console.error('❌ Error fetching metrics:', metricsError);
      } else {
        setMetrics(metricsData || generateMockMetrics());
      }

      // Fetch service health
      const { data: servicesData, error: servicesError } = await supabase
        .from('service_health')
        .select('*, id:_id')
        .order('service_name', { ascending: true });

      if (servicesError && servicesError.code !== 'PGRST116') {
        console.error('❌ Error fetching services:', servicesError);
      } else {
        setServices(servicesData || generateMockServices());
      }

      // Fetch recent incidents
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('system_incidents')
        .select('*, id:_id')
        .order('incident_timestamp', { ascending: false })
        .limit(5);

      if (incidentsError && incidentsError.code !== 'PGRST116') {
        console.error('❌ Error fetching incidents:', incidentsError);
      } else {
        setIncidents(incidentsData || []);
      }

      // Fetch metric history (last 24 hours)
      const { data: historyData, error: historyError } = await supabase
        .from('system_metrics_history')
        .select('*, id:_id')
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: true });

      if (historyError && historyError.code !== 'PGRST116') {
        console.error('❌ Error fetching history:', historyError);
      } else if (historyData) {
        setUptimeHistory(historyData.map((h) => ({ timestamp: h.timestamp, value: h.uptime_percent })));
        setResponseTimeHistory(historyData.map((h) => ({ timestamp: h.timestamp, value: h.avg_response_time_ms })));
        setErrorRateHistory(historyData.map((h) => ({ timestamp: h.timestamp, value: h.error_rate_percent })));
      } else {
        // Generate mock history
        setUptimeHistory(generateMockHistory(99.9, 0.5));
        setResponseTimeHistory(generateMockHistory(150, 50));
        setErrorRateHistory(generateMockHistory(0.5, 0.3));
      }

    } catch (error) {
      console.error('❌ Error:', error);
      if (!metrics) {
        toast.error('Lỗi kết nối cơ sở dữ liệu');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchSystemHealth();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, metrics]);

  // ============================================
  // MOCK DATA GENERATORS
  // ============================================

  const generateMockMetrics = (): SystemMetrics => {
    return {
      uptime_percent: 99.87,
      error_rate_percent: 0.43,
      avg_response_time_ms: 142,
      total_requests_24h: 2847651,
      total_errors_24h: 12245,
      cpu_usage_percent: 45.2,
      memory_usage_percent: 67.8,
      disk_usage_percent: 52.3,
      active_users: 1842,
    };
  };

  const generateMockServices = (): ServiceHealth[] => {
    return [
      { service_name: 'API Gateway', service_status: 'healthy', service_uptime_percent: 99.95, service_last_check: new Date().toISOString() },
      { service_name: 'Database Primary', service_status: 'healthy', service_uptime_percent: 99.99, service_last_check: new Date().toISOString() },
      { service_name: 'Cache Server', service_status: 'warning', service_uptime_percent: 98.52, service_last_check: new Date().toISOString() },
      { service_name: 'Auth Service', service_status: 'healthy', service_uptime_percent: 99.89, service_last_check: new Date().toISOString() },
      { service_name: 'Storage Service', service_status: 'healthy', service_uptime_percent: 99.76, service_last_check: new Date().toISOString() },
      { service_name: 'Email Service', service_status: 'error', service_uptime_percent: 95.21, service_last_check: new Date().toISOString() },
    ];
  };

  const generateMockHistory = (baseValue: number, variance: number): MetricHistory[] => {
    const history: MetricHistory[] = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now - i * 60 * 60 * 1000).toISOString();
      const value = baseValue + (Math.random() - 0.5) * variance * 2;
      history.push({ timestamp, value: Math.max(0, value) });
    }
    return history;
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleRefresh = () => {
    toast.info('Đang làm mới dữ liệu...');
    fetchSystemHealth();
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.success(autoRefresh ? 'Đã tắt auto-refresh' : 'Đã bật auto-refresh (10s)');
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const overallStatus = useMemo(() => {
    if (!metrics) return 'unknown';
    if (metrics.uptime_percent >= 99.5 && metrics.error_rate_percent < 1) return 'healthy';
    if (metrics.uptime_percent >= 98 && metrics.error_rate_percent < 3) return 'warning';
    return 'error';
  }, [metrics]);

  const healthyServicesCount = services.filter((s) => s.service_status === 'healthy').length;
  const warningServicesCount = services.filter((s) => s.service_status === 'warning').length;
  const errorServicesCount = services.filter((s) => s.service_status === 'error').length;

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderSparkline = (data: MetricHistory[], color: string) => {
    if (data.length === 0) return null;
    return (
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      healthy: { bg: '#d4edda', color: '#155724', label: 'Hệ thống hoạt động bình thường', icon: <CheckCircle size={32} /> },
      warning: { bg: '#fff3cd', color: '#856404', label: 'Hệ thống cần theo dõi', icon: <AlertTriangle size={32} /> },
      error: { bg: '#f8d7da', color: '#721c24', label: 'Hệ thống gặp sự cố', icon: <XCircle size={32} /> },
      unknown: { bg: '#e2e3e5', color: '#383d41', label: 'Trạng thái không xác định', icon: <AlertCircle size={32} /> },
    };
    return configs[status as keyof typeof configs] || configs.unknown;
  };

  const getSeverityBadge = (severity: string) => {
    const badges = {
      low: { bg: '#d1ecf1', color: '#0c5460', label: 'Thấp' },
      medium: { bg: '#fff3cd', color: '#856404', label: 'Trung bình' },
      high: { bg: '#f8d7da', color: '#721c24', label: 'Cao' },
      critical: { bg: '#721c24', color: '#ffffff', label: 'Nghiêm trọng' },
    };
    return badges[severity as keyof typeof badges] || badges.low;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeSince = (timestamp: string): string => {
    const now = new Date().getTime();
    const then = new Date(timestamp).getTime();
    const diffMs = now - then;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) return `${diffSecs}s trước`;
    if (diffMins < 60) return `${diffMins}m trước`;
    if (diffHours < 24) return `${diffHours}h trước`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d trước`;
  };

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} />
        <p className={styles.loadingText}>Đang tải trạng thái hệ thống...</p>
      </div>
    );
  }

  const statusConfig = getStatusConfig(overallStatus);

  return (
    <div className={styles.container}>
      {/* Overall Status Banner */}
      <div className={styles.statusBanner} style={{ background: statusConfig.bg, color: statusConfig.color }}>
        <div className={styles.statusBannerContent}>
          <div className={styles.statusBannerIcon}>{statusConfig.icon}</div>
          <div className={styles.statusBannerText}>
            <h1 className={styles.statusBannerTitle}>{statusConfig.label}</h1>
            <p className={styles.statusBannerSubtitle}>
              Cập nhật lần cuối: {metrics ? new Date().toLocaleTimeString('vi-VN') : '--:--'}
            </p>
          </div>
        </div>
        <div className={styles.statusBannerActions}>
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

      {/* Big Metrics */}
      <div className={styles.bigMetricsGrid}>
        {/* Uptime */}
        <div className={styles.bigMetricCard}>
          <div className={styles.bigMetricHeader}>
            <div className={styles.bigMetricIcon} style={{ color: '#15803d' }}>
              <Activity size={28} />
            </div>
            <div className={styles.bigMetricLabel}>Uptime (24h)</div>
          </div>
          <div className={styles.bigMetricValue}>
            {metrics?.uptime_percent.toFixed(2)}%
          </div>
          <div className={styles.bigMetricTrend}>
            <TrendingUp size={16} style={{ color: '#15803d' }} />
            <span style={{ color: '#15803d' }}>+0.05% từ hôm qua</span>
          </div>
          <div className={styles.sparklineContainer}>
            {renderSparkline(uptimeHistory, '#15803d')}
          </div>
        </div>

        {/* Error Rate */}
        <div className={styles.bigMetricCard}>
          <div className={styles.bigMetricHeader}>
            <div className={styles.bigMetricIcon} style={{ color: '#dc2626' }}>
              <AlertCircle size={28} />
            </div>
            <div className={styles.bigMetricLabel}>Error Rate (24h)</div>
          </div>
          <div className={styles.bigMetricValue}>
            {metrics?.error_rate_percent.toFixed(2)}%
          </div>
          <div className={styles.bigMetricTrend}>
            <TrendingDown size={16} style={{ color: '#15803d' }} />
            <span style={{ color: '#15803d' }}>-0.12% từ hôm qua</span>
          </div>
          <div className={styles.sparklineContainer}>
            {renderSparkline(errorRateHistory, '#dc2626')}
          </div>
        </div>

        {/* Response Time */}
        <div className={styles.bigMetricCard}>
          <div className={styles.bigMetricHeader}>
            <div className={styles.bigMetricIcon} style={{ color: '#0c5460' }}>
              <Zap size={28} />
            </div>
            <div className={styles.bigMetricLabel}>Avg Response Time</div>
          </div>
          <div className={styles.bigMetricValue}>
            {metrics?.avg_response_time_ms}ms
          </div>
          <div className={styles.bigMetricTrend}>
            <TrendingUp size={16} style={{ color: '#dc2626' }} />
            <span style={{ color: '#dc2626' }}>+8ms từ hôm qua</span>
          </div>
          <div className={styles.sparklineContainer}>
            {renderSparkline(responseTimeHistory, '#0c5460')}
          </div>
        </div>

        {/* Total Requests */}
        <div className={styles.bigMetricCard}>
          <div className={styles.bigMetricHeader}>
            <div className={styles.bigMetricIcon} style={{ color: '#005cb6' }}>
              <Globe size={28} />
            </div>
            <div className={styles.bigMetricLabel}>Total Requests (24h)</div>
          </div>
          <div className={styles.bigMetricValue}>
            {metrics?.total_requests_24h.toLocaleString('vi-VN')}
          </div>
          <div className={styles.bigMetricTrend}>
            <TrendingUp size={16} style={{ color: '#15803d' }} />
            <span style={{ color: '#15803d' }}>+12.3% từ hôm qua</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className={styles.secondaryMetricsGrid}>
        <div className={styles.secondaryMetricCard}>
          <Cpu className={styles.secondaryMetricIcon} />
          <div>
            <div className={styles.secondaryMetricLabel}>CPU Usage</div>
            <div className={styles.secondaryMetricValue}>{metrics?.cpu_usage_percent?.toFixed(1) || '--'}%</div>
          </div>
        </div>
        <div className={styles.secondaryMetricCard}>
          <MemoryStick className={styles.secondaryMetricIcon} />
          <div>
            <div className={styles.secondaryMetricLabel}>Memory Usage</div>
            <div className={styles.secondaryMetricValue}>{metrics?.memory_usage_percent?.toFixed(1) || '--'}%</div>
          </div>
        </div>
        <div className={styles.secondaryMetricCard}>
          <HardDrive className={styles.secondaryMetricIcon} />
          <div>
            <div className={styles.secondaryMetricLabel}>Disk Usage</div>
            <div className={styles.secondaryMetricValue}>{metrics?.disk_usage_percent?.toFixed(1) || '--'}%</div>
          </div>
        </div>
        <div className={styles.secondaryMetricCard}>
          <Activity className={styles.secondaryMetricIcon} />
          <div>
            <div className={styles.secondaryMetricLabel}>Active Users</div>
            <div className={styles.secondaryMetricValue}>{metrics?.active_users?.toLocaleString('vi-VN') || '--'}</div>
          </div>
        </div>
      </div>

      {/* Service Health Overview */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Server size={24} />
            Service Health Overview
          </h2>
          <div className={styles.serviceSummary}>
            <span className={styles.serviceSummaryItem} style={{ color: '#15803d' }}>
              <CheckCircle size={16} />
              {healthyServicesCount} Healthy
            </span>
            <span className={styles.serviceSummaryItem} style={{ color: '#f59e0b' }}>
              <AlertTriangle size={16} />
              {warningServicesCount} Warning
            </span>
            <span className={styles.serviceSummaryItem} style={{ color: '#dc2626' }}>
              <XCircle size={16} />
              {errorServicesCount} Error
            </span>
          </div>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((service, idx) => {
            const statusColors = {
              healthy: { bg: '#d4edda', color: '#155724', icon: <CheckCircle size={20} /> },
              warning: { bg: '#fff3cd', color: '#856404', icon: <AlertTriangle size={20} /> },
              error: { bg: '#f8d7da', color: '#721c24', icon: <XCircle size={20} /> },
            };
            const config = statusColors[service.service_status];

            return (
              <div key={idx} className={styles.serviceCard}>
                <div className={styles.serviceCardHeader}>
                  <div className={styles.serviceCardIcon}>
                    <Database size={24} style={{ color: '#005cb6' }} />
                  </div>
                  <div
                    className={styles.serviceStatusBadge}
                    style={{ background: config.bg, color: config.color }}
                  >
                    {config.icon}
                  </div>
                </div>
                <div className={styles.serviceCardBody}>
                  <h3 className={styles.serviceCardName}>{service.service_name}</h3>
                  <div className={styles.serviceCardMetric}>
                    <span className={styles.serviceCardMetricLabel}>Uptime:</span>
                    <span className={styles.serviceCardMetricValue}>
                      {service.service_uptime_percent.toFixed(2)}%
                    </span>
                  </div>
                  <div className={styles.serviceCardFooter}>
                    <Clock size={14} />
                    <span>{getTimeSince(service.service_last_check)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <AlertTriangle size={24} />
            Recent Incidents & Alerts
          </h2>
        </div>

        {incidents.length === 0 ? (
          <div className={styles.noIncidents}>
            <CheckCircle size={48} style={{ color: '#15803d' }} />
            <p>Không có sự cố trong 24 giờ qua</p>
          </div>
        ) : (
          <div className={styles.incidentsList}>
            {incidents.map((incident) => {
              const severityBadge = getSeverityBadge(incident.incident_severity);
              return (
                <div key={incident.incident_id} className={styles.incidentCard}>
                  <div className={styles.incidentCardHeader}>
                    <div
                      className={styles.incidentSeverityBadge}
                      style={{ background: severityBadge.bg, color: severityBadge.color }}
                    >
                      {severityBadge.label}
                    </div>
                    <div className={styles.incidentTimestamp}>
                      <Clock size={14} />
                      {formatTimestamp(incident.incident_timestamp)}
                    </div>
                  </div>
                  <div className={styles.incidentCardBody}>
                    <div className={styles.incidentType}>{incident.incident_type}</div>
                    <div className={styles.incidentMessage}>{incident.incident_message}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
