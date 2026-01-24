/**
 * ASSIGNMENTS PAGE - Tổng quan phân quyền
 * Permission: sa.iam.assignment.read
 */

import React from 'react';
import { Users, Shield, Key, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PermissionGate, ModuleShell } from '../../_shared';
import { MOCK_ASSIGNMENT_SUMMARY } from '../mock-data';
import styles from './AssignmentsPage.module.css';

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const summary = MOCK_ASSIGNMENT_SUMMARY;

  return (
    <PermissionGate permission="sa.iam.assignment.read">
      <ModuleShell
        title="Tổng quan Phân quyền"
        subtitle="Thống kê và quản lý phân quyền trong hệ thống"
        breadcrumbs={[
          { label: 'Trang chủ', path: '/' },
          { label: 'Quản trị hệ thống', path: '/system-admin' },
          { label: 'IAM', path: '/system-admin/iam' },
          { label: 'Phân quyền' }
        ]}
      >
        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Users size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{summary.totalUsers}</div>
              <div className={styles.statLabel}>Người dùng</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Shield size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{summary.totalRoles}</div>
              <div className={styles.statLabel}>Vai trò</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <Key size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{summary.totalPermissions}</div>
              <div className={styles.statLabel}>Quyền hạn</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fff7ed', color: '#ea580c' }}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{summary.totalUserRoleAssignments}</div>
              <div className={styles.statLabel}>Phân quyền người dùng</div>
            </div>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className={styles.recentSection}>
          <h3>Phân quyền gần đây</h3>
          <div className={styles.recentList}>
            {summary.recentAssignments.map((assignment) => (
              <div key={assignment.id} className={styles.recentItem}>
                <div className={styles.recentIcon}>
                  {assignment.type === 'user-role' ? (
                    <Users size={18} />
                  ) : (
                    <Shield size={18} />
                  )}
                </div>
                <div className={styles.recentContent}>
                  <div className={styles.recentDescription}>{assignment.description}</div>
                  <div className={styles.recentMeta}>
                    <span>Bởi: {assignment.assignedBy}</span>
                    <span>•</span>
                    <span>{new Date(assignment.assignedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.actionsSection}>
          <h3>Thao tác nhanh</h3>
          <div className={styles.actionCards}>
            <button
              className={styles.actionCard}
              onClick={() => navigate('/system-admin/iam/users')}
            >
              <Users size={32} />
              <h4>Quản lý người dùng</h4>
              <p>Xem và quản lý tài khoản người dùng</p>
            </button>

            <button
              className={styles.actionCard}
              onClick={() => navigate('/system-admin/iam/roles')}
            >
              <Shield size={32} />
              <h4>Quản lý vai trò</h4>
              <p>Tạo và cấu hình vai trò</p>
            </button>

            <button
              className={styles.actionCard}
              onClick={() => navigate('/system-admin/iam/permissions')}
            >
              <Key size={32} />
              <h4>Danh sách quyền hạn</h4>
              <p>Xem tất cả quyền hạn hệ thống</p>
            </button>
          </div>
        </div>
      </ModuleShell>
    </PermissionGate>
  );
}
