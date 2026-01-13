import React, { useState } from 'react';
import { Eye, EyeOff, Star, AlertTriangle, TrendingUp, Building2, MapPin, Clock, Filter, Search } from 'lucide-react';
import styles from './WatchlistPanel.module.css';

export interface WatchlistItem {
  id: string;
  type: 'store' | 'lead' | 'location';
  name: string;
  code?: string;
  reason: string;
  addedAt: string;
  addedBy: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'alert' | 'resolved';
  riskScore?: number;
  location?: string;
  lastActivity?: string;
  alertCount?: number;
}

interface WatchlistPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: WatchlistItem[];
  onRemoveItem: (id: string) => void;
  onViewDetails: (item: WatchlistItem) => void;
}

export function WatchlistPanel({ isOpen, onClose, items, onRemoveItem, onViewDetails }: WatchlistPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'store' | 'lead' | 'location'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'alert' | 'resolved'>('all');

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'store': return <Building2 size={16} />;
      case 'lead': return <AlertTriangle size={16} />;
      case 'location': return <MapPin size={16} />;
      default: return <Eye size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'store': return 'Cơ sở';
      case 'lead': return 'Lead';
      case 'location': return 'Địa điểm';
      default: return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--destructive)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--muted-foreground)';
      default: return 'var(--foreground)';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'alert':
        return <span className={`${styles.statusBadge} ${styles.statusAlert}`}>Cảnh báo</span>;
      case 'active':
        return <span className={`${styles.statusBadge} ${styles.statusActive}`}>Đang theo dõi</span>;
      case 'resolved':
        return <span className={`${styles.statusBadge} ${styles.statusResolved}`}>Đã xử lý</span>;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Star size={20} fill="var(--primary)" color="var(--primary)" />
            <h2>Theo dõi đặc biệt</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <EyeOff size={20} />
          </button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{items.length}</div>
            <div className={styles.statLabel}>Tổng số</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: 'var(--destructive)' }}>
              {items.filter(i => i.status === 'alert').length}
            </div>
            <div className={styles.statLabel}>Cảnh báo</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: 'var(--success)' }}>
              {items.filter(i => i.status === 'active').length}
            </div>
            <div className={styles.statLabel}>Hoạt động</div>
          </div>
        </div>

        {/* Search */}
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter size={14} />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as any)}
              className={styles.filterSelect}
            >
              <option value="all">Loại</option>
              <option value="store">Cơ sở</option>
              <option value="lead">Lead</option>
              <option value="location">Địa điểm</option>
            </select>
          </div>

          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className={styles.filterSelect}
          >
            <option value="all">Mức độ</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={styles.filterSelect}
          >
            <option value="all">Trạng thái</option>
            <option value="alert">Cảnh báo</option>
            <option value="active">Hoạt động</option>
            <option value="resolved">Đã xử lý</option>
          </select>
        </div>

        {/* Items List */}
        <div className={styles.itemsList}>
          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <Eye size={48} style={{ opacity: 0.3 }} />
              <p>Không có mục nào trong danh sách theo dõi</p>
              <p className={styles.emptyHint}>
                {searchQuery || filterType !== 'all' || filterPriority !== 'all' || filterStatus !== 'all'
                  ? 'Thử điều chỉnh bộ lọc'
                  : 'Thêm mục để theo dõi đặc biệt'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className={styles.watchlistItem}>
                {/* Header */}
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitleRow}>
                    <div className={styles.itemType}>
                      {getTypeIcon(item.type)}
                      <span>{getTypeLabel(item.type)}</span>
                    </div>
                    <div className={styles.itemPriority} style={{ color: getPriorityColor(item.priority) }}>
                      <Star size={12} fill={item.priority === 'high' ? getPriorityColor(item.priority) : 'none'} />
                      {item.priority === 'high' && 'Cao'}
                      {item.priority === 'medium' && 'TB'}
                      {item.priority === 'low' && 'Thấp'}
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Content */}
                <div className={styles.itemContent}>
                  <div className={styles.itemName}>{item.name}</div>
                  {item.code && <div className={styles.itemCode}>{item.code}</div>}
                  <div className={styles.itemReason}>{item.reason}</div>
                  
                  {item.riskScore !== undefined && (
                    <div className={styles.itemMeta}>
                      <TrendingUp size={14} />
                      <span>Risk Score: <strong>{item.riskScore}</strong></span>
                    </div>
                  )}
                  
                  {item.location && (
                    <div className={styles.itemMeta}>
                      <MapPin size={14} />
                      <span>{item.location}</span>
                    </div>
                  )}

                  {item.alertCount !== undefined && item.alertCount > 0 && (
                    <div className={styles.itemAlert}>
                      <AlertTriangle size={14} />
                      <span>{item.alertCount} cảnh báo mới</span>
                    </div>
                  )}

                  <div className={styles.itemFooter}>
                    <div className={styles.itemTime}>
                      <Clock size={12} />
                      Thêm: {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                    </div>
                    {item.lastActivity && (
                      <div className={styles.itemTime}>
                        Hoạt động: {new Date(item.lastActivity).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.itemActions}>
                  <button 
                    className={styles.viewButton}
                    onClick={() => onViewDetails(item)}
                  >
                    Chi tiết
                  </button>
                  <button 
                    className={styles.removeButton}
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <EyeOff size={14} />
                    Bỏ theo dõi
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}