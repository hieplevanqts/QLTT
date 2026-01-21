/**
 * Security Config Tab - MAPPA Portal
 * Cấu hình bảo mật - Read-only card layout với tooltips
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Clock,
  MapPin,
  Key,
  RefreshCw,
  Eye,
  Info,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Calendar,
  Users,
  Smartphone,
  Globe,
} from 'lucide-react';
import styles from './SecurityConfigTab.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// ============================================
// TYPES
// ============================================

interface SecurityConfig {
  // Password Policy
  password_min_length?: number;
  password_require_uppercase?: boolean;
  password_require_lowercase?: boolean;
  password_require_numbers?: boolean;
  password_require_special_chars?: boolean;
  password_expiry_days?: number;
  password_history_count?: number;

  // OTP Policy
  otp_enabled?: boolean;
  otp_code_length?: number;
  otp_expiry_minutes?: number;
  otp_max_attempts?: number;
  otp_delivery_method?: string;

  // Session Policy
  session_timeout_minutes?: number;
  session_absolute_timeout_hours?: number;
  session_concurrent_limit?: number;
  session_remember_me_enabled?: boolean;

  // IP Restrictions
  ip_whitelist_enabled?: boolean;
  ip_whitelist_addresses?: string[];
  ip_blacklist_enabled?: boolean;
  ip_blacklist_addresses?: string[];

  // Last Updated
  config_updated_at?: string;
  config_updated_by?: string;
}

// Tooltip definitions
const TOOLTIPS = {
  password_min_length: 'Độ dài tối thiểu của mật khẩu người dùng',
  password_expiry_days: 'Số ngày trước khi mật khẩu hết hạn và yêu cầu đổi mới',
  password_history_count: 'Số lượng mật khẩu cũ được lưu trữ để ngăn tái sử dụng',
  otp_code_length: 'Số ký tự trong mã OTP (One-Time Password)',
  otp_expiry_minutes: 'Thời gian mã OTP có hiệu lực trước khi hết hạn',
  otp_max_attempts: 'Số lần nhập sai mã OTP tối đa trước khi khóa',
  session_timeout_minutes: 'Thời gian không hoạt động trước khi session tự động đăng xuất',
  session_absolute_timeout_hours: 'Thời gian tối đa session có thể tồn tại',
  session_concurrent_limit: 'Số lượng phiên đăng nhập đồng thời tối đa cho 1 user',
  ip_whitelist_enabled: 'Chỉ cho phép truy cập từ các IP trong danh sách trắng',
  ip_blacklist_enabled: 'Chặn truy cập từ các IP trong danh sách đen',
};

// ============================================
// TOOLTIP COMPONENT
// ============================================

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={styles.tooltipContainer}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <div className={styles.tooltipContent}>{text}</div>}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const SecurityConfigTab: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<SecurityConfig | null>(null);

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchSecurityConfig = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('security_config')
        .select('*, id:_id')
        .single();

      if (error) {
        console.error('❌ Error fetching security config:', error);
        toast.error(`Lỗi tải dữ liệu: ${error.message}`);
        return;
      }

      setConfig(data);
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Lỗi kết nối cơ sở dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityConfig();
  }, []);

  // ============================================
  // HANDLERS
  // ============================================

  const handleRefresh = () => {
    toast.info('Đang làm mới dữ liệu...');
    fetchSecurityConfig();
  };

  const formatDateTime = (timestamp?: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Đang tải cấu hình bảo mật...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <Shield size={64} />
          <p>Không thể tải cấu hình bảo mật</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Shield className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Cấu hình Bảo mật</h1>
            <p className={styles.subtitle}>
              Read-only security policies • Last updated: {formatDateTime(config.config_updated_at)}
            </p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleRefresh} className={styles.btnPrimary}>
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className={styles.infoBanner}>
        <Info size={20} />
        <span>
          Các cấu hình bảo mật này là <strong>read-only</strong>. Để thay đổi, vui lòng liên hệ
          quản trị viên hệ thống hoặc sử dụng công cụ quản lý bảo mật chuyên dụng.
        </span>
      </div>

      {/* Card Grid */}
      <div className={styles.cardGrid}>
        {/* Password Policy Card */}
        <div className={styles.policyCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} style={{ background: 'rgba(220, 38, 38, 0.1)' }}>
              <Lock size={28} style={{ color: '#dc2626' }} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Password Policy</h2>
              <p className={styles.cardSubtitle}>Chính sách mật khẩu người dùng</p>
            </div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.configItem}>
              <div className={styles.configLabel}>
                <span>Minimum Length</span>
                <Tooltip text={TOOLTIPS.password_min_length}>
                  <Info size={14} className={styles.tooltipIcon} />
                </Tooltip>
              </div>
              <div className={styles.configValue}>
                <span className={styles.highlightValue}>{config.password_min_length || 8}</span>
                <span className={styles.valueUnit}>characters</span>
              </div>
            </div>

            <div className={styles.configItem}>
              <div className={styles.configLabel}>
                <span>Complexity Requirements</span>
              </div>
              <div className={styles.configChecks}>
                <div className={styles.checkItem}>
                  {config.password_require_uppercase ? (
                    <CheckCircle size={16} className={styles.checkYes} />
                  ) : (
                    <XCircle size={16} className={styles.checkNo} />
                  )}
                  <span>Uppercase (A-Z)</span>
                </div>
                <div className={styles.checkItem}>
                  {config.password_require_lowercase ? (
                    <CheckCircle size={16} className={styles.checkYes} />
                  ) : (
                    <XCircle size={16} className={styles.checkNo} />
                  )}
                  <span>Lowercase (a-z)</span>
                </div>
                <div className={styles.checkItem}>
                  {config.password_require_numbers ? (
                    <CheckCircle size={16} className={styles.checkYes} />
                  ) : (
                    <XCircle size={16} className={styles.checkNo} />
                  )}
                  <span>Numbers (0-9)</span>
                </div>
                <div className={styles.checkItem}>
                  {config.password_require_special_chars ? (
                    <CheckCircle size={16} className={styles.checkYes} />
                  ) : (
                    <XCircle size={16} className={styles.checkNo} />
                  )}
                  <span>Special Characters (!@#$)</span>
                </div>
              </div>
            </div>

            <div className={styles.configItem}>
              <div className={styles.configLabel}>
                <span>Password Expiry</span>
                <Tooltip text={TOOLTIPS.password_expiry_days}>
                  <Info size={14} className={styles.tooltipIcon} />
                </Tooltip>
              </div>
              <div className={styles.configValue}>
                <span className={styles.highlightValue}>{config.password_expiry_days || 90}</span>
                <span className={styles.valueUnit}>days</span>
              </div>
            </div>

            <div className={styles.configItem}>
              <div className={styles.configLabel}>
                <span>Password History</span>
                <Tooltip text={TOOLTIPS.password_history_count}>
                  <Info size={14} className={styles.tooltipIcon} />
                </Tooltip>
              </div>
              <div className={styles.configValue}>
                <span className={styles.highlightValue}>{config.password_history_count || 5}</span>
                <span className={styles.valueUnit}>passwords remembered</span>
              </div>
            </div>
          </div>
        </div>

        {/* OTP Policy Card */}
        <div className={styles.policyCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <Smartphone size={28} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>OTP Policy</h2>
              <p className={styles.cardSubtitle}>Chính sách xác thực 2 yếu tố</p>
            </div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.configItem}>
              <div className={styles.configLabel}>
                <span>OTP Status</span>
              </div>
              <div className={styles.configValue}>
                {config.otp_enabled ? (
                  <span className={styles.statusBadge} style={{ background: '#d4edda', color: '#155724' }}>
                    <CheckCircle size={14} />
                    ENABLED
                  </span>
                ) : (
                  <span className={styles.statusBadge} style={{ background: '#f8d7da', color: '#721c24' }}>
                    <XCircle size={14} />
                    DISABLED
                  </span>
                )}
              </div>
            </div>

            {config.otp_enabled && (
              <>
                <div className={styles.configItem}>
                  <div className={styles.configLabel}>
                    <span>Code Length</span>
                    <Tooltip text={TOOLTIPS.otp_code_length}>
                      <Info size={14} className={styles.tooltipIcon} />
                    </Tooltip>
                  </div>
                  <div className={styles.configValue}>
                    <span className={styles.highlightValue}>{config.otp_code_length || 6}</span>
                    <span className={styles.valueUnit}>digits</span>
                  </div>
                </div>

                <div className={styles.configItem}>
                  <div className={styles.configLabel}>
                    <span>Code Expiry</span>
                    <Tooltip text={TOOLTIPS.otp_expiry_minutes}>
                      <Info size={14} className={styles.tooltipIcon} />
                    </Tooltip>
                  </div>
                  <div className={styles.configValue}>
                    <span className={styles.highlightValue}>{config.otp_expiry_minutes || 5}</span>
                    <span className={styles.valueUnit}>minutes</span>
                  </div>
                </div>

                <div className={styles.configItem}>
                  <div className={styles.configLabel}>
                    <span>Max Attempts</span>
                    <Tooltip text={TOOLTIPS.otp_max_attempts}>
                      <Info size={14} className={styles.tooltipIcon} />
                    </Tooltip>
                  </div>
                  <div className={styles.configValue}>
                    <span className={styles.highlightValue}>{config.otp_max_attempts || 3}</span>
                    <span className={styles.valueUnit}>attempts</span>
                  </div>
                </div>

                <div className={styles.configItem}>
                  <div className={styles.configLabel}>
                    <span>Delivery Method</span>
                  </div>
                  <div className={styles.configValue}>
                    <code className={styles.deliveryMethod}>
                      {config.otp_delivery_method || 'EMAIL'}
                    </code>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Session Policy Card */}
        <div className={styles.policyCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} style={{ background: 'rgba(0, 92, 182, 0.1)' }}>
              <Clock size={28} style={{ color: '#005cb6' }} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Session Policy</h2>
              <p className={styles.cardSubtitle}>Chính sách phiên đăng nhập</p>
            </div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.configItem}>
              <div className={styles.configLabel}>
                <span>Idle Timeout</span>
                <Tooltip text={TOOLTIPS.session_timeout_minutes}>
                  <Info size={14} className={styles.tooltipIcon} />
                </Tooltip>
              </div>
              <div className={styles.configValue}>
                <span className={styles.highlightValue}>{config.session_timeout_minutes || 30}</span>
                <span className={styles.valueUnit}>minutes</span>
              </div>
            </div>

            <div className={styles.configItem}>
              <div className={styles.configLabel}>
                <span>Absolute Timeout</span>
                <Tooltip text={TOOLTIPS.session_absolute_timeout_hours}>
                  <Info size={14} className={styles.tooltipIcon} />
                </Tooltip>
              </div>
              <div className={styles.configValue}>
                <span className={styles.highlightValue}>{config.session_absolute_timeout_hours || 8}</span>
                <span className={styles.valueUnit}>hours</span>
              </div>
            </div>

            <div className={styles.configItem}>
              <div className={styles.configLabel}>
                <span>Concurrent Sessions</span>
                <Tooltip text={TOOLTIPS.session_concurrent_limit}>
                  <Info size={14} className={styles.tooltipIcon} />
                </Tooltip>
              </div>
              <div className={styles.configValue}>
                <span className={styles.highlightValue}>{config.session_concurrent_limit || 3}</span>
                <span className={styles.valueUnit}>sessions max</span>
              </div>
            </div>

            <div className={styles.configItem}>
              <div className={styles.configLabel}>
                <span>Remember Me</span>
              </div>
              <div className={styles.configValue}>
                {config.session_remember_me_enabled ? (
                  <span className={styles.statusBadge} style={{ background: '#d4edda', color: '#155724' }}>
                    <CheckCircle size={14} />
                    ENABLED
                  </span>
                ) : (
                  <span className={styles.statusBadge} style={{ background: '#f8d7da', color: '#721c24' }}>
                    <XCircle size={14} />
                    DISABLED
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* IP Restrictions Card */}
        <div className={styles.policyCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} style={{ background: 'rgba(21, 128, 61, 0.1)' }}>
              <MapPin size={28} style={{ color: '#15803d' }} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>IP Restrictions</h2>
              <p className={styles.cardSubtitle}>Chính sách giới hạn địa chỉ IP</p>
            </div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.configItem}>
              <div className={styles.configLabel}>
                <span>IP Whitelist</span>
                <Tooltip text={TOOLTIPS.ip_whitelist_enabled}>
                  <Info size={14} className={styles.tooltipIcon} />
                </Tooltip>
              </div>
              <div className={styles.configValue}>
                {config.ip_whitelist_enabled ? (
                  <span className={styles.statusBadge} style={{ background: '#d4edda', color: '#155724' }}>
                    <CheckCircle size={14} />
                    ENABLED
                  </span>
                ) : (
                  <span className={styles.statusBadge} style={{ background: '#e2e3e5', color: '#383d41' }}>
                    <XCircle size={14} />
                    DISABLED
                  </span>
                )}
              </div>
            </div>

            {config.ip_whitelist_enabled && config.ip_whitelist_addresses && (
              <div className={styles.configItem}>
                <div className={styles.configLabel}>
                  <span>Allowed IPs</span>
                </div>
                <div className={styles.ipList}>
                  {config.ip_whitelist_addresses.slice(0, 5).map((ip, index) => (
                    <code key={index} className={styles.ipAddress}>
                      <Globe size={12} />
                      {ip}
                    </code>
                  ))}
                  {config.ip_whitelist_addresses.length > 5 && (
                    <span className={styles.ipMore}>
                      +{config.ip_whitelist_addresses.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className={styles.configItem}>
              <div className={styles.configLabel}>
                <span>IP Blacklist</span>
                <Tooltip text={TOOLTIPS.ip_blacklist_enabled}>
                  <Info size={14} className={styles.tooltipIcon} />
                </Tooltip>
              </div>
              <div className={styles.configValue}>
                {config.ip_blacklist_enabled ? (
                  <span className={styles.statusBadge} style={{ background: '#f8d7da', color: '#721c24' }}>
                    <AlertTriangle size={14} />
                    ENABLED
                  </span>
                ) : (
                  <span className={styles.statusBadge} style={{ background: '#e2e3e5', color: '#383d41' }}>
                    <XCircle size={14} />
                    DISABLED
                  </span>
                )}
              </div>
            </div>

            {config.ip_blacklist_enabled && config.ip_blacklist_addresses && (
              <div className={styles.configItem}>
                <div className={styles.configLabel}>
                  <span>Blocked IPs</span>
                </div>
                <div className={styles.ipList}>
                  {config.ip_blacklist_addresses.slice(0, 5).map((ip, index) => (
                    <code key={index} className={styles.ipAddressBlocked}>
                      <Globe size={12} />
                      {ip}
                    </code>
                  ))}
                  {config.ip_blacklist_addresses.length > 5 && (
                    <span className={styles.ipMore}>
                      +{config.ip_blacklist_addresses.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className={styles.footerInfo}>
        <div className={styles.footerItem}>
          <Calendar size={16} />
          <span>Last Updated: {formatDateTime(config.config_updated_at)}</span>
        </div>
        {config.config_updated_by && (
          <div className={styles.footerItem}>
            <Users size={16} />
            <span>Updated By: {config.config_updated_by}</span>
          </div>
        )}
      </div>
    </div>
  );
};
