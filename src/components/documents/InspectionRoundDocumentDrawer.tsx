import React, { useState, useMemo } from 'react';
import { X, FileText, AlertCircle, CheckCircle2, Download, Upload, Edit, Eye, RefreshCw, History } from 'lucide-react';
import { Sheet, SheetContent } from '../ui/sheet';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import styles from './PlanDocumentDrawer.module.css'; // Reuse same styles
import type { InspectionRound } from '../../data/inspection-rounds-mock-data';
import type { DocumentCode } from '../../../types/ins-documents';
import { useDocumentChecklist } from '../../../hooks/useDocumentChecklist';

/**
 * ĐỢT KIỂM TRA - 4 Biểu mẫu Import từ INS
 * 
 * Mẫu 01: QĐ-KT - Quyết định kiểm tra
 * Mẫu 04: QĐ-NV - Quyết định phân công công chức  
 * Mẫu 02: QĐ-SĐBSKT - Quyết định sửa đổi, bổ sung
 * Mẫu 05: QĐ-KDGH - Quyết định kéo dài/gia hạn
 */

interface InspectionRoundDocumentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  round: InspectionRound;
  highlightMissingDocs?: boolean;
  onImportClick?: (code: DocumentCode) => void;
  onCreateClick?: (code: DocumentCode) => void;
  onEditClick?: (code: DocumentCode) => void;
  onViewPdfClick?: (code: DocumentCode) => void;
  onPushToInsClick?: (code: DocumentCode) => void;
  onSyncClick?: (code: DocumentCode) => void;
  onViewLogClick?: () => void;
}

export function InspectionRoundDocumentDrawer({
  open,
  onOpenChange,
  round,
  highlightMissingDocs = false,
  onImportClick,
  onCreateClick,
  onEditClick,
  onViewPdfClick,
  onPushToInsClick,
  onSyncClick,
  onViewLogClick,
}: InspectionRoundDocumentDrawerProps) {
  
  const { documents } = useDocumentChecklist({
    entityType: 'inspection_round',
    entityId: round.id,
  });

  // ĐỢT KIỂM TRA: 4 biểu mẫu Import từ INS
  const ROUND_DOCUMENTS = [
    {
      code: 'M01' as DocumentCode,
      name: 'Quyết định kiểm tra việc chấp hành pháp luật trong sản xuất, kinh doanh hàng hóa, dịch vụ',
      shortCode: 'QĐ-KT',
      direction: 'import' as const,
      required: true,
      description: 'Quyết định chính thức để khởi động đợt kiểm tra',
    },
    {
      code: 'M04' as DocumentCode,
      name: 'Quyết định phân công công chức thực hiện biện pháp nghiệp vụ',
      shortCode: 'QĐ-NV',
      direction: 'import' as const,
      required: true,
      description: 'Phân công nhiệm vụ cụ thể cho từng công chức trong đoàn',
    },
    {
      code: 'M02' as DocumentCode,
      name: 'Quyết định sửa đổi, bổ sung Quyết định kiểm tra việc chấp hành pháp luật...',
      shortCode: 'QĐ-SĐBSKT',
      direction: 'import' as const,
      required: false,
      description: 'Điều chỉnh nội dung, đối tượng hoặc kéo dài thời hạn',
    },
    {
      code: 'M05' as DocumentCode,
      name: 'Quyết định kéo dài/Gia hạn thời hạn thẩm tra, xác minh',
      shortCode: 'QĐ-KDGH',
      direction: 'import' as const,
      required: false,
      description: 'Kéo dài/gia hạn thời hạn thẩm tra, xác minh',
    },
  ];

  // Check missing required documents
  const missingRequired = useMemo(() => {
    return ROUND_DOCUMENTS.filter(
      (doc) => doc.required && !documents[doc.code]
    );
  }, [documents]);

  const hasAllRequired = missingRequired.length === 0;

  // Get document status
  const getDocStatus = (code: DocumentCode) => {
    const doc = documents[code];
    if (!doc) return { status: 'missing', label: 'Chưa có', color: '#94A3B8' };
    if (doc.status === 'draft') return { status: 'draft', label: 'Nháp', color: '#F59E0B' };
    if (doc.status === 'synced') return { status: 'synced', label: 'Đã đồng bộ', color: '#10B981' };
    return { status: 'pending', label: 'Chờ đồng bộ', color: '#3B82F6' };
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-[600px] sm:w-[600px] p-0 flex flex-col"
        style={{ maxWidth: '600px' }}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <FileText size={20} />
            Hồ sơ biểu mẫu - Đợt kiểm tra
          </div>
          
          <div className={styles.planInfo}>
            <div className={styles.planInfoRow}>
              <span className={styles.planInfoLabel}>Tên đợt:</span>
              <span className={styles.planInfoValue}>{round.name}</span>
            </div>
            <div className={styles.planInfoRow}>
              <span className={styles.planInfoLabel}>Mã đợt:</span>
              <span className={styles.planInfoValue}>{round.code}</span>
            </div>
            <div className={styles.planInfoRow}>
              <span className={styles.planInfoLabel}>Thời gian:</span>
              <span className={styles.planInfoValue}>
                {round.startDate} - {round.endDate}
              </span>
            </div>
          </div>

          {/* Warning/Success Banner */}
          {highlightMissingDocs && !hasAllRequired && (
            <div className={styles.banner}>
              <div className={styles.bannerIcon}>
                <AlertCircle size={18} />
              </div>
              <div className={styles.bannerText}>
                <strong>Thiếu {missingRequired.length} biểu mẫu bắt buộc:</strong>{' '}
                {missingRequired.map((d) => d.shortCode).join(', ')}
              </div>
            </div>
          )}

          {highlightMissingDocs && hasAllRequired && (
            <div className={`${styles.banner} ${styles.successBanner}`}>
              <div className={styles.bannerIcon}>
                <CheckCircle2 size={18} />
              </div>
              <div className={styles.bannerText}>
                <strong>Đã đủ hồ sơ bắt buộc</strong> - Có thể gửi trình duyệt
              </div>
            </div>
          )}
        </div>

        {/* Document List */}
        <div className={styles.content} style={{ flex: 1, overflowY: 'auto' }}>
          {ROUND_DOCUMENTS.map((doc) => {
            const status = getDocStatus(doc.code);
            const hasDoc = documents[doc.code];
            const isHighlighted = highlightMissingDocs && doc.required && !hasDoc;

            return (
              <div
                key={doc.code}
                className={`${styles.documentItem} ${isHighlighted ? styles.highlighted : ''}`}
              >
                <div className={styles.documentHeader}>
                  <div className={styles.documentInfo}>
                    <div className={styles.documentTitle}>
                      <strong>{doc.shortCode}</strong> - {doc.name}
                    </div>
                    <div className={styles.documentMeta}>
                      <div className={styles.metaItem}>
                        <span className={`${styles.sourceBadge} ${styles[doc.direction]}`}>
                          {doc.direction === 'import' ? (
                            <>
                              <Download size={12} />
                              Import từ INS
                            </>
                          ) : (
                            <>
                              <Upload size={12} />
                              Export sang INS
                            </>
                          )}
                        </span>
                      </div>
                      {doc.required && (
                        <span className={styles.requiredBadge}>Bắt buộc</span>
                      )}
                    </div>
                    {doc.description && (
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                        {doc.description}
                      </div>
                    )}
                  </div>

                  <div
                    className={styles.statusBadge}
                    style={{
                      backgroundColor: `${status.color}15`,
                      color: status.color,
                    }}
                  >
                    <div
                      className={styles.statusDot}
                      style={{ backgroundColor: status.color }}
                    />
                    {status.label}
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.documentActions}>
                  {/* Import from INS - for import docs without data */}
                  {doc.direction === 'import' && !hasDoc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onImportClick?.(doc.code)}
                      title="Lấy từ INS"
                    >
                      <Download size={16} />
                      Lấy từ INS
                    </Button>
                  )}

                  {/* View PDF */}
                  {hasDoc && (
                    <button
                      className={styles.actionButton}
                      onClick={() => onViewPdfClick?.(doc.code)}
                      title="Xem PDF"
                    >
                      <Eye size={16} />
                    </button>
                  )}

                  {/* Sync - for import docs with data */}
                  {doc.direction === 'import' && hasDoc && (
                    <button
                      className={styles.actionButton}
                      onClick={() => onSyncClick?.(doc.code)}
                      title="Đồng bộ lại từ INS"
                    >
                      <RefreshCw size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.footerLink} onClick={onViewLogClick}>
            <History size={16} />
            Xem lịch sử đồng bộ với INS
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
