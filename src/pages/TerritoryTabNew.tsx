import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Map,
  Building2,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Check,
  XCircle,
  ChevronDown,
  User,
  RefreshCw,
} from 'lucide-react';
import styles from './TerritoryTab.module.css';
import { Pagination } from '../components/Pagination';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner';

// ==================== INTERFACES ====================
interface Area {
  id: string;
  code: string;
  name: string;
  level?: string; // Can be null
  provinceId?: string;
  wardId?: string;
  managerId?: string;
  description?: string;
  status: number; // 1: Active, 0: Inactive
  provinceName?: string; // Joined from provinces table
  provinceCode?: string;
  wardName?: string; // Joined from wards table
  wardCode?: string;
  managerName?: string; // Joined from users table (full_name)
  managerEmail?: string;
  userCount?: number;
  createdat?: string;
  updatedat?: string;
}

interface TerritoryTabProps {
  territories?: Area[];
  onOpenModal: (type: any, item?: any) => void;
}

export const TerritoryTabNew: React.FC<TerritoryTabProps> = ({ 
  onOpenModal 
}) => {
  const [territories, setTerritories] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Fetch areas from API
  const fetchAreas = async () => {
    try {
      setLoading(true);
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e994bb5d`;
      
      const response = await fetch(`${baseUrl}/areas`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch areas');
      }

      const result = await response.json();
      setTerritories(result.data || []);
    } catch (error: any) {
      console.error('Error fetching areas:', error);
      toast.error(`Lỗi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchAreas();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = territories.length;
    const withProvince = territories.filter(t => t.provinceId).length;
    const withWard = territories.filter(t => t.wardId).length;
    const active = territories.filter(t => t.status === 1).length;

    return {
      total,
      withProvince,
      withWard,
      active,
      inactive: total - active,
    };
  }, [territories]);

  // Filter and search
  const filteredTerritories = useMemo(() => {
    return territories.filter(territory => {
      const matchesSearch = 
        territory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        territory.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (territory.provinceName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (territory.wardName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (territory.managerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      const matchesLevel = 
        levelFilter === 'all' || 
        (levelFilter === 'PROVINCE' && territory.provinceId && !territory.wardId) ||
        (levelFilter === 'WARD' && territory.wardId);
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && territory.status === 1) ||
        (statusFilter === 'inactive' && territory.status === 0);
      
      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [territories, searchTerm, levelFilter, statusFilter]);

  // Pagination
  const paginatedTerritories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTerritories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTerritories, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTerritories.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getLevelLabel = (area: Area) => {
    if (area.wardId) {
      return 'Xã/Phường';
    } else if (area.provinceId) {
      return 'Tỉnh/TP';
    }
    return 'Chưa xác định';
  };

  const getLevelBadgeClass = (area: Area) => {
    if (area.wardId) {
      return styles.levelWard;
    } else if (area.provinceId) {
      return styles.levelProvince;
    }
    return '';
  };

  const handleRefresh = () => {
    fetchAreas();
    toast.success('Đã làm mới dữ liệu');
  };

  return (
    <div className={styles.territoryContainer}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.headerInfo}>
          <h2 className={styles.sectionTitle}>Địa bàn & phạm vi</h2>
          <p className={styles.sectionDesc}>
            Quản lý danh sách địa bàn hành chính và phạm vi quản lý toàn hệ thống
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn} onClick={handleRefresh} disabled={loading}>
            <RefreshCw size={16} className={loading ? styles.spinning : ''} />
            Làm mới
          </button>
          <button className={styles.secondaryBtn}>
            <Download size={16} />
            Xuất dữ liệu
          </button>
          <button className={styles.primaryBtn} onClick={() => onOpenModal('add')}>
            <Plus size={16} />
            Thêm địa bàn
          </button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <MapPin size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Tổng địa bàn</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Map size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.withProvince}</div>
            <div className={styles.statLabel}>Cấp Tỉnh/TP</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Building2 size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.withWard}</div>
            <div className={styles.statLabel}>Cấp Xã/Phường</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Check size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>Đang hoạt động</div>
          </div>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className={styles.filterActionBar}>
        <div className={styles.filterGroup}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã hoặc người phụ trách..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className={styles.select}
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả cấp</option>
            <option value="PROVINCE">Tỉnh/TP</option>
            <option value="WARD">Xã/Phường</option>
          </select>

          <select
            className={styles.select}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        <div className={styles.actionGroup}>
          <button className={styles.secondaryBtn} title="Bộ lọc nâng cao">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.emptyState}>
            <RefreshCw size={64} className={`${styles.emptyIcon} ${styles.spinning}`} />
            <h3 className={styles.emptyTitle}>Đang tải dữ liệu...</h3>
          </div>
        ) : paginatedTerritories.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên địa bàn</th>
                  <th>Cấp</th>
                  <th>Tỉnh/TP</th>
                  <th>Xã/Phường</th>
                  <th>Người phụ trách</th>
                  <th className={styles.alignCenter}>Số người dùng</th>
                  <th className={styles.alignCenter}>Trạng thái</th>
                  <th className={styles.alignRight}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTerritories.map((territory) => (
                  <tr key={territory.id}>
                    <td>
                      <span className={styles.codeCell}>{territory.code}</span>
                    </td>
                    <td>
                      <span className={styles.nameCell}>{territory.name}</span>
                    </td>
                    <td>
                      <span className={`${styles.levelBadge} ${getLevelBadgeClass(territory)}`}>
                        {getLevelLabel(territory)}
                      </span>
                    </td>
                    <td>
                      {territory.provinceName ? (
                        <span className={styles.provinceCell}>{territory.provinceName}</span>
                      ) : (
                        <span className={styles.emptyCell}>—</span>
                      )}
                    </td>
                    <td>
                      {territory.wardName ? (
                        <span className={styles.provinceCell}>{territory.wardName}</span>
                      ) : (
                        <span className={styles.emptyCell}>—</span>
                      )}
                    </td>
                    <td>
                      {territory.managerName ? (
                        <div className={styles.managerCell}>
                          <User size={14} className={styles.managerIcon} />
                          <span>{territory.managerName}</span>
                        </div>
                      ) : (
                        <span className={styles.emptyCell}>Chưa phân công</span>
                      )}
                    </td>
                    <td className={styles.alignCenter}>
                      <span style={{ fontWeight: 500 }}>{territory.userCount || 0}</span>
                    </td>
                    <td className={styles.alignCenter}>
                      {territory.status === 1 ? (
                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                          <Check size={12} />
                          Hoạt động
                        </span>
                      ) : (
                        <span className={`${styles.statusBadge} ${styles.statusInactive}`}>
                          <XCircle size={12} />
                          Không hoạt động
                        </span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.iconBtn}
                          title="Xem chi tiết"
                          onClick={() => onOpenModal('view', territory)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={styles.iconBtn}
                          title="Chỉnh sửa"
                          onClick={() => onOpenModal('edit', territory)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className={styles.iconBtn}
                          title="Xóa"
                          onClick={() => onOpenModal('delete', territory)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <MapPin size={64} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>Không tìm thấy địa bàn nào</h3>
            <p className={styles.emptyDesc}>
              {searchTerm || levelFilter !== 'all' || statusFilter !== 'all'
                ? 'Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác'
                : 'Bắt đầu bằng cách thêm địa bàn đầu tiên'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredTerritories.length > 0 && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTerritories.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

// Export as TerritoryTab to replace the old one
export default TerritoryTabNew;