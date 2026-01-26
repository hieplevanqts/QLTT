/**
 * Data Changes Tab - MAPPA Portal
 * Biến động dữ liệu - Split-view diff viewer với breadcrumb
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  GitCompare,
  Search,
  RefreshCw,
  X,
  ChevronRight,
  ChevronDown,
  Copy,
  User,
  Clock,
  Database,
  FileText,
  Loader2,
  ChevronLeft,
  Home,
} from 'lucide-react';
import styles from './DataChangesTab.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// ============================================
// TYPES
// ============================================

type ChangeEventType = 'CREATE' | 'UPDATE' | 'DELETE';

interface DataChange {
  data_change_id: string;
  data_change_entity_type: string;
  data_change_entity_id: string;
  data_change_event_type: ChangeEventType;
  data_change_user_id?: string;
  data_change_user_email?: string;
  data_change_timestamp: string;
  data_change_before?: Record<string, any>;
  data_change_after?: Record<string, any>;
  data_change_changed_fields?: string[];
}

// ============================================
// MAIN COMPONENT
// ============================================

export const DataChangesTab: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState<DataChange[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntityType, setFilterEntityType] = useState<string>('all');
  const [filterEventType, setFilterEventType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChange, setSelectedChange] = useState<DataChange | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const itemsPerPage = 30;

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchDataChanges = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('data_changes')
        .select('*, id:_id')
        .order('data_change_timestamp', { ascending: false })
        .limit(500);

      if (error) {
        console.error('❌ Error fetching data changes:', error);
        toast.error(`Lỗi tải dữ liệu: ${error.message}`);
        return;
      }

      setChanges(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Lỗi kết nối cơ sở dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataChanges();
  }, []);

  // ============================================
  // FILTERING & PAGINATION
  // ============================================

  const uniqueEntityTypes = useMemo(() => {
    const types = new Set(changes.map((c) => c.data_change_entity_type));
    return Array.from(types).sort();
  }, [changes]);

  const filteredChanges = useMemo(() => {
    let filtered = [...changes];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (change) =>
          change.data_change_entity_id.toLowerCase().includes(term) ||
          change.data_change_entity_type.toLowerCase().includes(term) ||
          change.data_change_user_email?.toLowerCase().includes(term)
      );
    }

    if (filterEntityType !== 'all') {
      filtered = filtered.filter((c) => c.data_change_entity_type === filterEntityType);
    }

    if (filterEventType !== 'all') {
      filtered = filtered.filter((c) => c.data_change_event_type === filterEventType);
    }

    return filtered;
  }, [changes, searchTerm, filterEntityType, filterEventType]);

  const totalPages = Math.ceil(filteredChanges.length / itemsPerPage);
  const currentItems = filteredChanges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============================================
  // HANDLERS
  // ============================================

  const handleRowClick = (change: DataChange) => {
    setSelectedChange(change);
    setDrawerOpen(true);
    // Auto-expand all fields initially
    if (change.data_change_changed_fields) {
      setExpandedFields(new Set(change.data_change_changed_fields));
    } else {
      const allFields = new Set([
        ...Object.keys(change.data_change_before || {}),
        ...Object.keys(change.data_change_after || {}),
      ]);
      setExpandedFields(allFields);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedChange(null);
      setExpandedFields(new Set());
    }, 300);
  };

  const toggleField = (fieldName: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldName)) {
      newExpanded.delete(fieldName);
    } else {
      newExpanded.add(fieldName);
    }
    setExpandedFields(newExpanded);
  };

  const handleRefresh = () => {
    toast.info('Đang làm mới dữ liệu...');
    fetchDataChanges();
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã copy ${label}`);
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

  const getEventTypeBadge = (eventType: ChangeEventType) => {
    const styles_map = {
      CREATE: { bg: '#d4edda', color: '#155724', label: 'CREATE' },
      UPDATE: { bg: '#fff3cd', color: '#856404', label: 'UPDATE' },
      DELETE: { bg: '#f8d7da', color: '#721c24', label: 'DELETE' },
    };
    return styles_map[eventType];
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const isValueChanged = (
    fieldName: string,
    before?: Record<string, any>,
    after?: Record<string, any>
  ): boolean => {
    const beforeVal = before?.[fieldName];
    const afterVal = after?.[fieldName];
    return JSON.stringify(beforeVal) !== JSON.stringify(afterVal);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <GitCompare className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Biến động Dữ liệu</h1>
            <p className={styles.subtitle}>
              Theo dõi tất cả thay đổi dữ liệu trong hệ thống • {filteredChanges.length.toLocaleString()} changes
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

      {/* Inline Filter Toolbar */}
      <div className={styles.filterToolbar}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm theo Entity ID, Entity Type, User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              className={styles.searchClear}
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          value={filterEntityType}
          onChange={(e) => setFilterEntityType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Entity Types</option>
          {uniqueEntityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={filterEventType}
          onChange={(e) => setFilterEventType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Event Types</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {/* Minimalist Table */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Đang tải data changes...</p>
        </div>
      ) : filteredChanges.length === 0 ? (
        <div className={styles.emptyState}>
          <GitCompare size={64} />
          <p>Không tìm thấy data changes</p>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th style={{ width: '180px' }}>Timestamp</th>
                  <th style={{ width: '180px' }}>Entity Type</th>
                  <th style={{ width: '120px' }}>Event Type</th>
                  <th style={{ width: '200px' }}>Entity ID</th>
                  <th style={{ width: '200px' }}>User</th>
                  <th>Changed Fields</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((change) => {
                  const eventBadge = getEventTypeBadge(change.data_change_event_type);
                  return (
                    <tr
                      key={change.data_change_id}
                      className={styles.tableRow}
                      onClick={() => handleRowClick(change)}
                    >
                      <td className={styles.timestampCell}>
                        <Clock size={14} />
                        {formatDateTime(change.data_change_timestamp)}
                      </td>
                      <td>
                        <span className={styles.entityTypeBadge}>
                          <Database size={14} />
                          {change.data_change_entity_type}
                        </span>
                      </td>
                      <td>
                        <span
                          className={styles.eventTypeBadge}
                          style={{ background: eventBadge.bg, color: eventBadge.color }}
                        >
                          {eventBadge.label}
                        </span>
                      </td>
                      <td>
                        <code className={styles.entityIdCode}>
                          {change.data_change_entity_id.slice(0, 16)}...
                        </code>
                      </td>
                      <td className={styles.userCell}>
                        {change.data_change_user_email ? (
                          <>
                            <User size={14} />
                            {change.data_change_user_email}
                          </>
                        ) : (
                          <span className={styles.mutedText}>System</span>
                        )}
                      </td>
                      <td>
                        {change.data_change_changed_fields && (
                          <div className={styles.changedFieldsList}>
                            {change.data_change_changed_fields.slice(0, 3).map((field) => (
                              <span key={field} className={styles.fieldChip}>
                                {field}
                              </span>
                            ))}
                            {change.data_change_changed_fields.length > 3 && (
                              <span className={styles.fieldChipMore}>
                                +{change.data_change_changed_fields.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <div className={styles.paginationLeft}>
              <span className={styles.paginationText}>
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredChanges.length)} của{' '}
                {filteredChanges.length.toLocaleString()} changes
              </span>
            </div>
            <div className={styles.paginationRight}>
              <button
                className={styles.pageButton}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Trước
              </button>
              <span className={styles.pageInfo}>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className={styles.pageButton}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Drawer with Breadcrumb & Split-View Diff */}
      {drawerOpen && selectedChange && (
        <>
          <div className={styles.drawerOverlay} onClick={closeDrawer} />
          <div className={styles.drawer}>
            {/* Breadcrumb Header */}
            <div className={styles.drawerHeader}>
              <div className={styles.breadcrumb}>
                <Home size={16} />
                <ChevronRight size={14} className={styles.breadcrumbSeparator} />
                <span className={styles.breadcrumbItem}>
                  {selectedChange.data_change_entity_type}
                </span>
                <ChevronRight size={14} className={styles.breadcrumbSeparator} />
                <span className={styles.breadcrumbItemActive}>
                  {selectedChange.data_change_entity_id.slice(0, 8)}...
                </span>
                <ChevronRight size={14} className={styles.breadcrumbSeparator} />
                <span
                  className={styles.breadcrumbEventType}
                  style={getEventTypeBadge(selectedChange.data_change_event_type)}
                >
                  {selectedChange.data_change_event_type}
                </span>
              </div>
              <button className={styles.drawerCloseBtn} onClick={closeDrawer}>
                <X size={24} />
              </button>
            </div>

            {/* Metadata Row */}
            <div className={styles.metadataRow}>
              <div className={styles.metadataItem}>
                <Clock size={16} />
                <span>{formatDateTime(selectedChange.data_change_timestamp)}</span>
              </div>
              <div className={styles.metadataItem}>
                <User size={16} />
                <span>{selectedChange.data_change_user_email || 'System'}</span>
              </div>
              <div className={styles.metadataItem}>
                <FileText size={16} />
                <span>{selectedChange.data_change_changed_fields?.length || 0} fields changed</span>
              </div>
            </div>

            {/* Split-View Diff */}
            <div className={styles.splitViewContainer}>
              <div className={styles.splitViewHeader}>
                <div className={styles.splitViewColumnHeader} style={{ background: '#fef2f2' }}>
                  <span className={styles.splitViewLabel}>BEFORE (Old)</span>
                </div>
                <div className={styles.splitViewColumnHeader} style={{ background: '#f0fdf4' }}>
                  <span className={styles.splitViewLabel}>AFTER (New)</span>
                </div>
              </div>

              <div className={styles.splitViewContent}>
                {/* All Fields */}
                {Array.from(
                  new Set([
                    ...Object.keys(selectedChange.data_change_before || {}),
                    ...Object.keys(selectedChange.data_change_after || {}),
                  ])
                )
                  .sort()
                  .map((fieldName) => {
                    const isChanged = isValueChanged(
                      fieldName,
                      selectedChange.data_change_before,
                      selectedChange.data_change_after
                    );
                    const isExpanded = expandedFields.has(fieldName);
                    const beforeValue = selectedChange.data_change_before?.[fieldName];
                    const afterValue = selectedChange.data_change_after?.[fieldName];

                    return (
                      <div
                        key={fieldName}
                        className={`${styles.diffRow} ${isChanged ? styles.diffRowChanged : ''}`}
                      >
                        {/* Field Header */}
                        <div
                          className={styles.diffFieldHeader}
                          onClick={() => toggleField(fieldName)}
                        >
                          <div className={styles.diffFieldName}>
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                            <code>{fieldName}</code>
                            {isChanged && <span className={styles.changedIndicator}>CHANGED</span>}
                          </div>
                          <button
                            className={styles.copyBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(fieldName, 'Field name');
                            }}
                          >
                            <Copy size={14} />
                          </button>
                        </div>

                        {/* Split View Values */}
                        {isExpanded && (
                          <div className={styles.diffFieldValues}>
                            <div
                              className={styles.diffValueColumn}
                              style={{
                                background: isChanged ? '#fef2f2' : '#fafafa',
                                borderLeft: isChanged ? '3px solid #dc2626' : '3px solid #e5e7eb',
                              }}
                            >
                              <pre className={styles.diffValuePre}>
                                {formatValue(beforeValue)}
                              </pre>
                            </div>
                            <div
                              className={styles.diffValueColumn}
                              style={{
                                background: isChanged ? '#f0fdf4' : '#fafafa',
                                borderLeft: isChanged ? '3px solid #15803d' : '3px solid #e5e7eb',
                              }}
                            >
                              <pre className={styles.diffValuePre}>
                                {formatValue(afterValue)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
