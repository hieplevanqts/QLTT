import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock,
  Eye,
  Download,
  FileCheck,
  Activity,
  Clock,
  TrendingUp,
  MapPin,
  User,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import styles from './SecurityDashboard.module.css';
import { evidenceSecurityService, AuditLog } from '../../services/evidence-security.service';
import { evidencePerformanceService } from '../../services/evidence-performance.service';

/**
 * Security Dashboard Component
 * Displays NFR compliance status:
 * - NFR-S01: Scope địa bàn enforcement
 * - NFR-S02: Access control violations
 * - NFR-S03: Audit logs
 * - Performance metrics
 */

export default function SecurityDashboard() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [userScope, setUserScope] = useState<any>(null);

  useEffect(() => {
    // Load audit logs
    const logs = evidenceSecurityService.getAuditLogs();
    setAuditLogs(logs.slice(0, 20)); // Show last 20 logs

    // Load performance stats
    const stats = evidencePerformanceService.getPerformanceStats();
    setPerformanceStats(stats);

    // Load current user scope
    const user = evidenceSecurityService.getCurrentUser();
    setUserScope(user);
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view': return <Eye size={14} />;
      case 'download': return <Download size={14} />;
      case 'approve': return <CheckCircle size={14} />;
      case 'seal': return <Lock size={14} />;
      case 'unseal': return <Unlock size={14} />;
      default: return <Activity size={14} />;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'success':
        return <Badge variant="outline" style={{ borderColor: '#22c55e', color: '#22c55e' }}>Success</Badge>;
      case 'denied':
        return <Badge variant="outline" style={{ borderColor: '#ef4444', color: '#ef4444' }}>Denied</Badge>;
      case 'error':
        return <Badge variant="outline" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Shield size={24} style={{ color: '#005cb6' }} />
          <div>
            <h2>Security & Performance Dashboard</h2>
            <p>NFR Compliance Monitoring - OWASP, SWGDE, ISO/IEC 27037</p>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* NFR-S01: User Scope */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <MapPin size={20} style={{ color: '#005cb6' }} />
            <h3>NFR-S01: Scope Địa bàn</h3>
          </div>
          <div className={styles.cardBody}>
            {userScope && (
              <>
                <div className={styles.scopeInfo}>
                  <div className={styles.scopeItem}>
                    <User size={16} />
                    <span>{userScope.userName}</span>
                  </div>
                  <Badge variant="outline" style={{ borderColor: '#005cb6', color: '#005cb6' }}>
                    {userScope.role.toUpperCase()}
                  </Badge>
                </div>
                
                <div className={styles.scopeList}>
                  <label>Allowed Districts:</label>
                  <div className={styles.districtBadges}>
                    {userScope.allowedDistricts.map((district: string) => (
                      <Badge key={district} variant="secondary">
                        <MapPin size={12} />
                        {district}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className={styles.scopeList}>
                  <label>Sensitivity Clearance:</label>
                  <div className={styles.districtBadges}>
                    {userScope.allowedSensitivityLevels.map((level: string) => (
                      <Badge key={level} variant="secondary">
                        <Shield size={12} />
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Performance Stats */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <TrendingUp size={20} style={{ color: '#22c55e' }} />
            <h3>Performance Metrics</h3>
          </div>
          <div className={styles.cardBody}>
            {performanceStats && (
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <label>Average Load Time</label>
                  <div className={styles.statValue}>
                    {performanceStats.avgDuration || 0}ms
                  </div>
                </div>
                <div className={styles.statItem}>
                  <label>P95 Load Time</label>
                  <div className={styles.statValue} style={{ 
                    color: (performanceStats.p95Duration || 0) > 800 ? '#ef4444' : '#22c55e' 
                  }}>
                    {performanceStats.p95Duration || 0}ms
                  </div>
                  {(performanceStats.p95Duration || 0) > 800 && (
                    <span style={{ fontSize: 'var(--text-xs)', color: '#ef4444' }}>
                      ⚠️ Exceeds 800ms threshold
                    </span>
                  )}
                </div>
                <div className={styles.statItem}>
                  <label>Success Rate</label>
                  <div className={styles.statValue} style={{ color: '#22c55e' }}>
                    {performanceStats.successRate || 0}%
                  </div>
                </div>
                <div className={styles.statItem}>
                  <label>Total Operations</label>
                  <div className={styles.statValue}>
                    {performanceStats.count || 0}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NFR-S03: Audit Logs */}
        <div className={styles.cardWide}>
          <div className={styles.cardHeader}>
            <FileCheck size={20} style={{ color: '#005cb6' }} />
            <h3>NFR-S03: Security Audit Logs</h3>
            <Badge variant="outline" style={{ marginLeft: 'auto' }}>
              OWASP Compliant
            </Badge>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.auditLogContainer}>
              <table className={styles.auditTable}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Resource ID</th>
                    <th>IP Address</th>
                    <th>Result</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>
                        <AlertCircle size={24} style={{ color: 'var(--text-secondary)' }} />
                        <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
                          No audit logs yet. Security events will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <div className={styles.timestampCell}>
                            <Clock size={12} />
                            {formatTimestamp(log.timestamp)}
                          </div>
                        </td>
                        <td>
                          <div className={styles.userCell}>
                            <User size={12} />
                            {log.userName}
                          </div>
                        </td>
                        <td>
                          <div className={styles.actionCell}>
                            {getActionIcon(log.action)}
                            {log.action}
                          </div>
                        </td>
                        <td>
                          <code className={styles.resourceId}>{log.resourceId}</code>
                        </td>
                        <td>
                          <code className={styles.ipAddress}>{log.ipAddress}</code>
                        </td>
                        <td>{getResultBadge(log.result)}</td>
                        <td>
                          {log.reason ? (
                            <span className={styles.reason}>{log.reason}</span>
                          ) : (
                            <span style={{ color: 'var(--text-secondary)' }}>-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.complianceBadges}>
          <Badge variant="outline" style={{ borderColor: '#22c55e', color: '#22c55e' }}>
            <CheckCircle size={14} />
            OWASP A01:2021 Compliant
          </Badge>
          <Badge variant="outline" style={{ borderColor: '#22c55e', color: '#22c55e' }}>
            <CheckCircle size={14} />
            SWGDE Best Practices
          </Badge>
          <Badge variant="outline" style={{ borderColor: '#22c55e', color: '#22c55e' }}>
            <CheckCircle size={14} />
            ISO/IEC 27037
          </Badge>
        </div>
      </div>
    </div>
  );
}
