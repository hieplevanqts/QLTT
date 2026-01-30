import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package,
  Download,
  Share2,
  Lock,
  Unlock,
  Eye,
  FileText,
  Image,
  Video,
  Calendar,
  User,
  Clock,
  CheckCircle,
  ArrowLeft,
  MoreVertical,
  File as FileIcon,
  ShieldCheck,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/layouts/PageHeader';
import styles from './EvidencePackageDetailPage.module.css';
import { toast } from 'sonner';

// WEB-05-14 — Package Detail (P0)
// UI: package contents, summary, export formats, access list
// AC: export tạo job + log download

interface PackageEvidence {
  id: string;
  fileName: string;
  type: 'image' | 'video' | 'document';
  capturedAt: string;
  location: string;
  status: 'approved' | 'sealed';
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  format: string;
  includesMetadata: boolean;
  includesCustody: boolean;
}

interface AccessLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  ipAddress?: string;
}

export default function EvidencePackageDetailPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'contents' | 'export' | 'access'>('contents');

  // Mock data
  const packageData = {
    id: packageId || 'PKG-2026-042',
    name: 'Gói chứng cứ vụ vi phạm ATTP Quận 1',
    description: 'Tập hợp đầy đủ chứng cứ cho vụ vi phạm an toàn thực phẩm tại Quận 1, bao gồm hình ảnh hiện trường, video thanh tra và các tài liệu liên quan.',
    linkedEntity: 'CASE-2026-048',
    entityType: 'Vụ việc',
    status: 'active',
    createdBy: 'Nguyễn Văn A',
    createdAt: '07/01/2026 10:30',
    itemCount: 24,
    includesMetadata: true,
    includesCustody: true,
    isSealed: false
  };

  const contents: PackageEvidence[] = [
    {
      id: 'EVD-2026-1252',
      fileName: 'anh_vi_pham_ve_sinh_01.jpg',
      type: 'image',
      capturedAt: '10/01/2026 09:00',
      location: 'Quận 1, TP.HCM',
      status: 'approved'
    },
    {
      id: 'EVD-2026-1251',
      fileName: 'anh_vi_pham_ve_sinh_02.jpg',
      type: 'image',
      capturedAt: '10/01/2026 09:15',
      location: 'Quận 1, TP.HCM',
      status: 'approved'
    },
    {
      id: 'EVD-2026-1250',
      fileName: 'video_thanh_tra.mp4',
      type: 'video',
      capturedAt: '10/01/2026 08:00',
      location: 'Quận 1, TP.HCM',
      status: 'sealed'
    },
    {
      id: 'EVD-2026-1249',
      fileName: 'bien_ban_kiem_tra.pdf',
      type: 'document',
      capturedAt: '09/01/2026 15:00',
      location: 'Quận 1, TP.HCM',
      status: 'approved'
    }
  ];

  const exportFormats: ExportFormat[] = [
    {
      id: 'zip-full',
      name: 'ZIP Package (Full)',
      description: 'Tất cả files gốc + metadata JSON + chain of custody log',
      format: 'ZIP',
      includesMetadata: true,
      includesCustody: true
    },
    {
      id: 'zip-basic',
      name: 'ZIP Package (Basic)',
      description: 'Chỉ files gốc + metadata cơ bản',
      format: 'ZIP',
      includesMetadata: true,
      includesCustody: false
    },
    {
      id: 'pdf-report',
      name: 'PDF Report',
      description: 'Báo cáo PDF bao gồm thumbnails + metadata + chain of custody',
      format: 'PDF',
      includesMetadata: true,
      includesCustody: true
    }
  ];

  const accessLogs: AccessLog[] = [
    {
      id: '1',
      user: 'Nguyễn Văn A',
      action: 'Tạo gói chứng cứ',
      timestamp: '07/01/2026 10:30:15',
      ipAddress: '14.231.xxx.xxx'
    },
    {
      id: '2',
      user: 'Trần Thị B',
      action: 'Xem chi tiết gói',
      timestamp: '07/01/2026 14:20:42',
      ipAddress: '113.161.xxx.xxx'
    },
    {
      id: '3',
      user: 'Lê Văn C',
      action: 'Export ZIP Package (Full)',
      timestamp: '08/01/2026 09:15:33',
      ipAddress: '14.231.xxx.xxx'
    },
    {
      id: '4',
      user: 'Lê Văn C',
      action: 'Download ZIP Package',
      timestamp: '08/01/2026 09:16:10',
      ipAddress: '14.231.xxx.xxx'
    }
  ];

  const handleExport = (formatId: string) => {
    const format = exportFormats.find(f => f.id === formatId);
    if (!format) return;

    toast.success(`Đã tạo export job cho "${format.name}". Job đang được xử lý...`);
    
    // Simulate export job creation
    setTimeout(() => {
      toast.success('Export job hoàn thành. Đang chuyển đến Export Center...');
      setTimeout(() => {
        navigate('/evidence/exports');
      }, 1000);
    }, 2000);
  };

  const handleSealPackage = () => {
    toast.success('Đã niêm phong gói chứng cứ. Gói không thể chỉnh sửa.');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image size={16} />;
      case 'video': return <Video size={16} />;
      case 'document': return <FileText size={16} />;
      default: return <FileIcon size={16} />;
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kho chứng cứ', href: '/evidence' },
          { label: 'Gói chứng cứ', href: '/evidence/packages' },
          { label: packageData.id }
        ]}
        title={packageData.id}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Share2 size={16} />
              Chia sẻ
            </Button>
            {!packageData.isSealed && (
              <Button variant="outline" size="sm" onClick={handleSealPackage}>
                <Lock size={16} />
                Niêm phong
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <MoreVertical size={16} />
            </Button>
          </>
        }
      />

      <div className={styles.content}>
        {/* Package Header Card */}
        <div className={styles.headerCard}>
          <div className={styles.headerLeft}>
            <div className={styles.packageIconLarge}>
              <Package size={32} />
            </div>
            <div className={styles.headerInfo}>
              <h2 className={styles.packageName}>{packageData.name}</h2>
              <p className={styles.packageDescription}>{packageData.description}</p>
              <div className={styles.headerMeta}>
                <span className={styles.metaItem}>
                  <FileIcon size={14} />
                  {packageData.itemCount} chứng cứ
                </span>
                <span className={styles.separator}>•</span>
                <span className={styles.metaItem}>
                  <User size={14} />
                  {packageData.createdBy}
                </span>
                <span className={styles.separator}>•</span>
                <span className={styles.metaItem}>
                  <Calendar size={14} />
                  {packageData.createdAt}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.headerBadges}>
              {packageData.isSealed ? (
                <Badge variant="outline" style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>
                  <Lock size={12} />
                  Đã niêm phong
                </Badge>
              ) : (
                <Badge variant="outline" style={{ borderColor: '#22c55e', color: '#22c55e' }}>
                  <CheckCircle size={12} />
                  Đang hoạt động
                </Badge>
              )}
              <Badge variant="outline" style={{ borderColor: '#005cb6', color: '#005cb6' }}>
                {packageData.entityType}: {packageData.linkedEntity}
              </Badge>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#005cb615', color: '#005cb6' }}>
              <FileIcon size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Tổng chứng cứ</p>
              <h3 className={styles.statValue}>{packageData.itemCount}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#22c55e15', color: '#22c55e' }}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Đã phê duyệt</p>
              <h3 className={styles.statValue}>{contents.filter(c => c.status === 'approved').length}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
              <Lock size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Đã niêm phong</p>
              <h3 className={styles.statValue}>{contents.filter(c => c.status === 'sealed').length}</h3>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#f59e0b15', color: '#f59e0b' }}>
              <Download size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Lượt export</p>
              <h3 className={styles.statValue}>
                {accessLogs.filter(log => log.action.includes('Export')).length}
              </h3>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'contents' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('contents')}
          >
            <Package size={16} />
            Nội dung gói ({packageData.itemCount})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'export' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('export')}
          >
            <Download size={16} />
            Xuất khẩu
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'access' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('access')}
          >
            <ShieldCheck size={16} />
            Lịch sử truy cập
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {/* Contents Tab */}
          {activeTab === 'contents' && (
            <div className={styles.contentsSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Danh sách chứng cứ</h3>
                <Button variant="outline" size="sm" onClick={() => navigate(packageData.linkedEntity)}>
                  <ExternalLink size={14} />
                  Mở vụ việc
                </Button>
              </div>

              <div className={styles.contentsList}>
                {contents.map((item, index) => (
                  <div key={item.id} className={styles.contentCard}>
                    <div className={styles.contentOrder}>{index + 1}</div>
                    <div className={styles.contentIcon}>
                      {getFileIcon(item.type)}
                    </div>
                    <div className={styles.contentInfo}>
                      <div className={styles.contentHeader}>
                        <span className={styles.contentId}>{item.id}</span>
                        <Badge variant="outline" style={{
                          borderColor: item.status === 'sealed' ? '#8b5cf6' : '#22c55e',
                          color: item.status === 'sealed' ? '#8b5cf6' : '#22c55e'
                        }}>
                          {item.status === 'sealed' ? 'Đã niêm phong' : 'Đã duyệt'}
                        </Badge>
                      </div>
                      <h4 className={styles.contentFileName}>{item.fileName}</h4>
                      <div className={styles.contentMeta}>
                        <span className={styles.metaItem}>
                          <Calendar size={12} />
                          {item.capturedAt}
                        </span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.metaItem}>{item.location}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/evidence/${item.id}`)}
                    >
                      <Eye size={14} />
                    </Button>
                  </div>
                ))}
              </div>

              {packageData.includesMetadata && (
                <div className={styles.includeNotice}>
                  <CheckCircle size={16} />
                  <span>Gói bao gồm metadata chi tiết cho tất cả chứng cứ</span>
                </div>
              )}
              {packageData.includesCustody && (
                <div className={styles.includeNotice}>
                  <CheckCircle size={16} />
                  <span>Gói bao gồm Chain of Custody log đầy đủ</span>
                </div>
              )}
            </div>
          )}

          {/* Export Tab - FR-31 */}
          {activeTab === 'export' && (
            <div className={styles.exportSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Định dạng xuất khẩu</h3>
              </div>

              <div className={styles.exportFormats}>
                {exportFormats.map((format) => (
                  <div key={format.id} className={styles.formatCard}>
                    <div className={styles.formatIcon}>
                      <Download size={24} />
                    </div>
                    <div className={styles.formatInfo}>
                      <h4 className={styles.formatName}>{format.name}</h4>
                      <p className={styles.formatDescription}>{format.description}</p>
                      <div className={styles.formatFeatures}>
                        {format.includesMetadata && (
                          <Badge variant="outline" size="sm">
                            <CheckCircle size={12} />
                            Metadata
                          </Badge>
                        )}
                        {format.includesCustody && (
                          <Badge variant="outline" size="sm">
                            <CheckCircle size={12} />
                            Chain of Custody
                          </Badge>
                        )}
                        <Badge variant="secondary" size="sm">{format.format}</Badge>
                      </div>
                    </div>
                    <Button onClick={() => handleExport(format.id)}>
                      <Download size={14} />
                      Xuất
                    </Button>
                  </div>
                ))}
              </div>

              <div className={styles.exportNotice}>
                <AlertCircle size={16} />
                <div>
                  <p className={styles.noticeTitle}>Lưu ý về Export</p>
                  <p className={styles.noticeText}>
                    Mọi thao tác export và download sẽ được ghi log đầy đủ theo tiêu chuẩn OWASP logging guidance. 
                    Export job sẽ được tạo và có thể theo dõi tại Export Center.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Access Log Tab - FR-31 */}
          {activeTab === 'access' && (
            <div className={styles.accessSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Lịch sử truy cập & Export</h3>
              </div>

              <div className={styles.accessList}>
                {accessLogs.map((log) => (
                  <div key={log.id} className={styles.accessCard}>
                    <div className={styles.accessIcon}>
                      <Clock size={16} />
                    </div>
                    <div className={styles.accessInfo}>
                      <div className={styles.accessHeader}>
                        <span className={styles.accessUser}>{log.user}</span>
                        <span className={styles.accessTime}>{log.timestamp}</span>
                      </div>
                      <p className={styles.accessAction}>{log.action}</p>
                      {log.ipAddress && (
                        <span className={styles.accessIp}>IP: {log.ipAddress}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

