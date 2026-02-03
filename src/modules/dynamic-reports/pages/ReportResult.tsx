import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  Download,
  Edit,
  RefreshCw,
  Clock,
  Database,
  Filter as FilterIcon,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from '../DynamicReports.module.css';
import ExportReportModal from '../components/ExportReportModal';

// Mock data
const MOCK_TEMPLATE = {
  id: 'sys-001',
  name: 'Cơ sở chờ duyệt',
  dataset: 'Cơ sở quản lý',
  filters: 2,
  columns: 8,
  lastRun: '2024-01-26 14:30',
};

const MOCK_RESULTS = [
  { 
    id: 1, 
    name: 'Cửa hàng thực phẩm ABC', 
    address: '123 Nguyễn Huệ, P. Bến Nghé, Q1', 
    business_type: 'Hộ kinh doanh cá thể',
    industry: 'Thực phẩm và đồ uống',
    status: 'Chờ duyệt', 
    area: 45, 
    created_date: '2024-01-15',
    owner_name: 'Nguyễn Văn A'
  },
  { 
    id: 2, 
    name: 'Siêu thị Mini Mart', 
    address: '456 Lê Lợi, P. Bến Thành, Q1', 
    business_type: 'Công ty TNHH',
    industry: 'Bán lẻ',
    status: 'Chờ duyệt', 
    area: 120, 
    created_date: '2024-01-18',
    owner_name: 'Trần Thị B'
  },
  { 
    id: 3, 
    name: 'Cửa hàng điện tử XYZ', 
    address: '789 Trần Hưng Đạo, P. Cầu Kho, Q1', 
    business_type: 'Doanh nghiệp tư nhân',
    industry: 'Công nghệ',
    status: 'Chờ duyệt', 
    area: 60, 
    created_date: '2024-01-20',
    owner_name: 'Lê Văn C'
  },
  { 
    id: 4, 
    name: 'Nhà thuốc Sức Khỏe', 
    address: '321 Hai Bà Trưng, P. Đa Kao, Q1', 
    business_type: 'Hộ kinh doanh cá thể',
    industry: 'Y tế',
    status: 'Chờ duyệt', 
    area: 38, 
    created_date: '2024-01-22',
    owner_name: 'Phạm Thị D'
  },
  { 
    id: 5, 
    name: 'Cửa hàng thời trang Fashion', 
    address: '654 Nam Kỳ Khởi Nghĩa, P. Bến Nghé, Q1', 
    business_type: 'Công ty cổ phần',
    industry: 'Thời trang và mỹ phẩm',
    status: 'Chờ duyệt', 
    area: 55, 
    created_date: '2024-01-25',
    owner_name: 'Võ Văn E'
  },
  { 
    id: 6, 
    name: 'Quán cà phê The Coffee House', 
    address: '147 Đồng Khởi, P. Bến Nghé, Q1', 
    business_type: 'Công ty TNHH',
    industry: 'Thực phẩm và đồ uống',
    status: 'Chờ duyệt', 
    area: 85, 
    created_date: '2024-01-23',
    owner_name: 'Hoàng Thị F'
  },
  { 
    id: 7, 
    name: 'Cửa hàng sách Fahasa', 
    address: '185 Nguyễn Trãi, P. Nguyễn Cư Trinh, Q1', 
    business_type: 'Công ty cổ phần',
    industry: 'Giáo dục và đào tạo',
    status: 'Chờ duyệt', 
    area: 150, 
    created_date: '2024-01-19',
    owner_name: 'Đặng Văn G'
  },
  { 
    id: 8, 
    name: 'Salon tóc Beauty Pro', 
    address: '258 Lý Tự Trọng, P. Bến Thành, Q1', 
    business_type: 'Hộ kinh doanh cá thể',
    industry: 'Dịch vụ',
    status: 'Chờ duyệt', 
    area: 42, 
    created_date: '2024-01-21',
    owner_name: 'Bùi Thị H'
  },
];

const COLUMNS = [
  { id: 'name', name: 'Tên cơ sở' },
  { id: 'address', name: 'Địa chỉ' },
  { id: 'business_type', name: 'Loại hình' },
  { id: 'industry', name: 'Ngành hàng' },
  { id: 'status', name: 'Trạng thái' },
  { id: 'area', name: 'Diện tích (m²)' },
  { id: 'created_date', name: 'Ngày tạo' },
  { id: 'owner_name', name: 'Chủ cơ sở' },
];

export default function ReportResult() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil(MOCK_RESULTS.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, MOCK_RESULTS.length);
  const currentResults = MOCK_RESULTS.slice(startIndex, endIndex);

  const handleRefresh = () => {
    alert('Đang làm mới dữ liệu...');
  };

  const handleEdit = () => {
    navigate(`/bao-cao-dong/chinh-sua/${reportId}`);
  };

  const handleCopy = () => {
    alert('Đã sao chép mẫu báo cáo!');
  };

  return (
    <>
      <div className={styles.builderContainer}>
        {/* Header */}
        <div className={styles.builderHeader}>
          <div className={styles.breadcrumbs}>
            <Link to="/bao-cao-dong" className={styles.breadcrumbLink}>Báo cáo động</Link>
            <ChevronRight className={`${styles.breadcrumbSeparator} w-4 h-4`} />
            <span className={styles.breadcrumbCurrent}>{MOCK_TEMPLATE.name}</span>
          </div>
          <div className={styles.builderActions}>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
              Sao chép
            </Button>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </Button>
            <Button variant="default" size="sm" onClick={() => setShowExportModal(true)}>
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.builderMain}>
          {/* Summary Bar */}
          <div className={styles.resultSummary}>
            <div className={styles.summaryItem}>
              <Database className="w-4 h-4" />
              <span>Dataset: <strong>{MOCK_TEMPLATE.dataset}</strong></span>
            </div>
            <div className={styles.summaryItem}>
              <span>Số bản ghi: <strong>{MOCK_RESULTS.length}</strong></span>
            </div>
            <div className={styles.summaryItem}>
              <FilterIcon className="w-4 h-4" />
              <span>Bộ lọc: <strong>{MOCK_TEMPLATE.filters} điều kiện</strong></span>
            </div>
            <div className={styles.summaryItem}>
              <Clock className="w-4 h-4" />
              <span>Cập nhật: <strong>{MOCK_TEMPLATE.lastRun}</strong></span>
            </div>
          </div>

          {/* Applied Filters Info */}
          <div style={{ 
            padding: 'var(--spacing-3) var(--spacing-4)', 
            background: 'var(--muted)', 
            borderBottom: '1px solid var(--border)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--muted-foreground)'
          }}>
            <strong style={{ color: 'var(--foreground)' }}>Điều kiện lọc áp dụng:</strong> Trạng thái = "Chờ duyệt" AND Ngày tạo trong 30 ngày
          </div>

          {/* Table */}
          <div className={styles.tableContainer}>
            <table className={styles.resultTable}>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  {COLUMNS.map(col => (
                    <th key={col.id}>{col.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentResults.map((row, index) => (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', color: 'var(--muted-foreground)' }}>
                      {startIndex + index + 1}
                    </td>
                    {COLUMNS.map(col => (
                      <td key={col.id}>
                        {col.id === 'status' ? (
                          <span className={`${styles.badge} ${styles.badgeWarning}`}>
                            {row[col.id as keyof typeof row]}
                          </span>
                        ) : col.id === 'area' ? (
                          <span style={{ textAlign: 'right', display: 'block' }}>
                            {row[col.id as keyof typeof row]} m²
                          </span>
                        ) : (
                          row[col.id as keyof typeof row]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Hiển thị {startIndex + 1}-{endIndex} của {MOCK_RESULTS.length} bản ghi
            </div>
            <div className={styles.paginationControls}>
              <button 
                className={styles.paginationButton} 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={styles.paginationButton}
                  style={page === currentPage ? { 
                    background: 'var(--primary)', 
                    color: 'white',
                    borderColor: 'var(--primary)'
                  } : {}}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button 
                className={styles.paginationButton}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportReportModal 
          onClose={() => setShowExportModal(false)}
          onExport={(format, filename) => {
            console.log('Export:', format, filename);
            alert(`Đang xuất file ${filename}.${format === 'excel' ? 'xlsx' : 'pdf'}...`);
            setShowExportModal(false);
          }}
        />
      )}
    </>
  );
}
