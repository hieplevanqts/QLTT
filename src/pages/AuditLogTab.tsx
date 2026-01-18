/**
 * Audit Log Tab - MAPPA Portal
 * Nhật ký hệ thống phục vụ audit bảo mật
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  Loader2,
  Activity,
  Clock,
} from 'lucide-react';
import styles from './AuditLogTab.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// ============================================
// TYPES
// ============================================

interface AuditEvent {
  audit_events_id: string;
  audit_events_event_type: string;
  audit_events_actor_user_id: string;
  audit_events_entity_type: string;
  audit_events_outcome: 'success' | 'failed';
  audit_events_timestamp: string;
  audit_events_context_json?: any;
  audit_events_details_redacted_json?: any;
}

// ============================================
// DRAWER COMPONENT
// ============================================

interface AuditLogDrawerProps {
  event: AuditEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.drawerBackdrop} onClick={onClose} />

      {/* Drawer */}
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div>
            <h2 className={styles.drawerTitle}>Chi tiết Audit Log</h2>
            <p className={styles.drawerSubtitle}>#{event.audit_events_id}</p>
          </div>
          <button onClick={onClose} className={styles.drawerClose}>
            <XCircle size={24} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.drawerBody}>
          {/* Event Info */}
          <div className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Thông tin sự kiện</h3>
            <div className={styles.drawerInfoGrid}>
              <div className={styles.drawerInfoItem}>
                <label>Event Type</label>
                <span>{event.audit_events_event_type}</span>
              </div>
              <div className={styles.drawerInfoItem}>
                <label>Actor User ID</label>
                <span>{event.audit_events_actor_user_id}</span>
              </div>
              <div className={styles.drawerInfoItem}>
                <label>Entity Type</label>
                <span>{event.audit_events_entity_type}</span>
              </div>
              <div className={styles.drawerInfoItem}>
                <label>Outcome</label>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: event.audit_events_outcome === 'success' ? '#d4edda' : '#f8d7da',
                    color: event.audit_events_outcome === 'success' ? '#155724' : '#721c24',
                  }}
                >
                  {event.audit_events_outcome === 'success' ? '✓ Success' : '✗ Failed'}
                </span>
              </div>
              <div className={styles.drawerInfoItem}>
                <label>Timestamp</label>
                <span>{new Date(event.audit_events_timestamp).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>

          {/* Context JSON */}
          {event.audit_events_context_json && (
            <div className={styles.drawerSection}>
              <h3 className={styles.drawerSectionTitle}>Context JSON</h3>
              <pre className={styles.jsonViewer}>
                {JSON.stringify(event.audit_events_context_json, null, 2)}
              </pre>
            </div>
          )}

          {/* Details Redacted JSON */}
          {event.audit_events_details_redacted_json && (
            <div className={styles.drawerSection}>
              <h3 className={styles.drawerSectionTitle}>Details (Redacted) JSON</h3>
              <pre className={styles.jsonViewer}>
                {JSON.stringify(event.audit_events_details_redacted_json, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const AuditLogTab: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEventType, setFilterEventType] = useState<string>('all');
  const [filterActorUserId, setFilterActorUserId] = useState<string>('all');
  const [filterOutcome, setFilterOutcome] = useState<'all' | 'success' | 'failed'>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchAuditEvents = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('audit_events')
        .select('*')
        .order('audit_events_timestamp', { ascending: false });

      if (error) {
        console.error('❌ Error fetching audit events:', error);
        toast.error(`Lỗi tải dữ liệu: ${error.message}`);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Lỗi kết nối cơ sở dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditEvents();
  }, []);

  // ============================================
  // FILTERING & PAGINATION
  // ============================================

  // Unique values for filters
  const uniqueEventTypes = useMemo(() => {
    const types = new Set(events.map((e) => e.audit_events_event_type));
    return Array.from(types).sort();
  }, [events]);

  const uniqueActorUserIds = useMemo(() => {
    const actors = new Set(events.map((e) => e.audit_events_actor_user_id));
    return Array.from(actors).sort();
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Search by ID or Event Type
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.audit_events_id.toLowerCase().includes(term) ||
          event.audit_events_event_type.toLowerCase().includes(term)
      );
    }

    // Filter by Event Type
    if (filterEventType !== 'all') {
      filtered = filtered.filter((e) => e.audit_events_event_type === filterEventType);
    }

    // Filter by Actor User ID
    if (filterActorUserId !== 'all') {
      filtered = filtered.filter((e) => e.audit_events_actor_user_id === filterActorUserId);
    }

    // Filter by Outcome
    if (filterOutcome !== 'all') {
      filtered = filtered.filter((e) => e.audit_events_outcome === filterOutcome);
    }

    // Filter by Date Range
    if (filterDateFrom) {
      const fromDate = new Date(filterDateFrom);
      filtered = filtered.filter((e) => new Date(e.audit_events_timestamp) >= fromDate);
    }
    if (filterDateTo) {
      const toDate = new Date(filterDateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((e) => new Date(e.audit_events_timestamp) <= toDate);
    }

    return filtered;
  }, [events, searchTerm, filterEventType, filterActorUserId, filterOutcome, filterDateFrom, filterDateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentItems = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============================================
  // HANDLERS
  // ============================================

  const toggleEvent = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const handleViewDetails = (event: AuditEvent) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const handleRefresh = () => {
    toast.info('Đang làm mới dữ liệu...');
    fetchAuditEvents();
  };

  const handleExport = () => {
    toast.info('Tính năng xuất dữ liệu đang được phát triển');
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

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Shield className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Nhật ký Hệ thống</h1>
            <p className={styles.subtitle}>
              Audit logs và security events cho hệ thống MAPPA Portal
            </p>
          </div>
        </div>
      </div>

      {/* Filters + Actions Row */}
      <div className={styles.filterActionsRow}>
        <div className={styles.filterGroup}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo Event ID hoặc Event Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Event Type Filter */}
          <select
            value={filterEventType}
            onChange={(e) => setFilterEventType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Tất cả Event Types</option>
            {uniqueEventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Actor User ID Filter */}
          <select
            value={filterActorUserId}
            onChange={(e) => setFilterActorUserId(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Tất cả Users</option>
            {uniqueActorUserIds.map((actor) => (
              <option key={actor} value={actor}>
                {actor}
              </option>
            ))}
          </select>

          {/* Outcome Filter */}
          <select
            value={filterOutcome}
            onChange={(e) => setFilterOutcome(e.target.value as 'all' | 'success' | 'failed')}
            className={styles.filterSelect}
          >
            <option value="all">Tất cả Outcomes</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className={styles.actionGroup}>
          <button onClick={handleRefresh} className={styles.btnSecondary}>
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button onClick={handleExport} className={styles.btnSecondary}>
            <Download size={16} />
            Xuất Log
          </button>
        </div>
      </div>

      {/* Date Range Filter Row */}
      <div className={styles.dateRangeRow}>
        <Calendar size={18} style={{ color: 'var(--muted-foreground)' }} />
        <span className={styles.dateRangeLabel}>Khoảng thời gian:</span>
        <input
          type="date"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          className={styles.dateInput}
        />
        <span style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>→</span>
        <input
          type="date"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          className={styles.dateInput}
        />
        {(filterDateFrom || filterDateTo) && (
          <button
            onClick={() => {
              setFilterDateFrom('');
              setFilterDateTo('');
              toast.success('Đã xóa bộ lọc thời gian');
            }}
            className={styles.btnClear}
          >
            <XCircle size={16} />
            Xóa
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <FileText className={styles.statIcon} />
            <span className={styles.statLabel}>Tổng Events</span>
          </div>
          <div className={styles.statValue}>{events.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <CheckCircle className={styles.statIcon} />
            <span className={styles.statLabel}>Success</span>
          </div>
          <div className={styles.statValue}>
            {events.filter((e) => e.audit_events_outcome === 'success').length}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <XCircle className={styles.statIcon} />
            <span className={styles.statLabel}>Failed</span>
          </div>
          <div className={styles.statValue}>
            {events.filter((e) => e.audit_events_outcome === 'failed').length}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <User className={styles.statIcon} />
            <span className={styles.statLabel}>Unique Users</span>
          </div>
          <div className={styles.statValue}>{uniqueActorUserIds.length}</div>
        </div>
      </div>

      {/* Events List (Accordion) */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Đang tải audit logs...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className={styles.emptyState}>
          <Shield size={64} />
          <p>Không tìm thấy audit event nào</p>
        </div>
      ) : (
        <>
          <div className={styles.modulesList}>
            {currentItems.map((event) => {
              const isExpanded = expandedEvents.has(event.audit_events_id);

              return (
                <div key={event.audit_events_id} className={styles.moduleCard}>
                  {/* Event Header */}
                  <div className={styles.moduleHeader}>
                    <button
                      className={styles.moduleToggle}
                      onClick={() => toggleEvent(event.audit_events_id)}
                    >
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>

                    <div className={styles.moduleInfo}>
                      <div className={styles.moduleNameRow}>
                        <h3 className={styles.moduleName}>{event.audit_events_event_type}</h3>
                        <code className={styles.moduleCode}>#{event.audit_events_id.slice(0, 8)}</code>
                      </div>
                      <p className={styles.moduleDescription}>
                        <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {event.audit_events_actor_user_id} • {event.audit_events_entity_type}
                      </p>
                    </div>

                    <div className={styles.moduleMeta}>
                      <span className={styles.timestamp}>
                        <Clock size={14} />
                        {formatDateTime(event.audit_events_timestamp)}
                      </span>
                    </div>

                    <div className={styles.moduleMeta}>
                      <span
                        className={styles.outcomeBadge}
                        style={{
                          background: event.audit_events_outcome === 'success' ? '#d4edda' : '#f8d7da',
                          color: event.audit_events_outcome === 'success' ? '#155724' : '#721c24',
                        }}
                      >
                        {event.audit_events_outcome === 'success' ? (
                          <>
                            <CheckCircle size={14} /> Success
                          </>
                        ) : (
                          <>
                            <XCircle size={14} /> Failed
                          </>
                        )}
                      </span>
                    </div>

                    <div className={styles.moduleActions}>
                      <button
                        className={styles.btnIconEdit}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(event);
                        }}
                        title="Xem chi tiết JSON"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Event Details (Expanded) */}
                  {isExpanded && (
                    <div className={styles.permissionsTable}>
                      <div className={styles.permissionsTableHeader}>
                        <h4 className={styles.permissionsTableTitle}>Thông tin chi tiết</h4>
                      </div>

                      <table className={styles.table}>
                        <tbody>
                          <tr>
                            <th style={{ width: '200px' }}>Event ID</th>
                            <td>
                              <code style={{ fontSize: '13px', color: '#666' }}>
                                {event.audit_events_id}
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <th>Event Type</th>
                            <td>
                              <span
                                style={{
                                  padding: '4px 10px',
                                  background: 'rgba(0, 92, 182, 0.1)',
                                  color: '#005cb6',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                }}
                              >
                                {event.audit_events_event_type}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th>Actor User ID</th>
                            <td>{event.audit_events_actor_user_id}</td>
                          </tr>
                          <tr>
                            <th>Entity Type</th>
                            <td>{event.audit_events_entity_type}</td>
                          </tr>
                          <tr>
                            <th>Outcome</th>
                            <td>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 12px',
                                  borderRadius: '12px',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  background: event.audit_events_outcome === 'success' ? '#d4edda' : '#f8d7da',
                                  color: event.audit_events_outcome === 'success' ? '#155724' : '#721c24',
                                }}
                              >
                                {event.audit_events_outcome === 'success' ? (
                                  <>
                                    <CheckCircle size={14} /> Success
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={14} /> Failed
                                  </>
                                )}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th>Timestamp</th>
                            <td>{formatDateTime(event.audit_events_timestamp)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer with Pagination */}
          <div className={styles.footer}>
            <div className={styles.footerLeft}>
              <span className={styles.footerText}>
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredEvents.length)} của {filteredEvents.length} events
              </span>
            </div>
            <div className={styles.footerRight}>
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Trước
                </button>
                <span className={styles.pageInfo}>
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  className={styles.pageButton}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau →
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Drawer */}
      <AuditLogDrawer event={selectedEvent} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};
