/**
 * USERS PAGE - Quản lý người dùng
 * Permission: sa.iam.user.read
 */

import React, { useState, useMemo } from 'react';
import { Plus, Search, Eye, Lock, Unlock, Users as UsersIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PermissionGate, EmptyState, usePermissions } from '../../_shared';
import PageHeader from '@/layouts/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { MOCK_USERS } from '../mock-data';
import type { User } from '../types';
import styles from './UsersPage.module.css';

export default function UsersPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const canCreate = hasPermission('sa.iam.user.create');
  const canUpdate = hasPermission('sa.iam.user.update');
  const canDelete = hasPermission('sa.iam.user.delete');

  const filteredData = useMemo(() => {
    return MOCK_USERS.filter(user => {
      // Status filter
      if (statusFilter !== 'all' && user.status !== statusFilter) {
        return false;
      }
      
      // Search filter
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        user.username.toLowerCase().includes(query) ||
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <span className={styles.statusActive}>Hoạt động</span>;
      case 'inactive':
        return <span className={styles.statusInactive}>Tạm dừng</span>;
      case 'locked':
        return <span className={styles.statusLocked}>Khóa</span>;
    }
  };

  return (
    <PermissionGate permission="sa.iam.user.read">
      <div className={styles.pageContainer}>
        {/* Page Header */}
        <PageHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Quản trị hệ thống', href: '/system-admin' },
            { label: 'IAM' },
            { label: 'Người dùng' }
          ]}
          title="Quản lý Người dùng"
          subtitle="Quản lý tài khoản và thông tin người dùng hệ thống"
          actions={
            <Button size="sm" disabled={!canCreate}>
              <Plus size={18} />
              Thêm người dùng
            </Button>
          }
        />

        {/* Main Card */}
        <Card>
          <CardContent>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Tìm theo username, họ tên, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              
              <div className={styles.filters}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className={styles.filterSelect}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
                  <option value="locked">Khóa</option>
                </select>
              </div>

              <div className={styles.stats}>
                <span className={styles.statsText}>
                  Tổng: <strong>{filteredData.length}</strong> người dùng
                </span>
              </div>
            </div>

            {/* Table */}
            {paginatedData.length === 0 ? (
              <EmptyState
                icon={<Search size={48} />}
                title="Không tìm thấy người dùng"
                message="Không có người dùng nào phù hợp với tiêu chí tìm kiếm."
              />
            ) : (
              <>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Chức vụ</th>
                        <th>Đăng nhập lần cuối</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <span className={styles.username}>{user.username}</span>
                          </td>
                          <td>
                            <span className={styles.fullName}>{user.fullName}</span>
                          </td>
                          <td>
                            <span className={styles.email}>{user.email}</span>
                          </td>
                          <td>{user.position}</td>
                          <td>
                            {user.lastLoginAt ? (
                              <span className={styles.dateText}>
                                {new Date(user.lastLoginAt).toLocaleString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            ) : (
                              <span className={styles.neverLogin}>Chưa đăng nhập</span>
                            )}
                          </td>
                          <td>{getStatusBadge(user.status)}</td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button
                                className={styles.buttonSecondary}
                                onClick={() => navigate(`/system-admin/iam/users/${user.id}`)}
                                title="Xem chi tiết"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                className={styles.buttonSecondary}
                                disabled={!canUpdate}
                                title={user.status === 'locked' ? 'Mở khóa' : 'Khóa tài khoản'}
                              >
                                {user.status === 'locked' ? (
                                  <Unlock size={14} />
                                ) : (
                                  <Lock size={14} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationButton}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </button>
                  <span className={styles.paginationInfo}>
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    className={styles.paginationButton}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
}

