/**
 * System Audit Log Tab - MAPPA Portal
 * Nhật ký hệ thống - Desktop-first layout với drawer chi tiết
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Calendar,
  Filter,
  RefreshCw,
  X,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  User,
  Clock,
  Activity,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import styles from './SystemAuditLogTab.module.css';
import { toast } from 'sonner';
import { supabase } from '@/api/supabaseClient';

// ============================================
// TYPES
// ============================================

type EventStatus = 'success' | 'failed' | 'warning' | 'info';

interface AuditEvent {
  audit_events_id: string;
  audit_events_event_type: string;
  audit_events_user_id?: string;
  audit_events_user_email?: string;
  audit_events_status: EventStatus;
  audit_events_description: string;
  audit_events_timestamp: string;
  audit_events_ip_address?: string;
  audit_events_user_agent?: string;
  audit_events_request_method?: string;
  audit_events_request_path?: string;
  audit_events_response_code?: number;
  audit_events_duration_ms?: number;
  audit_events_metadata?: Record<string, any>;
  audit_events_context_log?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const SystemAuditLogTab: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEventType, setFilterEventType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const itemsPerPage = 50;

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchAuditEvents = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching audit events...');

      const { data, error } = await supabase
        .from('audit_events')
        .select('*, id:_id')
        .order('audit_events_timestamp', { ascending: false })
        .limit(10000); // Support up to 10000 audit events

      if (error) {
        console.error('❌ Error fetching audit events:', error);
        toast.error(`Lỗi tải dữ liệu: ${error.message}`);
        return;
      }

      console.log(`✅ Loaded ${data?.length || 0} audit events`);
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

  // Filtered events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.audit_events_id.toLowerCase().includes(term) ||
          event.audit_events_event_type.toLowerCase().includes(term) ||
          event.audit_events_description.toLowerCase().includes(term) ||
          event.audit_events_user_email?.toLowerCase().includes(term)
      );
    }

    // Filter by Event Type
    if (filterEventType !== 'all') {
      filtered = filtered.filter((e) => e.audit_events_event_type === filterEventType);
    }

    // Filter by Status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((e) => e.audit_events_status === filterStatus);
    }

    return filtered;
  }, [events, searchTerm, filterEventType, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentItems = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============================================
  // HANDLERS
  // ============================================

  const handleRowClick = (event: AuditEvent) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const handleRefresh = () => {
    toast.info('Đang làm mới dữ liệu...');
    fetchAuditEvents();
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

  const getStatusBadge = (status: EventStatus) => {
    const styles_map = {
      success: { bg: '#d4edda', color: '#155724', label: 'SUCCESS' },
      failed: { bg: '#f8d7da', color: '#721c24', label: 'FAILED' },
      warning: { bg: '#fff3cd', color: '#856404', label: 'WARNING' },
      info: { bg: '#d1ecf1', color: '#0c5460', label: 'INFO' },
    };
    return styles_map[status];
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FileText className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Nhật ký Hệ thống</h1>
            <p className={styles.subtitle}>
              Audit events và system logs • {filteredEvents.length.toLocaleString()} events
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
            placeholder="Tìm theo ID, Event Type, Description, User..."
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
          value={filterEventType}
          onChange={(e) => setFilterEventType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Event Types</option>
          {uniqueEventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </div>

      {/* Full-width Table */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Đang tải audit logs...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className={styles.emptyState}>
          <FileText size={64} />
          <p>Không tìm thấy audit events</p>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th style={{ width: '180px' }}>Timestamp</th>
                  <th style={{ width: '200px' }}>Event Type</th>
                  <th style={{ width: '200px' }}>User</th>
                  <th style={{ width: '120px' }}>Status</th>
                  <th>Description</th>
                  <th style={{ width: '100px' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((event) => {
                  const statusBadge = getStatusBadge(event.audit_events_status);
                  return (
                    <tr
                      key={event.audit_events_id}
                      className={styles.tableRow}
                      onClick={() => handleRowClick(event)}
                    >
                      <td className={styles.timestampCell}>
                        <Clock size={14} />
                        {formatDateTime(event.audit_events_timestamp)}
                      </td>
                      <td>
                        <code className={styles.eventTypeCode}>
                          {event.audit_events_event_type}
                        </code>
                      </td>
                      <td className={styles.userCell}>
                        {event.audit_events_user_email ? (
                          <>
                            <User size={14} />
                            {event.audit_events_user_email}
                          </>
                        ) : (
                          <span className={styles.mutedText}>System</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{ background: statusBadge.bg, color: statusBadge.color }}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className={styles.descriptionCell}>{event.audit_events_description}</td>
                      <td className={styles.durationCell}>
                        {event.audit_events_duration_ms !== undefined && (
                          <span className={styles.durationBadge}>
                            {event.audit_events_duration_ms}ms
                          </span>
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
                {Math.min(currentPage * itemsPerPage, filteredEvents.length)} của{' '}
                {filteredEvents.length.toLocaleString()} events
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

      {/* Drawer (Slide from Right) */}
      {drawerOpen && selectedEvent && (
        <>
          <div className={styles.drawerOverlay} onClick={closeDrawer} />
          <div className={styles.drawer}>
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <div>
                <h2 className={styles.drawerTitle}>Audit Event Details</h2>
                <p className={styles.drawerSubtitle}>
                  {formatDateTime(selectedEvent.audit_events_timestamp)}
                </p>
              </div>
              <button className={styles.drawerCloseBtn} onClick={closeDrawer}>
                <X size={24} />
              </button>
            </div>

            {/* Drawer Content (2-Column Layout) */}
            <div className={styles.drawerContent}>
              {/* Left Column: Main Info */}
              <div className={styles.drawerColumn}>
                <h3 className={styles.drawerColumnTitle}>Primary Information</h3>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>Event ID</label>
                    <div className={styles.infoValueWithCopy}>
                      <code className={styles.infoCode}>
                        {selectedEvent.audit_events_id}
                      </code>
                      <button
                        className={styles.copyBtn}
                        onClick={() =>
                          handleCopy(selectedEvent.audit_events_id, 'Event ID')
                        }
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>Event Type</label>
                    <div className={styles.infoValueWithCopy}>
                      <code className={styles.infoCode}>
                        {selectedEvent.audit_events_event_type}
                      </code>
                      <button
                        className={styles.copyBtn}
                        onClick={() =>
                          handleCopy(selectedEvent.audit_events_event_type, 'Event Type')
                        }
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>Status</label>
                    <span
                      className={styles.statusBadgeLarge}
                      style={{
                        ...getStatusBadge(selectedEvent.audit_events_status),
                        background: getStatusBadge(selectedEvent.audit_events_status).bg,
                        color: getStatusBadge(selectedEvent.audit_events_status).color,
                      }}
                    >
                      {getStatusBadge(selectedEvent.audit_events_status).label}
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>User</label>
                    <div className={styles.infoValue}>
                      {selectedEvent.audit_events_user_email || 'System'}
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <label className={styles.infoLabel}>Description</label>
                    <div className={styles.infoValue}>
                      {selectedEvent.audit_events_description}
                    </div>
                  </div>

                  {selectedEvent.audit_events_ip_address && (
                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel}>IP Address</label>
                      <div className={styles.infoValue}>
                        {selectedEvent.audit_events_ip_address}
                      </div>
                    </div>
                  )}

                  {selectedEvent.audit_events_request_method && (
                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel}>Request</label>
                      <div className={styles.infoValue}>
                        <code>
                          {selectedEvent.audit_events_request_method}{' '}
                          {selectedEvent.audit_events_request_path}
                        </code>
                      </div>
                    </div>
                  )}

                  {selectedEvent.audit_events_response_code !== undefined && (
                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel}>Response Code</label>
                      <span
                        className={styles.responseCodeBadge}
                        style={{
                          color:
                            selectedEvent.audit_events_response_code < 300
                              ? '#155724'
                              : selectedEvent.audit_events_response_code < 400
                              ? '#0c5460'
                              : '#721c24',
                        }}
                      >
                        {selectedEvent.audit_events_response_code}
                      </span>
                    </div>
                  )}

                  {selectedEvent.audit_events_duration_ms !== undefined && (
                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel}>Duration</label>
                      <div className={styles.infoValue}>
                        {selectedEvent.audit_events_duration_ms}ms
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Context Log */}
              <div className={styles.drawerColumn}>
                <h3 className={styles.drawerColumnTitle}>Context Log</h3>

                {selectedEvent.audit_events_context_log ? (
                  <pre className={styles.contextLog}>
                    {selectedEvent.audit_events_context_log}
                  </pre>
                ) : (
                  <div className={styles.noContextLog}>
                    <Info size={32} />
                    <p>No context log available</p>
                  </div>
                )}

                {selectedEvent.audit_events_metadata && (
                  <>
                    <h3 className={styles.drawerColumnTitle} style={{ marginTop: '24px' }}>
                      Metadata
                    </h3>
                    <pre className={styles.metadataJson}>
                      {JSON.stringify(selectedEvent.audit_events_metadata, null, 2)}
                    </pre>
                  </>
                )}

                {selectedEvent.audit_events_user_agent && (
                  <>
                    <h3 className={styles.drawerColumnTitle} style={{ marginTop: '24px' }}>
                      User Agent
                    </h3>
                    <div className={styles.userAgent}>
                      {selectedEvent.audit_events_user_agent}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
