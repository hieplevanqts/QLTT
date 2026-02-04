import React, { useState } from 'react';
import { Search, FileText, Calendar, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import styles from './SelectInsDecisionModal.module.css';

export interface InsDecision {
  id: string;
  code: string; // Số QĐ
  title: string; // Tiêu đề
  type: string; // Loại QĐ
  issueDate: string; // Ngày ban hành
  signer: string; // Người ký
  signerPosition: string; // Chức vụ
  summary?: string; // Tóm tắt nội dung
}

interface SelectInsDecisionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentCode: 'M03'; // Chỉ hỗ trợ M03 cho kế hoạch
  documentName: string;
  onSelect: (decision: InsDecision) => void;
}

// Mock data - Danh sách QĐ giao quyền từ INS
const mockInsDecisions: InsDecision[] = [
  {
    id: 'INS-M03-001',
    code: '123/QĐ-QLTT',
    title: 'Quyết định giao quyền ban hành quyết định kiểm tra năm 2026',
    type: 'QĐ-GQ',
    issueDate: '2026-01-05',
    signer: 'Nguyễn Văn A',
    signerPosition: 'Cục trưởng',
    summary: 'Giao quyền cho Chi cục QLTT các Phường/Xã ban hành quyết định kiểm tra',
  },
  {
    id: 'INS-M03-002',
    code: '122/QĐ-QLTT',
    title: 'Quyết định giao quyền ban hành quyết định kiểm tra quý I/2026',
    type: 'QĐ-GQ',
    issueDate: '2026-01-03',
    signer: 'Trần Thị B',
    signerPosition: 'Phó Cục trưởng',
    summary: 'Giao quyền cho Trưởng phòng ban hành quyết định kiểm tra',
  },
  {
    id: 'INS-M03-003',
    code: '115/QĐ-QLTT',
    title: 'Quyết định giao quyền ban hành quyết định kiểm tra đột xuất',
    type: 'QĐ-GQ',
    issueDate: '2025-12-28',
    signer: 'Lê Văn C',
    signerPosition: 'Cục trưởng',
    summary: 'Giao quyền ban hành quyết định kiểm tra đột xuất cho Phó Chi cục',
  },
];

export function SelectInsDecisionModal({
  open,
  onOpenChange,
  documentCode,
  documentName,
  onSelect,
}: SelectInsDecisionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<InsDecision | null>(null);

  // Filter decisions based on search
  const filteredDecisions = mockInsDecisions.filter(decision => {
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
              <h2 className={styles.title}>Chọn từ hệ thống INS</h2>
              <p className={styles.subtitle}>{documentName}</p>
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
