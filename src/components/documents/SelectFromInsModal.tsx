import React, { useState } from 'react';
import { Search, FileText, Calendar, User, Building2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import styles from './SelectFromInsModal.module.css';
import type { DocumentCode } from '../../../types/ins-documents';

export interface InsDocument {
  id: string;
  code: string; // Số quyết định/biên bản
  title: string;
  issuedDate: string;
  issuedBy: string;
  unit: string;
  content?: string;
  targets?: string[];
  validUntil?: string;
}

export interface SelectFromInsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentCode: DocumentCode;
  documentName: string;
  onSelect: (document: InsDocument) => void;
}

// Mock INS documents for demonstration
const MOCK_INS_DOCUMENTS: Record<DocumentCode, InsDocument[]> = {
  M01: [
    {
      id: 'ins_qd_001',
      code: '01/QĐ-KT',
      title: 'Quyết định kiểm tra cơ sở kinh doanh thực phẩm Phường 1',
      issuedDate: '2026-01-05',
      issuedBy: 'Nguyễn Văn A',
      unit: 'Chi cục QLTT Hà Nội',
      content: 'Kiểm tra việc chấp hành pháp luật về an toàn thực phẩm',
      targets: ['Cơ sở A', 'Cơ sở B', 'Cơ sở C'],
      validUntil: '2026-01-15',
    },
    {
      id: 'ins_qd_002',
      code: '02/QĐ-KT',
      title: 'Quyết định kiểm tra cơ sở kinh doanh dược phẩm Phường 3',
      issuedDate: '2026-01-03',
      issuedBy: 'Trần Thị B',
      unit: 'Chi cục QLTT Hà Nội',
      content: 'Kiểm tra việc chấp hành pháp luật về dược phẩm',
      targets: ['Nhà thuốc X', 'Nhà thuốc Y'],
      validUntil: '2026-01-13',
    },
  ],
  M03: [
    {
      id: 'ins_gq_001',
      code: '01/QĐ-GQ',
      title: 'Quyết định giao quyền ban hành quyết định kiểm tra',
      issuedDate: '2026-01-01',
      issuedBy: 'Cục trưởng Cục QLTT',
      unit: 'Cục QLTT Hà Nội',
      content: 'Giao quyền cho Chi cục trưởng Chi cục QLTT các Phường/Xã',
    },
  ],
  M04: [
    {
      id: 'ins_nv_001',
      code: '01/QĐ-NV',
      title: 'Quyết định phân công nhiệm vụ đoàn kiểm tra',
      issuedDate: '2026-01-06',
      issuedBy: 'Trưởng đoàn',
      unit: 'Chi cục QLTT Hà Nội',
      content: 'Phân công nhiệm vụ cụ thể cho từng thành viên đoàn kiểm tra',
    },
  ],
  M02: [],
  M05: [],
  M06: [],
  M07: [],
  M08: [],
  M09: [],
  M10: [],
  M11: [],
  M12: [],
};

export function SelectFromInsModal({
  open,
  onOpenChange,
  documentCode,
  documentName,
  onSelect,
}: SelectFromInsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<InsDocument | null>(null);

  // Get mock documents for this type
  const documents = MOCK_INS_DOCUMENTS[documentCode] || [];

  // Filter documents by search query
  const filteredDocuments = documents.filter(doc =>
    doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (doc: InsDocument) => {
    setSelectedDocument(doc);
  };

  const handleConfirm = () => {
    if (selectedDocument) {
      onSelect(selectedDocument);
      onOpenChange(false);
      setSearchQuery('');
      setSelectedDocument(null);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearchQuery('');
    setSelectedDocument(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Chọn từ INS</DialogTitle>
          <DialogDescription>{documentName}</DialogDescription>
        </DialogHeader>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchInputGroup}>
            <Input
              placeholder="Tìm kiếm theo số, tiêu đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
            />
            <Button variant="outline">
              <Search size={16} />
            </Button>
          </div>
        </div>

        {/* Results List */}
        <div className={styles.resultsList}>
          {filteredDocuments.length === 0 ? (
            <div className={styles.emptyState}>
              <FileText size={48} className={styles.emptyStateIcon} />
              <div className={styles.emptyStateTitle}>
                Không tìm thấy tài liệu
              </div>
              <div className={styles.emptyStateMessage}>
                Không có tài liệu nào trong INS phù hợp với tiêu chí tìm kiếm
              </div>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`${styles.resultItem} ${selectedDocument?.id === doc.id ? styles.selected : ''}`}
                onClick={() => handleSelect(doc)}
              >
                <div className={styles.resultHeader}>
                  <div className={styles.resultCode}>{doc.code}</div>
                  <div className={styles.resultDate}>
                    {new Date(doc.issuedDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className={styles.resultContent}>
                  <div className={styles.resultTitle}>{doc.title}</div>
                  <div className={styles.resultMeta}>
                    <div className={styles.metaItem}>
                      <User size={12} />
                      {doc.issuedBy}
                    </div>
                    <div className={styles.metaItem}>
                      <Building2 size={12} />
                      {doc.unit}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Preview Section */}
        {selectedDocument && (
          <div className={styles.preview}>
            <div className={styles.previewTitle}>Chi tiết</div>
            <div className={styles.previewContent}>
              <div className={styles.previewRow}>
                <div className={styles.previewLabel}>Số quyết định:</div>
                <div className={styles.previewValue}>{selectedDocument.code}</div>
              </div>
              <div className={styles.previewRow}>
                <div className={styles.previewLabel}>Ngày ban hành:</div>
                <div className={styles.previewValue}>
                  {new Date(selectedDocument.issuedDate).toLocaleDateString('vi-VN')}
                </div>
              </div>
              <div className={styles.previewRow}>
                <div className={styles.previewLabel}>Người ban hành:</div>
                <div className={styles.previewValue}>{selectedDocument.issuedBy}</div>
              </div>
              <div className={styles.previewRow}>
                <div className={styles.previewLabel}>Đơn vị:</div>
                <div className={styles.previewValue}>{selectedDocument.unit}</div>
              </div>
              {selectedDocument.content && (
                <div className={styles.previewRow}>
                  <div className={styles.previewLabel}>Nội dung:</div>
                  <div className={styles.previewValue}>{selectedDocument.content}</div>
                </div>
              )}
              {selectedDocument.targets && selectedDocument.targets.length > 0 && (
                <div className={styles.previewRow}>
                  <div className={styles.previewLabel}>Đối tượng:</div>
                  <div className={styles.previewValue}>
                    {selectedDocument.targets.join(', ')}
                  </div>
                </div>
              )}
              {selectedDocument.validUntil && (
                <div className={styles.previewRow}>
                  <div className={styles.previewLabel}>Hiệu lực đến:</div>
                  <div className={styles.previewValue}>
                    {new Date(selectedDocument.validUntil).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedDocument}>
            Import tài liệu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
