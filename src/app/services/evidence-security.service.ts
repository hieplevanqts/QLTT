/**
 * Evidence Security Service
 * Implements NFR-S01, NFR-S02, NFR-S03
 * 
 * NFR-S01: Enforce scope địa bàn server-side
 * NFR-S02: Prevent broken access control at object level
 * NFR-S03: Audit logging for sensitive events
 */

export interface UserScope {
  userId: string;
  userName: string;
  role: 'admin' | 'inspector' | 'reviewer' | 'viewer';
  allowedDistricts: string[]; // Scope địa bàn
  allowedSensitivityLevels: string[]; // public, internal, confidential, restricted
}

export interface AccessCheckResult {
  allowed: boolean;
  reason?: string;
  scopeViolation?: boolean;
  permissionDenied?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'view' | 'download' | 'export' | 'approve' | 'reject' | 'seal' | 'unseal' | 'edit' | 'delete';
  resourceType: 'evidence';
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'denied' | 'error';
  reason?: string;
  metadata?: Record<string, any>;
  // OWASP: Tránh log dữ liệu nhạy cảm
  sanitized: boolean;
}

class EvidenceSecurityService {
  private currentUser: UserScope | null = null;

  /**
   * NFR-S01: Get current user with scope địa bàn
   */
  getCurrentUser(): UserScope {
    // Mock data - trong production sẽ lấy từ authentication context
    if (!this.currentUser) {
      this.currentUser = {
        userId: 'USR-2026-001',
        userName: 'Nguyễn Văn A',
        role: 'inspector',
        allowedDistricts: ['Quận 1', 'Quận 3', 'Quận 5'], // Scope địa bàn
        allowedSensitivityLevels: ['public', 'internal', 'confidential']
      };
    }
    return this.currentUser;
  }

  /**
   * NFR-S01: Check if user has access to district scope
   */
  checkDistrictScope(evidenceLocation: string): AccessCheckResult {
    const user = this.getCurrentUser();
    
    // Admin has access to all districts
    if (user.role === 'admin') {
      return { allowed: true };
    }

    // Extract district from location (e.g., "Quận 1, TP.HCM" -> "Quận 1")
    const district = evidenceLocation.split(',')[0].trim();
    
    const hasAccess = user.allowedDistricts.includes(district);
    
    if (!hasAccess) {
      return {
        allowed: false,
        scopeViolation: true,
        reason: `Người dùng không có quyền truy cập địa bàn: ${district}`
      };
    }

    return { allowed: true };
  }

  /**
   * NFR-S02: Check object-level access control
   * Prevents broken access control (OWASP Top 10 A01:2021)
   */
  checkObjectAccess(
    evidenceId: string,
    action: 'view' | 'download' | 'edit' | 'delete' | 'approve' | 'seal',
    evidence: {
      location: string;
      sensitivityLabel: string;
      status: string;
      submitterId?: string;
    }
  ): AccessCheckResult {
    const user = this.getCurrentUser();

    // 1. Check district scope
    const scopeCheck = this.checkDistrictScope(evidence.location);
    if (!scopeCheck.allowed) {
      this.logSecurityEvent({
        action,
        resourceId: evidenceId,
        result: 'denied',
        reason: scopeCheck.reason,
        metadata: { violationType: 'scope_violation' }
      });
      return scopeCheck;
    }

    // 2. Check sensitivity level access
    const hasSensitivityAccess = user.allowedSensitivityLevels.includes(evidence.sensitivityLabel);
    if (!hasSensitivityAccess) {
      this.logSecurityEvent({
        action,
        resourceId: evidenceId,
        result: 'denied',
        reason: `Insufficient sensitivity clearance: ${evidence.sensitivityLabel}`,
        metadata: { violationType: 'sensitivity_violation' }
      });
      return {
        allowed: false,
        permissionDenied: true,
        reason: `Không đủ quyền truy cập mức bảo mật: ${evidence.sensitivityLabel}`
      };
    }

    // 3. Check action-specific permissions
    switch (action) {
      case 'approve':
      case 'seal':
        if (user.role !== 'admin' && user.role !== 'reviewer') {
          this.logSecurityEvent({
            action,
            resourceId: evidenceId,
            result: 'denied',
            reason: `Insufficient role for action: ${action}`,
            metadata: { violationType: 'role_violation' }
          });
          return {
            allowed: false,
            permissionDenied: true,
            reason: `Chỉ Admin và Reviewer mới có quyền ${action}`
          };
        }
        break;

      case 'edit':
      case 'delete':
        // Không được sửa/xóa evidence đã sealed (NFR-I02)
        if (evidence.status === 'sealed' && user.role !== 'admin') {
          this.logSecurityEvent({
            action,
            resourceId: evidenceId,
            result: 'denied',
            reason: 'Cannot modify sealed evidence',
            metadata: { violationType: 'preservation_violation' }
          });
          return {
            allowed: false,
            permissionDenied: true,
            reason: 'Không thể sửa/xóa chứng cứ đã niêm phong'
          };
        }
        break;

      case 'download':
        // Viewer role không được download restricted content
        if (user.role === 'viewer' && evidence.sensitivityLabel === 'restricted') {
          this.logSecurityEvent({
            action,
            resourceId: evidenceId,
            result: 'denied',
            reason: 'Viewer cannot download restricted content',
            metadata: { violationType: 'download_restriction' }
          });
          return {
            allowed: false,
            permissionDenied: true,
            reason: 'Viewer không được tải xuống nội dung hạn chế'
          };
        }
        break;
    }

    return { allowed: true };
  }

  /**
   * NFR-S03: Log security-sensitive events
   * OWASP Logging Cheat Sheet compliant
   */
  logSecurityEvent(params: {
    action: string;
    resourceId: string;
    result: 'success' | 'denied' | 'error';
    reason?: string;
    metadata?: Record<string, any>;
  }): void {
    const user = this.getCurrentUser();
    
    // OWASP: Sanitize input to prevent log injection
    const sanitizedReason = params.reason?.replace(/[\r\n]/g, ' ').substring(0, 500);
    
    const auditLog: AuditLog = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: user.userId,
      userName: user.userName,
      action: params.action as any,
      resourceType: 'evidence',
      resourceId: params.resourceId,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent.substring(0, 200), // Truncate
      result: params.result,
      reason: sanitizedReason,
      metadata: params.metadata,
      sanitized: true
    };

    // OWASP: Log to structured format (JSON)
    
    // In production: Send to backend security logging service
    this.sendToSecurityLog(auditLog);
  }

  /**
   * NFR-S03: Send audit log to backend
   */
  private async sendToSecurityLog(log: AuditLog): Promise<void> {
    // In production: POST to /api/audit-logs
    // For now, store in localStorage for demo
    try {
      const logs = this.getAuditLogs();
      logs.unshift(log);
      // Keep last 1000 logs
      const trimmedLogs = logs.slice(0, 1000);
      localStorage.setItem('evidence_audit_logs', JSON.stringify(trimmedLogs));
    } catch (error) {
      console.error('[AUDIT_ERROR]', error);
    }
  }

  /**
   * Get audit logs for display
   */
  getAuditLogs(): AuditLog[] {
    try {
      const logs = localStorage.getItem('evidence_audit_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get client IP (mock)
   */
  private getClientIP(): string {
    // In production: Get from request headers
    return '113.161.xxx.xxx';
  }

  /**
   * NFR-S03: Log sensitive action (download, export, approve, seal)
   */
  logSensitiveAction(
    action: 'download' | 'export' | 'approve' | 'seal' | 'unseal',
    evidenceId: string,
    metadata?: Record<string, any>
  ): void {
    this.logSecurityEvent({
      action,
      resourceId: evidenceId,
      result: 'success',
      metadata
    });
  }
}

// Singleton instance
export const evidenceSecurityService = new EvidenceSecurityService();
