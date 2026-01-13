import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Filter,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import styles from './TaskPerformancePage.module.css';

interface TaskPerformance {
  id: string;
  taskId: string;
  assignee: string;
  unit: string;
  area: string;
  status: 'executing' | 'pending_approval' | 'completed';
  deadline: string;
  executionTime: string;
  kpiStatus: 'on_time' | 'overdue' | 'warning';
}

type SortField = 'taskId' | 'assignee' | 'area' | 'deadline' | 'status' | 'kpiStatus';
type SortDirection = 'asc' | 'desc';

// Mock data
const mockData: TaskPerformance[] = [
  {
    id: '1',
    taskId: 'KT-2024-001',
    assignee: 'Nguyễn Văn A',
    unit: 'Chi cục QLTT Hà Nội - Đội 1',
    area: 'Quận Ba Đình - Phường Ngọc Hà',
    status: 'completed',
    deadline: '2024-01-15',
    executionTime: '12 ngày',
    kpiStatus: 'on_time'
  },
  {
    id: '2',
    taskId: 'KT-2024-002',
    assignee: 'Trần Thị B',
    unit: 'Chi cục QLTT Hồ Chí Minh - Đội 3',
    area: 'Quận 1 - Phường Bến Nghé',
    status: 'executing',
    deadline: '2024-01-20',
    executionTime: '5 ngày',
    kpiStatus: 'warning'
  },
  {
    id: '3',
    taskId: 'KT-2024-003',
    assignee: 'Lê Văn C',
    unit: 'Chi cục QLTT Đà Nẵng - Đội 2',
    area: 'Quận Hải Châu - Phường Thạch Thang',
    status: 'pending_approval',
    deadline: '2024-01-10',
    executionTime: '18 ngày',
    kpiStatus: 'overdue'
  },
  {
    id: '4',
    taskId: 'KT-2024-004',
    assignee: 'Phạm Thị D',
    unit: 'Chi cục QLTT Hải Phòng - Đội 1',
    area: 'Quận Hồng Bàng - Phường Hoàng Văn Thụ',
    status: 'executing',
    deadline: '2024-01-25',
    executionTime: '3 ngày',
    kpiStatus: 'on_time'
  },
  {
    id: '5',
    taskId: 'KT-2024-005',
    assignee: 'Hoàng Văn E',
    unit: 'Chi cục QLTT Cần Thơ - Đội 2',
    area: 'Quận Ninh Kiều - Phường Xuân Khánh',
    status: 'completed',
    deadline: '2024-01-12',
    executionTime: '10 ngày',
    kpiStatus: 'on_time'
  },
  {
    id: '6',
    taskId: 'KT-2024-006',
    assignee: 'Vũ Thị F',
    unit: 'Chi cục QLTT Hà Nội - Đội 5',
    area: 'Quận Cầu Giấy - Phường Dịch Vọng',
    status: 'executing',
    deadline: '2024-01-08',
    executionTime: '14 ngày',
    kpiStatus: 'overdue'
  },
  {
    id: '7',
    taskId: 'KT-2024-007',
    assignee: 'Đỗ Văn G',
    unit: 'Chi cục QLTT Hồ Chí Minh - Đội 1',
    area: 'Quận 3 - Phường Võ Thị Sáu',
    status: 'pending_approval',
    deadline: '2024-01-18',
    executionTime: '7 ngày',
    kpiStatus: 'on_time'
  },
  {
    id: '8',
    taskId: 'KT-2024-008',
    assignee: 'Bùi Thị H',
    unit: 'Chi cục QLTT Đà Nẵng - Đội 1',
    area: 'Quận Thanh Khê - Phường Tân Chính',
    status: 'completed',
    deadline: '2024-01-14',
    executionTime: '11 ngày',
    kpiStatus: 'on_time'
  },
  {
    id: '9',
    taskId: 'KT-2024-009',
    assignee: 'Đinh Văn I',
    unit: 'Chi cục QLTT Hải Phòng - Đội 3',
    area: 'Quận Lê Chân - Phường Niệm Nghĩa',
    status: 'executing',
    deadline: '2024-01-22',
    executionTime: '4 ngày',
    kpiStatus: 'warning'
  },
  {
    id: '10',
    taskId: 'KT-2024-010',
    assignee: 'Mai Thị K',
    unit: 'Chi cục QLTT Cần Thơ - Đội 1',
    area: 'Quận Cái Răng - Phường Thường Thạnh',
    status: 'executing',
    deadline: '2024-01-28',
    executionTime: '2 ngày',
    kpiStatus: 'on_time'
  },
  {
    id: '11',
    taskId: 'KT-2024-011',
    assignee: 'Lý Văn L',
    unit: 'Chi cục QLTT Hà Nội - Đội 3',
    area: 'Quận Hoàn Kiếm - Phường Hàng Bồ',
    status: 'pending_approval',
    deadline: '2024-01-16',
    executionTime: '9 ngày',
    kpiStatus: 'on_time'
  },
  {
    id: '12',
    taskId: 'KT-2024-012',
    assignee: 'Trịnh Thị M',
    unit: 'Chi cục QLTT Hồ Chí Minh - Đội 2',
    area: 'Quận 5 - Phường 14',
    status: 'completed',
    deadline: '2024-01-11',
    executionTime: '13 ngày',
    kpiStatus: 'warning'
  }
];

const statusLabels = {
  executing: 'Đang thực hiện',
  pending_approval: 'Chờ phê duyệt',
  completed: 'Hoàn thành'
};

const kpiLabels = {
  on_time: 'Đúng hạn',
  overdue: 'Quá hạn',
  warning: 'Cảnh báo'
};

export default function TaskPerformancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('taskId');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [kpiFilter, setKpiFilter] = useState<string>('all');
  const itemsPerPage = 10;

  // Sorting logic
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = mockData.filter(item => {
      const matchesSearch = 
        item.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unit.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesKpi = kpiFilter === 'all' || item.kpiStatus === kpiFilter;

      return matchesSearch && matchesStatus && matchesKpi;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'deadline') {
        aVal = new Date(a.deadline).getTime();
        bVal = new Date(b.deadline).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, sortField, sortDirection, statusFilter, kpiFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className={styles.sortIcon} />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} className={styles.sortIconActive} />
    ) : (
      <ArrowDown size={14} className={styles.sortIconActive} />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Hiệu suất nhiệm vụ quản lý thị trường</h1>
          <p className={styles.subtitle}>
            Theo dõi và đánh giá hiệu suất thực hiện nhiệm vụ của các đơn vị
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionButton}>
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã nhiệm vụ, người thực hiện, địa bàn..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Filter size={16} />
            <select 
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="executing">Đang thực hiện</option>
              <option value="pending_approval">Chờ phê duyệt</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <Calendar size={16} />
            <select 
              className={styles.filterSelect}
              value={kpiFilter}
              onChange={(e) => setKpiFilter(e.target.value)}
            >
              <option value="all">Tất cả KPI</option>
              <option value="on_time">Đúng hạn</option>
              <option value="warning">Cảnh báo</option>
              <option value="overdue">Quá hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Tổng nhiệm vụ</div>
          <div className={styles.statValue}>{filteredAndSortedData.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Đúng hạn</div>
          <div className={`${styles.statValue} ${styles.statSuccess}`}>
            {filteredAndSortedData.filter(d => d.kpiStatus === 'on_time').length}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Cảnh báo</div>
          <div className={`${styles.statValue} ${styles.statWarning}`}>
            {filteredAndSortedData.filter(d => d.kpiStatus === 'warning').length}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Quá hạn</div>
          <div className={`${styles.statValue} ${styles.statDanger}`}>
            {filteredAndSortedData.filter(d => d.kpiStatus === 'overdue').length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th 
                className={styles.sortableHeader}
                onClick={() => handleSort('taskId')}
              >
                <div className={styles.headerContent}>
                  <span>Mã nhiệm vụ</span>
                  {renderSortIcon('taskId')}
                </div>
              </th>
              <th 
                className={styles.sortableHeader}
                onClick={() => handleSort('assignee')}
              >
                <div className={styles.headerContent}>
                  <span>Người thực hiện / Đơn vị</span>
                  {renderSortIcon('assignee')}
                </div>
              </th>
              <th 
                className={styles.sortableHeader}
                onClick={() => handleSort('area')}
              >
                <div className={styles.headerContent}>
                  <span>Địa bàn</span>
                  {renderSortIcon('area')}
                </div>
              </th>
              <th 
                className={styles.sortableHeader}
                onClick={() => handleSort('status')}
              >
                <div className={styles.headerContent}>
                  <span>Trạng thái</span>
                  {renderSortIcon('status')}
                </div>
              </th>
              <th 
                className={styles.sortableHeader}
                onClick={() => handleSort('deadline')}
              >
                <div className={styles.headerContent}>
                  <span>Hạn định</span>
                  {renderSortIcon('deadline')}
                </div>
              </th>
              <th>Thời gian thực hiện</th>
              <th 
                className={styles.sortableHeader}
                onClick={() => handleSort('kpiStatus')}
              >
                <div className={styles.headerContent}>
                  <span>KPI Status</span>
                  {renderSortIcon('kpiStatus')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={styles.taskId}>{item.taskId}</span>
                </td>
                <td>
                  <div className={styles.assigneeCell}>
                    <div className={styles.assigneeName}>{item.assignee}</div>
                    <div className={styles.assigneeUnit}>{item.unit}</div>
                  </div>
                </td>
                <td>{item.area}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[`status-${item.status}`]}`}>
                    {statusLabels[item.status]}
                  </span>
                </td>
                <td>{formatDate(item.deadline)}</td>
                <td>{item.executionTime}</td>
                <td>
                  <span className={`${styles.kpiBadge} ${styles[`kpi-${item.kpiStatus}`]}`}>
                    {kpiLabels[item.kpiStatus]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className={styles.emptyState}>
            <p>Không tìm thấy dữ liệu phù hợp</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} trong tổng số {filteredAndSortedData.length} kết quả
          </div>
          <div className={styles.paginationControls}>
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`${styles.pageNumber} ${page === currentPage ? styles.pageNumberActive : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
