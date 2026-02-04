import React, { useState } from 'react';
import { Search, FileText, Calendar, User, CheckCircle2, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import styles from './InspectionRoundDecisionModals.module.css';

export interface InsDecision {
  id: string;
  code: string; // Số QĐ
  title: string; // Tiêu đề
  type: string; // Loại QĐ
  issueDate: string; // Ngày ban hành
  signer: string; // Người ký
  signerPosition: string; // Chức vụ
  summary?: string; // Tóm tắt nội dung
  pdfUrl?: string; // URL PDF để preview/download
}

interface DecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  decisions: InsDecision[];
  onSelect: (decision: InsDecision) => void;
  selectedDecisionCode?: string;
}

function DecisionModalBase({
  open,
  onOpenChange,
  title,
  description,
  decisions,
  onSelect,
  selectedDecisionCode,
}: DecisionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<InsDecision | null>(null);

  // Filter decisions based on search
  const filteredDecisions = decisions.filter(decision => {
    const query = searchQuery.toLowerCase();
    return (
      decision.code.toLowerCase().includes(query) ||
      decision.title.toLowerCase().includes(query) ||
      decision.signer.toLowerCase().includes(query)
    );
  });

  const handleSelect = () => {
    if (!selectedDecision) {
      toast.error('Vui lòng chọn một quyết định');
      return;
    }
    onSelect(selectedDecision);
    toast.success(`Đã import ${selectedDecision.code}`);
    onOpenChange(false);
    setSearchQuery('');
    setSelectedDecision(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearchQuery('');
    setSelectedDecision(null);
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <FileText size={24} className={styles.headerIcon} />
            <div>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.subtitle}>{description}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {/* Info box if decision already selected */}
        {selectedDecisionCode && (
          <div className={styles.infoBox}>
            <CheckCircle2 size={16} />
            <span>Đã import: <strong>{selectedDecisionCode}</strong></span>
          </div>
        )}

        {/* Search */}
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm theo số QĐ, tiêu đề hoặc người ký..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* List */}
        <div className={styles.listContainer}>
          {filteredDecisions.length === 0 ? (
            <div className={styles.emptyState}>
              <FileText size={48} className={styles.emptyIcon} />
              <p className={styles.emptyText}>Không tìm thấy quyết định phù hợp</p>
            </div>
          ) : (
            filteredDecisions.map((decision) => (
              <div
                key={decision.id}
                className={`${styles.decisionItem} ${
                  selectedDecision?.id === decision.id ? styles.decisionItemSelected : ''
                }`}
                onClick={() => setSelectedDecision(decision)}
              >
                <div className={styles.decisionHeader}>
                  <div className={styles.decisionRadio}>
                    {selectedDecision?.id === decision.id && (
                      <CheckCircle2 size={20} className={styles.checkIcon} />
                    )}
                  </div>
                  <div className={styles.decisionContent}>
                    <div className={styles.decisionTitle}>
                      <span className={styles.decisionCode}>{decision.code}</span>
                      <span className={styles.decisionType}>{decision.type}</span>
                    </div>
                    <p className={styles.decisionName}>{decision.title}</p>
                    {decision.summary && (
                      <p className={styles.decisionSummary}>{decision.summary}</p>
                    )}
                    <div className={styles.decisionMeta}>
                      <span className={styles.metaItem}>
                        <Calendar size={14} />
                        {new Date(decision.issueDate).toLocaleDateString('vi-VN')}
                      </span>
                      <span className={styles.metaItem}>
                        <User size={14} />
                        {decision.signer} - {decision.signerPosition}
                      </span>
                    </div>
                  </div>
                  {decision.pdfUrl && (
                    <div className={styles.decisionActions}>
                      <button
                        className={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(decision.pdfUrl, '_blank');
                        }}
                        title="Xem PDF"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info('Tính năng tải xuống đang phát triển');
                        }}
                        title="Tải xuống"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            onClick={handleClose}
            className={styles.cancelButton}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSelect}
            className={styles.selectButton}
            disabled={!selectedDecision}
          >
            <CheckCircle2 size={16} />
            Import đã chọn
          </button>
        </div>
      </div>
    </div>
  );
}

// Mock data for different decision types

// 1. Quyết định kiểm tra việc chấp hành pháp luật (M01)
const mockInspectionDecisions: InsDecision[] = [
  {
    id: 'INS-M01-001',
    code: '01/QĐ-KT',
    title: 'Quyết định kiểm tra việc chấp hành pháp luật trong sản xuất, kinh doanh hàng hóa Q1/2026',
    type: 'QĐ-KT',
    issueDate: '2026-01-10',
    signer: 'Nguyễn Văn A',
    signerPosition: 'Chi cục trưởng',
    summary: 'Kiểm tra 50 cơ sở kinh doanh thực phẩm tại Phường 1',
  },
  {
    id: 'INS-M01-002',
    code: '02/QĐ-KT',
    title: 'Quyết định kiểm tra đột xuất an toàn thực phẩm Tết Nguyên đán 2026',
    type: 'QĐ-KT',
    issueDate: '2026-01-12',
    signer: 'Trần Thị B',
    signerPosition: 'Phó Chi cục trưởng',
    summary: 'Kiểm tra đột xuất các cơ sở sản xuất bánh kẹo dịp Tết',
  },
];

// 2. Quyết định phân công công chức (M02)
const mockAssignmentDecisions: InsDecision[] = [
  {
    id: 'INS-M02-001',
    code: '05/QĐ-PC',
    title: 'Quyết định phân công công chức thực hiện biện pháp nghiệp vụ Q1/2026',
    type: 'QĐ-PC',
    issueDate: '2026-01-11',
    signer: 'Nguyễn Văn A',
    signerPosition: 'Chi cục trưởng',
    summary: 'Phân công 15 công chức tham gia đợt kiểm tra',
  },
  {
    id: 'INS-M02-002',
    code: '06/QĐ-PC',
    title: 'Quyết định phân công đoàn kiểm tra chuyên đề PCCC',
    type: 'QĐ-PC',
    issueDate: '2026-01-13',
    signer: 'Lê Văn C',
    signerPosition: 'Chi cục trưởng',
    summary: 'Phân công 3 đoàn kiểm tra PCCC tại các cơ sở rủi ro cao',
  },
];

// 3. Quyết định sửa đổi, bổ sung (M04) - Chỉ khi đã phê duyệt
const mockAmendmentDecisions: InsDecision[] = [
  {
    id: 'INS-M04-001',
    code: '10/QĐ-SĐ',
    title: 'Quyết định sửa đổi, bổ sung Quyết định kiểm tra 01/QĐ-KT',
    type: 'QĐ-SĐ',
    issueDate: '2026-01-15',
    signer: 'Nguyễn Văn A',
    signerPosition: 'Chi cục trưởng',
    summary: 'Bổ sung 10 cơ sở kinh doanh vào danh sách kiểm tra',
  },
];

// 4. Quyết định kéo dài/gia hạn (M05) - Chỉ khi đã phê duyệt
const mockExtensionDecisions: InsDecision[] = [
  {
    id: 'INS-M05-001',
    code: '12/QĐ-GH',
    title: 'Quyết định kéo dài thời hạn thẩm tra, xác minh đợt kiểm tra 01/QĐ-KT',
    type: 'QĐ-GH',
    issueDate: '2026-01-18',
    signer: 'Trần Thị B',
    signerPosition: 'Phó Chi cục trưởng',
    summary: 'Gia hạn thêm 15 ngày để hoàn thiện hồ sơ kiểm tra',
  },
];

// Component exports

interface InspectionDecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (decision: InsDecision) => void;
  selectedDecisionCode?: string;
}

export function InspectionDecisionModal(props: InspectionDecisionModalProps) {
  return (
    <DecisionModalBase
      {...props}
      title="Import từ INS"
      description="Quyết định kiểm tra việc chấp hành pháp luật trong sản xuất, kinh doanh hàng hóa, dịch vụ"
      decisions={mockInspectionDecisions}
    />
  );
}

export function AssignmentDecisionModal(props: InspectionDecisionModalProps) {
  return (
    <DecisionModalBase
      {...props}
      title="Import từ INS"
      description="Quyết định phân công công chức thực hiện biện pháp nghiệp vụ"
      decisions={mockAssignmentDecisions}
    />
  );
}

export function AmendmentDecisionModal(props: InspectionDecisionModalProps) {
  return (
    <DecisionModalBase
      {...props}
      title="Import từ INS"
      description="Quyết định sửa đổi, bổ sung Quyết định kiểm tra việc chấp hành pháp luật"
      decisions={mockAmendmentDecisions}
    />
  );
}

export function ExtensionDecisionModal(props: InspectionDecisionModalProps) {
  return (
    <DecisionModalBase
      {...props}
      title="Import từ INS"
      description="Quyết định kéo dài/Gia hạn thời hạn thẩm tra, xác minh"
      decisions={mockExtensionDecisions}
    />
  );
}
