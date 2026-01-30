/**
 * Notification Rules Tab - MAPPA Portal
 * Tab quản trị "Quy tắc thông báo" (Trigger – Who – How pattern)
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Search,
  Plus,
  Edit,
  Eye,
  PowerOff,
  RefreshCw,
  FileDown,
  Upload,
  Download,
  ChevronDown,
  AlertCircle,
  Loader2,
  Info,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import styles from './CategoriesTab.module.css';
import { toast } from 'sonner';
import { Pagination, usePagination } from '../components/Pagination';
import {
  NotificationRule,
  SAMPLE_NOTIFICATION_RULES,
  EventType,
  RecipientRole,
  ScopeType,
  Channel,
  RuleStatus,
  Priority,
  getEventTypeLabel,
  getEventTypeTooltip,
  getScopeTypeLabel,
  getStatusBadgeStyle,
  getPriorityBadgeStyle,
  formatChannels,
  formatRoles,
  ALL_EVENT_TYPES,
  ALL_RECIPIENT_ROLES,
  ALL_SCOPE_TYPES,
  ALL_CHANNELS,
} from '@/utils/data/notificationRulesTemplates';
import {
  exportRulesToExcel,
  downloadExcelTemplate,
  parseExcelFile,
} from '@/utils/data/notificationRulesExcel';

interface NotificationRulesTabProps {
  onOpenModal?: (type: 'add' | 'edit' | 'view', rule?: NotificationRule) => void;
}

export const NotificationRulesTab: React.FC<NotificationRulesTabProps> = ({ onOpenModal }) => {
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [filteredRules, setFilteredRules] = useState<NotificationRule[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEventType, setFilterEventType] = useState<EventType | 'all'>('all');
  const [filterChannel, setFilterChannel] = useState<Channel | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<RuleStatus | 'all'>('all');
  const [filterScope, setFilterScope] = useState<ScopeType | 'all'>('all');
  const [filterRole, setFilterRole] = useState<RecipientRole | 'all'>('all');

  // Import dropdown
  const [isImportDropdownOpen, setIsImportDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination
  const itemsPerPage = 15;
  const pagination = usePagination(filteredRules, itemsPerPage);
  const { currentPage, setCurrentPage, totalPages, currentItems, totalItems } = pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setCurrentPage(1);
  };

  // Fetch rules
  const fetchRules = async () => {
    try {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      setRules(SAMPLE_NOTIFICATION_RULES);
      setFilteredRules(SAMPLE_NOTIFICATION_RULES);
    } catch (error) {
      console.error('❌ Error loading rules:', error);
      toast.error('Lỗi tải dữ liệu quy tắc thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.importDropdown')) {
        setIsImportDropdownOpen(false);
      }
    };

    if (isImportDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isImportDropdownOpen]);

  // Apply filters
  useEffect(() => {
    let filtered = [...rules];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (rule) =>
          rule.rule_name.toLowerCase().includes(term) ||
          rule.rule_code.toLowerCase().includes(term) ||
          rule.description.toLowerCase().includes(term)
      );
    }

    // Event Type
    if (filterEventType !== 'all') {
      filtered = filtered.filter((rule) => rule.event_type === filterEventType);
    }

    // Channel
    if (filterChannel !== 'all') {
      filtered = filtered.filter((rule) => rule.channels.includes(filterChannel));
    }

    // Status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((rule) => rule.status === filterStatus);
    }

    // Scope
    if (filterScope !== 'all') {
      filtered = filtered.filter((rule) => rule.scope_type === filterScope);
    }

    // Role
    if (filterRole !== 'all') {
      filtered = filtered.filter((rule) => rule.recipient_roles.includes(filterRole));
    }

    setFilteredRules(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterEventType, filterChannel, filterStatus, filterScope, filterRole, rules]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterEventType('all');
    setFilterChannel('all');
    setFilterStatus('all');
    setFilterScope('all');
    setFilterRole('all');
    toast.success('Đã reset bộ lọc');
  };

  // Disable rule
  const handleDisableRule = (rule: NotificationRule) => {
    if (window.confirm(`Bạn có chắc chắn muốn vô hiệu hóa quy tắc "${rule.rule_name}"?`)) {
      setRules(
        rules.map((r) =>
          r.id === rule.id
            ? { ...r, status: 'Disabled' as RuleStatus, updated_at: new Date().toISOString() }
            : r
        )
      );
      toast.success('Đã vô hiệu hóa quy tắc');
    }
  };

  // Enable rule
  const handleEnableRule = (rule: NotificationRule) => {
    setRules(
      rules.map((r) =>
        r.id === rule.id
          ? { ...r, status: 'Active' as RuleStatus, updated_at: new Date().toISOString() }
          : r
      )
    );
    toast.success('Đã kích hoạt quy tắc');
  };

  // Export to Excel
  const handleExportExcel = () => {
    const result = exportRulesToExcel(filteredRules);
    if (result.success) {
      toast.success(`Đã xuất ${filteredRules.length} quy tắc ra file Excel`);
    } else {
      toast.error('Lỗi xuất file Excel');
    }
  };

  // Download template
  const handleDownloadTemplate = () => {
    setIsImportDropdownOpen(false);
    const result = downloadExcelTemplate();
    if (result.success) {
      toast.success('Đã tải file mẫu thành công');
    } else {
      toast.error('Lỗi tải file mẫu');
    }
  };

  // Import Excel
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImportDropdownOpen(false);

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.info('Đang xử lý file Excel...');

      const result = await parseExcelFile(file);

      if (result.success && result.data) {

        if (result.errors && result.errors.length > 0) {
          toast.warning(`${result.errors.length} lỗi/cảnh báo khi import`);
        }

        // TODO: Merge with existing rules (check for duplicates)
        const successCount = result.data.length;
        toast.success(`Đã nhập thành công ${successCount} quy tắc`);

        await fetchRules();
      } else {
        toast.error('Lỗi import file Excel');
        if (result.errors) {
          result.errors.forEach((err) => console.error(err));
        }
      }
    } catch (error) {
      console.error('❌ Import error:', error);
      toast.error('Lỗi nhập file Excel');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 size={32} className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Filters Card */}
      <div className={styles.filtersCard}>
        {/* Row 1: Search + Event Type + Channel */}
        <div className={styles.filtersRow} style={{ marginBottom: '12px' }}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select
            value={filterEventType}
            onChange={(e) => setFilterEventType(e.target.value as EventType | 'all')}
            className={styles.searchInput}
            style={{ width: '220px', minWidth: 'unset' }}
          >
            <option value="all">Tất cả loại sự kiện</option>
            {ALL_EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {getEventTypeLabel(type)}
              </option>
            ))}
          </select>

          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value as Channel | 'all')}
            className={styles.searchInput}
            style={{ width: '180px', minWidth: 'unset' }}
          >
            <option value="all">Tất cả kênh</option>
            {ALL_CHANNELS.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </select>
        </div>

        {/* Row 2: Status + Scope + Role + Actions */}
        <div className={styles.filtersRow}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as RuleStatus | 'all')}
            className={styles.searchInput}
            style={{ width: '180px', minWidth: 'unset' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Disabled">Vô hiệu</option>
          </select>

          <select
            value={filterScope}
            onChange={(e) => setFilterScope(e.target.value as ScopeType | 'all')}
            className={styles.searchInput}
            style={{ width: '200px', minWidth: 'unset' }}
          >
            <option value="all">Tất cả phạm vi</option>
            {ALL_SCOPE_TYPES.map((scope) => (
              <option key={scope} value={scope}>
                {getScopeTypeLabel(scope)}
              </option>
            ))}
          </select>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as RecipientRole | 'all')}
            className={styles.searchInput}
            style={{ width: '180px', minWidth: 'unset' }}
          >
            <option value="all">Tất cả vai trò</option>
            {ALL_RECIPIENT_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          {/* Actions */}
          <div className={styles.actionsGroup} style={{ marginLeft: 'auto' }}>
            <button onClick={handleResetFilters} className={styles.btnSecondary}>
              <RefreshCw size={18} />
              Reset
            </button>
            <button onClick={handleExportExcel} className={styles.btnSecondary}>
              <FileDown size={18} />
              Xuất Excel
            </button>

            {/* Import Dropdown */}
            <div className="importDropdown" style={{ position: 'relative', display: 'inline-block' }}>
              <button
                className={styles.btnSecondary}
                onClick={() => setIsImportDropdownOpen(!isImportDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Upload size={18} />
                Nhập dữ liệu
                <ChevronDown size={16} />
              </button>

              {isImportDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    right: 0,
                    minWidth: '200px',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md, 8px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-sm, 14px)',
                      color: 'var(--foreground)',
                      background: 'transparent',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Upload size={16} style={{ color: 'var(--muted-foreground)' }} />
                    Từ file Excel
                  </button>
                  <button
                    onClick={handleDownloadTemplate}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-sm, 14px)',
                      color: 'var(--foreground)',
                      background: 'transparent',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Download size={16} style={{ color: 'var(--muted-foreground)' }} />
                    Tải mẫu nhập liệu
                  </button>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
              style={{ display: 'none' }}
            />

            <button onClick={() => onOpenModal?.('add')} className={styles.btnPrimary}>
              <Plus size={18} />
              Thêm mới
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredRules.length === 0 ? (
        <div className={styles.emptyState}>
          <Bell size={48} style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }} />
          <p style={{ fontFamily: 'Inter, sans-serif' }}>
            {searchTerm || filterEventType !== 'all' || filterChannel !== 'all'
              ? 'Không tìm thấy quy tắc nào'
              : 'Chưa có quy tắc thông báo nào'}
          </p>
        </div>
      ) : (
        <>
          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '140px' }}>Mã Quy Tắc</th>
                    <th>Tên Quy Tắc</th>
                    <th style={{ width: '180px' }}>Loại Sự Kiện</th>
                    <th style={{ width: '200px' }}>Vai Trò Nhận</th>
                    <th style={{ width: '140px' }}>Phạm Vi</th>
                    <th style={{ width: '140px' }}>Kênh</th>
                    <th style={{ width: '120px' }}>Trạng Thái</th>
                    <th style={{ width: '100px' }}>Ưu Tiên</th>
                    <th style={{ width: '200px' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((rule) => (
                    <tr key={rule.id}>
                      <td>
                        <code
                          style={{
                            fontFamily: 'monospace',
                            fontSize: 'var(--text-sm)',
                            padding: '2px 6px',
                            background: 'var(--muted)',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          {rule.rule_code}
                        </code>
                      </td>
                      <td>
                        <div className={styles.nameCell}>
                          <span className={styles.nameText}>{rule.rule_name}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: 'var(--text-sm)',
                            }}
                          >
                            {getEventTypeLabel(rule.event_type)}
                          </span>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Info
                              size={14}
                              style={{ color: 'var(--muted-foreground)', cursor: 'help' }}
                              title={getEventTypeTooltip(rule.event_type)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--muted-foreground)',
                          }}
                        >
                          {formatRoles(rule.recipient_roles)}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-sm)',
                          }}
                        >
                          {getScopeTypeLabel(rule.scope_type)}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--muted-foreground)',
                          }}
                        >
                          {formatChannels(rule.channels)}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            background: getStatusBadgeStyle(rule.status).background,
                            color: getStatusBadgeStyle(rule.status).color,
                            fontSize: 'var(--text-sm)',
                            fontWeight: 500,
                            borderRadius: 'var(--radius)',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          {rule.status === 'Active' ? (
                            <CheckCircle size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {rule.status === 'Active' ? 'Hoạt động' : 'Vô hiệu'}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 10px',
                            background: getPriorityBadgeStyle(rule.priority).background,
                            color: getPriorityBadgeStyle(rule.priority).color,
                            fontSize: 'var(--text-sm)',
                            fontWeight: 500,
                            borderRadius: 'var(--radius)',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          {rule.priority}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.btnIcon}
                            onClick={() => onOpenModal?.('view', rule)}
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className={styles.btnIcon}
                            onClick={() => onOpenModal?.('edit', rule)}
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          {rule.status === 'Active' ? (
                            <button
                              className={styles.btnIcon}
                              onClick={() => handleDisableRule(rule)}
                              title="Vô hiệu hóa"
                              style={{ color: 'var(--destructive)' }}
                            >
                              <PowerOff size={18} />
                            </button>
                          ) : (
                            <button
                              className={styles.btnIcon}
                              onClick={() => handleEnableRule(rule)}
                              title="Kích hoạt"
                              style={{ color: 'var(--success)' }}
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}
    </div>
  );
};
