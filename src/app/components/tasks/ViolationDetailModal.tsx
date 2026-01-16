import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  AlertTriangle,
  Info,
  Gavel,
  Calendar,
  DollarSign,
  Building2,
  User,
  Image as ImageIcon,
  Download,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './ViolationDetailModal.module.css';

interface ViolationDetailModalProps {
  violation: Violation | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface Violation {
  id: string;
  code: string;
  sessionCode: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  createdDate: string;
  targetName: string;
  assetValue: number;
  violatorOpinion: string;
  witnessOpinion: string;
  evidenceImages: Array<{ id: string; url: string; name: string }>;
  attachedDocuments: Array<{ id: string; name: string; size: string }>;
  // Xử lý
  handlingDate?: string;
  handlingMethod?: string;
  fineAmount?: number;
  receivingAgency?: string;
  holdingDate?: string;
  holdingAmount?: number;
  additionalPenalty?: string;
  deadline?: string;
  notes?: string;
  attachedMinutes?: Array<{ id: string; name: string; size: string }>;
  legalBasis?: string[];
  // Optional fields for violations list view
  regulation?: string;
  suggestedAction?: string;
}

// Mock data
const MOCK_VIOLATION: Violation = {
  id: '1',
  code: 'PHIEN-000',
  sessionCode: 'PHIEN-000',
  title: 'Khu vực chế biến không đảm bảo vệ sinh',
  severity: 'medium',
  description: 'Khu vực chế biến thực phẩm không đảm bảo điều kiện vệ sinh: sàn nhà ẩm ướt, bẩn thỉu, bồn rửa không có nước chảy, thiếu bồn rửa tay, không có hệ thống thông gió đầy đủ, không có hệ thống chống ruồi trong khu vực chế biến, thành viên không đeo khẩu trang, không mặc đồng phục theo đúng quy định.',
  createdDate: '2024-01-24 18:45',
  targetName: 'Cửa hàng Thực phẩm sạch Organic',
  assetValue: 10000000,
  violatorOpinion: 'Chủ cơ sở cho biết do nhận viên về sinh việc đột xuất nên chưa kịp dọn dẹp. Cam kết sẽ khắc phục ngay trong ngày.',
  witnessOpinion: 'Không có người chứng kiến',
  evidenceImages: [
    { id: '1', url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400', name: 'Khu vực chế biến' },
    { id: '2', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400', name: 'Sàn nhà ẩm ướt' },
    { id: '3', url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400', name: 'Thiếu thiết bị' },
  ],
  attachedDocuments: [
    { id: '1', name: 'Tài liệu 01_.xlsx', size: '3.87 MB' },
    { id: '2', name: 'Tài liệu 02_.xlsx', size: '3.87 MB' },
  ],
  // Xử lý
  handlingDate: '2024-01-24 18:45',
  handlingMethod: 'Xử phạt hành chính, Truy cứu trách nhiệm hình sự',
  fineAmount: 10000000,
  receivingAgency: 'Công an Phường Phú Diễn',
  holdingDate: '10,000,000 VNĐ',
  holdingAmount: 10000000,
  additionalPenalty: 'Tiêu hủy 50 sản phẩm không rõ nguồn gốc',
  deadline: '10 ngày',
  notes: 'Cửa hàng đã cam kết khắc phục vi phạm trong vòng 3 ngày',
  attachedMinutes: [
    { id: '1', name: 'Tài liệu 01_.xlsx', size: '3.87 MB' },
    { id: '2', name: 'Tài liệu 02_.xlsx', size: '3.87 MB' },
  ],
  legalBasis: [
    'Nghị định 98/2020/NĐ-CP',
    'Nghị định 115/2018/NĐ-CP',
  ],
};

export function ViolationDetailModal({ violation, isOpen, onClose }: ViolationDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'handling'>('info');

  // Reset tab when modal opens
  React.useEffect(() => {
    if (isOpen && violation) {
      setActiveTab('info');
    }
  }, [isOpen, violation]);

  if (!isOpen) return null;
  if (!violation) return null;

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return { label: 'Nghiêm trọng', color: 'high' };
      case 'medium':
        return { label: 'Trung bình', color: 'medium' };
      case 'low':
        return { label: 'Nhẹ', color: 'low' };
      default:
        return { label: severity, color: 'medium' };
    }
  };

  const severityInfo = getSeverityLabel(violation.severity);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <AlertTriangle size={20} />
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.title}>Chi tiết vi phạm</h2>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'info' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Thông tin
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'handling' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('handling')}
          >
            Xử lý
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Tab: Thông tin */}
          {activeTab === 'info' && (
            <div className={styles.tabContent}>
              {/* Thông tin cơ bản Section */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
                  <a href="#" className={styles.linkButton}>
                    Đổi thao thành
                  </a>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Phiên kiểm tra</div>
                    <div className={styles.infoValue}>
                      <a href="#" className={styles.link}>
                        {violation.sessionCode}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Tiêu vi phạm</div>
                    <div className={styles.infoValue}>{violation.title}</div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Mức độ</div>
                    <div className={styles.infoValue}>
                      <span className={`${styles.severityBadge} ${styles[`severity-${severityInfo.color}`]}`}>
                        {severityInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Ngày tạo</div>
                    <div className={styles.infoValue}>{violation.createdDate}</div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Đối tượng vi phạm</div>
                    <div className={styles.infoValue}>{violation.targetName}</div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Tài sản liên quan vi phạm</div>
                    <div className={styles.infoValue}>{formatCurrency(violation.assetValue)}</div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Mô tả vi phạm</div>
                    <div className={styles.infoValue}>{violation.description}</div>
                  </div>
                </div>
              </div>

              {/* Ý kiến người vi phạm */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Ý kiến người vi phạm</h3>
                <div className={styles.opinionBox}>
                  {violation.violatorOpinion}
                </div>
              </div>

              {/* Ý kiến người chứng kiến */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Ý kiến người chứng kiến</h3>
                <div className={styles.opinionBox}>
                  {violation.witnessOpinion}
                </div>
              </div>

              {/* Chứng cứ */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Chứng cứ</h3>
                <div className={styles.evidenceGrid}>
                  {violation.evidenceImages.map((image) => (
                    <div key={image.id} className={styles.evidenceItem}>
                      <img src={image.url} alt={image.name} className={styles.evidenceImage} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tài liệu đính kèm */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Tài liệu đính kèm</h3>
                <div className={styles.documentList}>
                  {violation.attachedDocuments.map((doc) => (
                    <div key={doc.id} className={styles.documentItem}>
                      <div className={styles.documentIcon}>
                        <FileText size={16} />
                      </div>
                      <div className={styles.documentInfo}>
                        <div className={styles.documentName}>{doc.name}</div>
                        <div className={styles.documentSize}>{doc.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Xử lý */}
          {activeTab === 'handling' && (
            <div className={styles.tabContent}>
              <div className={styles.infoGrid}>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Thời gian xử lý</div>
                  <div className={styles.infoValue}>{violation.handlingDate || 'N/A'}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Hình thức xử lý</div>
                  <div className={styles.infoValue}>{violation.handlingMethod || 'N/A'}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Số tiền phạt</div>
                  <div className={styles.infoValue}>
                    {violation.fineAmount ? formatCurrency(violation.fineAmount) : 'N/A'}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Cơ quan tiếp nhận</div>
                  <div className={styles.infoValue}>{violation.receivingAgency || 'N/A'}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Ngày tạm giữ</div>
                  <div className={styles.infoValue}>{violation.holdingDate || 'N/A'}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Hình thức phát bổ sung</div>
                  <div className={styles.infoValue}>{violation.additionalPenalty || 'N/A'}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Thời hạn thi hành</div>
                  <div className={styles.infoValue}>{violation.deadline || 'N/A'}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Ghi chú</div>
                  <div className={styles.infoValue}>{violation.notes || 'N/A'}</div>
                </div>
              </div>

              {/* Biên bản đính kèm */}
              {violation.attachedMinutes && violation.attachedMinutes.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Biên bản đính kèm</h3>
                  <div className={styles.documentList}>
                    {violation.attachedMinutes.map((doc) => (
                      <div key={doc.id} className={styles.documentItem}>
                        <div className={styles.documentIcon}>
                          <FileText size={16} />
                        </div>
                        <div className={styles.documentInfo}>
                          <div className={styles.documentName}>{doc.name}</div>
                          <div className={styles.documentSize}>{doc.size}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Căn cứ pháp lý */}
              {violation.legalBasis && violation.legalBasis.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Căn cứ pháp lý</h3>
                  <div className={styles.legalList}>
                    {violation.legalBasis.map((legal, index) => (
                      <div key={index} className={styles.legalItem}>
                        <span className={styles.bullet}>•</span>
                        <span>{legal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.closeButtonFooter} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViolationDetailModal;