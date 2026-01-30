import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  Package,
  Calendar,
  User,
  Eye,
  Trash2,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/layouts/PageHeader';
import styles from './EvidenceExportCenterPage.module.css';
import { toast } from 'sonner';

// WEB-05-15 — Export Center (P0) - FR-31
// UI: export jobs list, status, download (RBAC), retention note
// Rule: download là sự kiện nhạy cảm phải log đầy đủ theo OWASP logging guidance

interface ExportJob {
  id: string;
  name: string;
  type: 'package' | 'evidence-subset';
  format: 'zip-full' | 'zip-basic' | 'pdf-report';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  fileSize?: string;
  downloadCount: number;
  expiresAt: string;
  packageId?: string;
  itemCount: number;
}

export default function EvidenceExportCenterPage() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock export jobs
  const exportJobs: ExportJob[] = [
    {
      id: 'EXP-2026-156',
      name: 'Gói chứng cứ vụ vi phạm ATTP Quận 1 - ZIP Full',
      type: 'package',
      format: 'zip-full',
      status: 'completed',
      createdBy: 'Lê Văn C',
      createdAt: '08/01/2026 09:15:33',
      completedAt: '08/01/2026 09:16:05',
      fileSize: '245.8 MB',
      downloadCount: 2,
      expiresAt: '15/01/2026',
      packageId: 'PKG-2026-042',
      itemCount: 24
    },
    {
      id: 'EXP-2026-155',
      name: 'Báo cáo PDF - Thanh tra tháng 12/2025',
      type: 'package',
      format: 'pdf-report',
      status: 'completed',
      createdBy: 'Trần Thị B',
      createdAt: '07/01/2026 16:20:12',
      completedAt: '07/01/2026 16:22:45',
      fileSize: '12.4 MB',
      downloadCount: 5,
      expiresAt: '14/01/2026',
      packageId: 'PKG-2026-041',
      itemCount: 15
    },
    {
      id: 'EXP-2026-154',
      name: 'Subset chứng cứ CASE-2026-045',
      type: 'evidence-subset',
      format: 'zip-basic',
      status: 'processing',
      progress: 67,
      createdBy: 'Nguyễn Văn A',
      createdAt: '10/01/2026 14:30:08',
      downloadCount: 0,
      expiresAt: '17/01/2026',
      itemCount: 8
    },
    {
      id: 'EXP-2026-153',
      name: 'Gói chứng cứ kiểm tra ATTP - ZIP Full',
      type: 'package',
      format: 'zip-full',
      status: 'failed',
      createdBy: 'Phạm Thị D',
      createdAt: '06/01/2026 11:45:22',
      completedAt: '06/01/2026 11:47:15',
      downloadCount: 0,
      expiresAt: '13/01/2026',
      packageId: 'PKG-2026-040',
      itemCount: 12
    },
    {
      id: 'EXP-2026-152',
      name: 'Subset chứng cứ ưu tiên cao',
      type: 'evidence-subset',
      format: 'zip-full',
      status: 'pending',
      createdBy: 'Lê Văn C',
      createdAt: '10/01/2026 15:10:00',
      downloadCount: 0,
      expiresAt: '17/01/2026',
      itemCount: 5
    }
  ];

  const stats = {
    total: exportJobs.length,
    completed: exportJobs.filter(j => j.status === 'completed').length,
    processing: exportJobs.filter(j => j.status === 'processing').length,
    failed: exportJobs.filter(j => j.status === 'failed').length
  };

  const getStatusBadge = (status: string, progress?: number) => {
    const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
      pending: { label: 'Đang chờ', color: '#6b7280', bg: '#6b728015', icon: Clock },
      processing: { label: `Đang xử lý ${progress ? `(${progress}%)` : ''}`, color: '#f59e0b', bg: '#f59e0b15', icon: Loader2 },
      completed: { label: 'Hoàn thành', color: '#22c55e', bg: '#22c55e15', icon: CheckCircle },
      failed: { label: 'Thất bại', color: '#ef4444', bg: '#ef444415', icon: XCircle }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant="outline" style={{ borderColor: config.color, color: config.color, background: config.bg }}>
        <Icon size={12} className={status === 'processing' ? styles.spinning : ''} />
        {config.label}
      </Badge>
    );
  };

  const getFormatBadge = (format: string) => {
    const formatConfig: Record<string, { label: string }> = {
      'zip-full': { label: 'ZIP Full' },
      'zip-basic': { label: 'ZIP Basic' },
      'pdf-report': { label: 'PDF Report' }
    };
    const config = formatConfig[format] || formatConfig['zip-full'];
    return <Badge variant="secondary">{config.label}</Badge>;
  };

  const handleDownload = (job: ExportJob) => {
    if (job.status !== 'completed') {
      toast.error('Tác vụ chưa hoàn thành, không thể tải xuống');
      return;
    }

    // FR-31: Log download event (OWASP logging guidance)
    toast.success(`Đang tải xuống ${job.name}. Sự kiện tải xuống đã được ghi log.`);
  };

  const handleRetry = (jobId: string) => {
    toast.success(`Đã gửi yêu cầu thử lại cho tác vụ ${jobId}`);
  };

  const handleDelete = (jobId: string) => {
    toast.success(`Đã xóa tác vụ xuất ${jobId}`);
  };

  const filteredJobs = exportJobs.filter(job => {
    const matchesStatus = !filterStatus || job.status === filterStatus;
    const matchesSearch = !searchTerm || 
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kho chứng cứ', href: '/evidence' },
          { label: 'Trung tâm xuất dữ liệu' }
        ]}
        title="Trung tâm xuất dữ liệu"
        actions={
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            Làm mới
          </Button>
        }
      />

      <div className={styles.content}>
        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#005cb615', color: '#005cb6' }}>
              <Download size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Tổng số tác vụ</p>
              <h3 className={styles.statValue}>{stats.total}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#22c55e15', color: '#22c55e' }}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Hoàn thành</p>
              <h3 className={styles.statValue}>{stats.completed}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f59e0b15', color: '#f59e0b' }}>
              <Loader2 size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Đang xử lý</p>
              <h3 className={styles.statValue}>{stats.processing}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#ef444415', color: '#ef4444' }}>
              <XCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Thất bại</p>
              <h3 className={styles.statValue}>{stats.failed}</h3>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filterSection}>
          <div className={styles.searchBar}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm tác vụ xuất..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="completed">Hoàn thành</option>
            <option value="processing">Đang xử lý</option>
            <option value="pending">Đang chờ</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>

        {/* Export Jobs List */}
        <div className={styles.jobsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Danh sách tác vụ xuất</h3>
            <span className={styles.jobCount}>{filteredJobs.length} tác vụ</span>
          </div>

          <div className={styles.jobsList}>
            {filteredJobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobHeader}>
                  <div className={styles.jobTitle}>
                    <div className={styles.jobIcon}>
                      {job.type === 'package' ? <Package size={20} /> : <FileText size={20} />}
                    </div>
                    <div className={styles.jobInfo}>
                      <div className={styles.jobIdRow}>
                        <span className={styles.jobId}>{job.id}</span>
                        {getStatusBadge(job.status, job.progress)}
                        {getFormatBadge(job.format)}
                      </div>
                      <h4 className={styles.jobName}>{job.name}</h4>
                    </div>
                  </div>
                  <div className={styles.jobActions}>
                    {job.status === 'completed' && (
                      <>
                        <Button size="sm" onClick={() => handleDownload(job)}>
                          <Download size={14} />
                          Tải xuống
                        </Button>
                        {job.packageId && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/evidence/packages/${job.packageId}`)}
                          >
                            <Eye size={14} />
                          </Button>
                        )}
                      </>
                    )}
                    {job.status === 'failed' && (
                      <Button variant="outline" size="sm" onClick={() => handleRetry(job.id)}>
                        <RefreshCw size={14} />
                        Thử lại
                      </Button>
                    )}
                    {job.status !== 'processing' && (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)}>
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>

                <div className={styles.jobMeta}>
                  <div className={styles.metaItem}>
                    <User size={14} />
                    <span>{job.createdBy}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Calendar size={14} />
                    <span>{job.createdAt}</span>
                  </div>
                  {job.fileSize && (
                    <div className={styles.metaItem}>
                      <FileText size={14} />
                      <span>{job.fileSize}</span>
                    </div>
                  )}
                  <div className={styles.metaItem}>
                    <Package size={14} />
                    <span>{job.itemCount} mục</span>
                  </div>
                </div>

                {job.status === 'processing' && job.progress && (
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${job.progress}%` }} />
                  </div>
                )}

                {job.status === 'completed' && (
                  <div className={styles.jobFooter}>
                    <div className={styles.downloadInfo}>
                      <Download size={12} />
                      <span>Đã tải xuống {job.downloadCount} lần</span>
                    </div>
                    <div className={styles.expiryInfo}>
                      <AlertCircle size={12} />
                      <span>Hết hạn: {job.expiresAt}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Retention Notice - FR-31 */}
        <div className={styles.retentionNotice}>
          <AlertCircle size={16} />
          <div>
            <p className={styles.noticeTitle}>Lưu ý về chính sách lưu trữ</p>
            <p className={styles.noticeText}>
              Các file xuất dữ liệu sẽ được lưu trữ trong 7 ngày kể từ khi hoàn thành. 
              Sau thời gian này, file sẽ tự động bị xóa khỏi hệ thống. 
              Mọi thao tác tải xuống được ghi log đầy đủ theo OWASP logging guidance bao gồm: 
              user ID, timestamp, IP address, user agent, tên file, và kích thước file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

