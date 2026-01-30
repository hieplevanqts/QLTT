import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
  Video,
  File,
  Send,
  X,
  CheckSquare,
  Calendar,
  MapPin,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/layouts/PageHeader';
import styles from './EvidenceIntakeInboxPage.module.css';
import { toast } from 'sonner';

// WEB-05-03 — Evidence Intake Inbox (P1)
// Mục tiêu: staging trước khi "Submit"
// UI: list Draft items, validate missing fields, submit batch

interface DraftEvidence {
  id: string;
  fileName: string;
  type: 'image' | 'video' | 'document' | 'audio';
  size: string;
  uploadedAt: string;
  hasType: boolean;
  hasSource: boolean;
  hasCapturedAt: boolean;
  hasLocation: boolean;
  hasLinkedEntity: boolean;
  isValid: boolean;
  validationErrors: string[];
}

export default function EvidenceIntakeInboxPage() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Mock draft data
  const draftItems: DraftEvidence[] = [
    {
      id: 'DRAFT-001',
      fileName: 'anh_vi_pham_attp.jpg',
      type: 'image',
      size: '2.4 MB',
      uploadedAt: '10/01/2026 14:30',
      hasType: true,
      hasSource: true,
      hasCapturedAt: true,
      hasLocation: true,
      hasLinkedEntity: true,
      isValid: true,
      validationErrors: []
    },
    {
      id: 'DRAFT-002',
      fileName: 'video_thanh_tra.mp4',
      type: 'video',
      size: '45.2 MB',
      uploadedAt: '10/01/2026 13:15',
      hasType: true,
      hasSource: false,
      hasCapturedAt: true,
      hasLocation: false,
      hasLinkedEntity: true,
      isValid: false,
      validationErrors: ['Thiếu nguồn chứng cứ', 'Thiếu vị trí']
    },
    {
      id: 'DRAFT-003',
      fileName: 'bien_ban_kiem_tra.pdf',
      type: 'document',
      size: '1.2 MB',
      uploadedAt: '10/01/2026 11:45',
      hasType: false,
      hasSource: true,
      hasCapturedAt: false,
      hasLocation: true,
      hasLinkedEntity: false,
      isValid: false,
      validationErrors: ['Thiếu loại chứng cứ', 'Thiếu ngày chụp', 'Thiếu liên kết vụ việc']
    },
    {
      id: 'DRAFT-004',
      fileName: 'giay_phep_attp.pdf',
      type: 'document',
      size: '856 KB',
      uploadedAt: '09/01/2026 16:20',
      hasType: true,
      hasSource: true,
      hasCapturedAt: true,
      hasLocation: true,
      hasLinkedEntity: false,
      isValid: false,
      validationErrors: ['Thiếu liên kết vụ việc']
    },
    {
      id: 'DRAFT-005',
      fileName: 'anh_kho_hang.jpg',
      type: 'image',
      size: '3.1 MB',
      uploadedAt: '09/01/2026 10:00',
      hasType: true,
      hasSource: true,
      hasCapturedAt: false,
      hasLocation: true,
      hasLinkedEntity: true,
      isValid: false,
      validationErrors: ['Thiếu ngày chụp']
    }
  ];

  const validCount = draftItems.filter(item => item.isValid).length;
  const invalidCount = draftItems.filter(item => !item.isValid).length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(draftItems.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    }
  };

  const handleSubmitSelected = () => {
    const selectedItems = draftItems.filter(item => selectedIds.includes(item.id));
    const invalidSelected = selectedItems.filter(item => !item.isValid);
    
    if (invalidSelected.length > 0) {
      toast.error(`Không thể nộp ${invalidSelected.length} mục chưa hợp lệ. Vui lòng kiểm tra lại.`);
      return;
    }

    toast.success(`Đã nộp ${selectedIds.length} chứng cứ để xét duyệt`);
    setSelectedIds([]);
  };

  const handleSubmitAll = () => {
    if (invalidCount > 0) {
      toast.error(`Còn ${invalidCount} mục chưa hợp lệ. Vui lòng hoàn thiện trước khi nộp.`);
      return;
    }

    toast.success(`Đã nộp tất cả ${draftItems.length} chứng cứ để xét duyệt`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image size={16} />;
      case 'video': return <Video size={16} />;
      case 'document': return <FileText size={16} />;
      default: return <File size={16} />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kho chứng cứ', href: '/evidence' },
          { label: 'Intake Inbox' }
        ]}
        title="Intake Inbox"
        actions={
          <Button onClick={() => navigate('/evidence/new')}>
            <Upload size={16} />
            Tải lên mới
          </Button>
        }
      />

      <div className={styles.content}>
        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#005cb615', color: '#005cb6' }}>
              <FileText size={24} />
            </div>
            <div className={styles.summaryContent}>
              <p className={styles.summaryLabel}>Tổng số nháp</p>
              <h3 className={styles.summaryValue}>{draftItems.length}</h3>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#22c55e15', color: '#22c55e' }}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.summaryContent}>
              <p className={styles.summaryLabel}>Sẵn sàng nộp</p>
              <h3 className={styles.summaryValue}>{validCount}</h3>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: '#ef444415', color: '#ef4444' }}>
              <AlertCircle size={24} />
            </div>
            <div className={styles.summaryContent}>
              <p className={styles.summaryLabel}>Cần hoàn thiện</p>
              <h3 className={styles.summaryValue}>{invalidCount}</h3>
            </div>
          </div>
        </div>

        {/* Info Notice */}
        <div className={styles.infoNotice}>
          <AlertCircle size={16} />
          <p>
            Đây là khu vực tạm giữ (staging) cho chứng cứ đã tải lên nhưng chưa nộp. 
            Vui lòng hoàn thiện các trường bắt buộc trước khi nộp để xét duyệt.
          </p>
        </div>

        {/* Batch Actions */}
        {selectedIds.length > 0 && (
          <div className={styles.batchActions}>
            <div className={styles.batchActionsInfo}>
              <CheckSquare size={16} />
              <span>Đã chọn {selectedIds.length} mục</span>
            </div>
            <div className={styles.batchActionsButtons}>
              <Button variant="outline" size="sm" onClick={() => setSelectedIds([])}>
                <X size={16} />
                Bỏ chọn
              </Button>
              <Button size="sm" onClick={handleSubmitSelected}>
                <Send size={16} />
                Nộp đã chọn
              </Button>
            </div>
          </div>
        )}

        {/* Draft Items Table */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Danh sách nháp</h2>
            <div className={styles.sectionActions}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSubmitAll}
                disabled={invalidCount > 0}
              >
                <Send size={16} />
                Nộp tất cả ({validCount})
              </Button>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkboxColumn}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === draftItems.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th>Mã nháp</th>
                  <th>Tên file</th>
                  <th>Loại</th>
                  <th>Trạng thái</th>
                  <th>Validation</th>
                  <th>Ngày tải lên</th>
                  <th className={styles.actionsColumn}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {draftItems.map((item) => (
                  <tr key={item.id} className={!item.isValid ? styles.invalidRow : ''}>
                    <td className={styles.checkboxColumn}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <span className={styles.draftId}>{item.id}</span>
                    </td>
                    <td>
                      <div className={styles.fileCell}>
                        <div className={styles.fileIcon}>{getFileIcon(item.type)}</div>
                        <div className={styles.fileInfo}>
                          <span className={styles.fileName}>{item.fileName}</span>
                          <span className={styles.fileSize}>{item.size}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant="outline">
                        {item.type === 'image' ? 'Ảnh' :
                         item.type === 'video' ? 'Video' :
                         item.type === 'document' ? 'Tài liệu' : 'Khác'}
                      </Badge>
                    </td>
                    <td>
                      {item.isValid ? (
                        <Badge variant="outline" style={{ borderColor: '#22c55e', color: '#22c55e', background: '#22c55e15' }}>
                          <CheckCircle size={12} />
                          Sẵn sàng
                        </Badge>
                      ) : (
                        <Badge variant="outline" style={{ borderColor: '#ef4444', color: '#ef4444', background: '#ef444415' }}>
                          <AlertCircle size={12} />
                          Chưa đủ
                        </Badge>
                      )}
                    </td>
                    <td>
                      {item.isValid ? (
                        <span className={styles.validationSuccess}>
                          <CheckCircle size={14} />
                          Hoàn thiện
                        </span>
                      ) : (
                        <div className={styles.validationErrors}>
                          {item.validationErrors.map((error, idx) => (
                            <div key={idx} className={styles.validationError}>
                              <AlertTriangle size={12} />
                              <span>{error}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className={styles.dateCell}>
                        <Calendar size={12} />
                        <span>{item.uploadedAt}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/evidence/drafts/${item.id}/edit`)}
                        >
                          <Edit size={14} />
                          Sửa
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Validation Guide */}
        <div className={styles.validationGuide}>
          <h3 className={styles.guideTitle}>Các trường bắt buộc</h3>
          <div className={styles.guideGrid}>
            <div className={styles.guideItem}>
              <Tag size={16} />
              <span>Loại chứng cứ</span>
            </div>
            <div className={styles.guideItem}>
              <FileText size={16} />
              <span>Nguồn chứng cứ</span>
            </div>
            <div className={styles.guideItem}>
              <Calendar size={16} />
              <span>Ngày chụp/thu thập</span>
            </div>
            <div className={styles.guideItem}>
              <MapPin size={16} />
              <span>Vị trí GPS</span>
            </div>
            <div className={styles.guideItem}>
              <CheckSquare size={16} />
              <span>Liên kết vụ việc/nhiệm vụ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
