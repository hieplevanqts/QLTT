import React, { useState, useEffect } from 'react';
import { Download, Upload, Eye, Edit, FileText, RefreshCw, History, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CenteredModalShell } from '../overlays/CenteredModalShell';
import { EnterpriseModalHeader } from '../overlays/EnterpriseModalHeader';
import styles from './PlanDocumentDrawer.module.css';
import { useDocumentChecklist } from '../../../hooks/useDocumentChecklist';
import { getStatusLabel, getStatusColor } from '../../../types/ins-documents';
import type { Plan, PlanType } from '../../data/kehoach-mock-data';
import type { DocumentCode } from '../../../types/ins-documents';

export interface PlanDocumentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
  onImportClick?: (documentCode: DocumentCode) => void;
  onCreateClick?: (documentCode: DocumentCode) => void;
  onEditClick?: (documentCode: DocumentCode) => void;
  onViewPdfClick?: (documentCode: DocumentCode) => void;
  onPushToInsClick?: (documentCode: DocumentCode) => void;
  onSyncClick?: (documentCode: DocumentCode) => void;
  onViewLogClick?: () => void;
  highlightMissingDocs?: boolean; // Auto highlight missing required docs
}

export function PlanDocumentDrawer({
  open,
  onOpenChange,
  plan,
  onImportClick,
  onCreateClick,
  onEditClick,
  onViewPdfClick,
  onPushToInsClick,
  onSyncClick,
  onViewLogClick,
  highlightMissingDocs = false,
}: PlanDocumentDrawerProps) {
  // Local state for controls
  const [planTypeControl, setPlanTypeControl] = useState<PlanType>(plan.planType);
  const [hasAuthorization, setHasAuthorization] = useState(plan.hasAuthorization || false);

  // Update when plan changes
  useEffect(() => {
    setPlanTypeControl(plan.planType);
    setHasAuthorization(plan.hasAuthorization || false);
  }, [plan]);

  // Get document checklist
  const { documents, validation } = useDocumentChecklist('plan_edit', {
    planType: planTypeControl,
    hasAuthorization,
  });

  // Get missing required document names
  const missingRequiredDocs = documents
    .filter(
      doc =>
        doc.visible &&
        doc.requirement === 'required' &&
        (doc.instance.status === 'not_available' || doc.instance.status === 'error')
    )
    .map(doc => doc.template.name);

  const renderStatusBadge = (status: string) => {
    const color = getStatusColor(status as any);
    const label = getStatusLabel(status as any);

    return (
      <div className={styles.statusBadge} style={{ backgroundColor: `${color}15`, color }}>
        <div className={styles.statusDot} style={{ backgroundColor: color }} />
        {label}
      </div>
    );
  };

  const renderSourceBadge = (source: 'import' | 'export') => {
    return (
      <span className={`${styles.sourceBadge} ${styles[source]}`}>
        {source === 'import' ? (
          <>
            <Download size={10} />
            Import INS
          </>
        ) : (
          <>
            <Upload size={10} />
            Export INS
          </>
        )}
      </span>
    );
  };

  const renderActions = (doc: any) => {
    const { instance, template } = doc;
    const { source, status } = instance;

    if (doc.disabled) {
      return null;
    }

    // Import actions
    if (source === 'import') {
      return (
        <div className={styles.documentActions}>
          {status === 'not_available' && onImportClick && (
            <button
              className={styles.actionButton}
              onClick={() => onImportClick(template.code)}
              title="Chọn từ INS"
            >
              <Download size={16} />
            </button>
          )}
          {status !== 'not_available' && onSyncClick && (
            <button
              className={styles.actionButton}
              onClick={() => onSyncClick(template.code)}
              title="Đồng bộ lại"
            >
              <RefreshCw size={16} />
            </button>
          )}
          {status !== 'not_available' && onViewPdfClick && (
            <button
              className={styles.actionButton}
              onClick={() => onViewPdfClick(template.code)}
              title="Xem"
            >
              <Eye size={16} />
            </button>
          )}
        </div>
      );
    }

    // Export actions
    return (
      <div className={styles.documentActions}>
        {(status === 'not_available' || status === 'error') && onCreateClick && (
          <button
            className={styles.actionButton}
            onClick={() => onCreateClick(template.code)}
            title="Tạo"
          >
            <FileText size={16} />
          </button>
        )}
        {status !== 'not_available' && status !== 'error' && onEditClick && (
          <button
            className={styles.actionButton}
            onClick={() => onEditClick(template.code)}
            title="Sửa"
          >
            <Edit size={16} />
          </button>
        )}
        {['pdf_generated', 'signed', 'pushed_to_ins'].includes(status) && onViewPdfClick && (
          <button
            className={styles.actionButton}
            onClick={() => onViewPdfClick(template.code)}
            title="Xem PDF"
          >
            <Eye size={16} />
          </button>
        )}
        {['pdf_generated', 'signed'].includes(status) && onPushToInsClick && (
          <button
            className={styles.actionButton}
            onClick={() => onPushToInsClick(template.code)}
            title="Đẩy INS"
          >
            <Upload size={16} />
          </button>
        )}
      </div>
    );
  };

  const visibleDocuments = documents.filter(doc => doc.visible);

  return (
    <CenteredModalShell
      header={
        <EnterpriseModalHeader
          title="Hồ sơ biểu mẫu (INS)"
          code={plan.id}
          moduleTag="plans"
        />
      }
      open={open}
      onClose={() => onOpenChange(false)}
      width={720}
    >
      <div className={styles.header}>
        <div className="text-sm text-muted-foreground">Quản lý biểu mẫu cho kế hoạch</div>

        {/* Plan Info */}
        <div className={styles.planInfo}>
          <div className={styles.planInfoRow}>
            <span className={styles.planInfoLabel}>Kế hoạch:</span>
            <span className={styles.planInfoValue}>{plan.name}</span>
          </div>
          <div className={styles.planInfoRow}>
            <span className={styles.planInfoLabel}>Mã:</span>
            <span className={styles.planInfoValue}>{plan.id}</span>
          </div>
          <div className={styles.planInfoRow}>
            <span className={styles.planInfoLabel}>Trạng thái:</span>
            <span className={styles.planInfoValue}>{plan.status}</span>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          {/* Plan Type Control */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Loại kế hoạch</label>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleButton} ${planTypeControl === 'periodic' ? styles.active : ''}`}
                onClick={() => setPlanTypeControl('periodic')}
              >
                Định kỳ
              </button>
              <button
                className={`${styles.toggleButton} ${planTypeControl === 'thematic' ? styles.active : ''}`}
                onClick={() => setPlanTypeControl('thematic')}
              >
                Chuyên đề
              </button>
              <button
                className={`${styles.toggleButton} ${planTypeControl === 'urgent' ? styles.active : ''}`}
                onClick={() => setPlanTypeControl('urgent')}
              >
                Đột xuất
              </button>
            </div>
          </div>

          {/* Authorization Control */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Có sử dụng ủy quyền?</label>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleButton} ${!hasAuthorization ? styles.active : ''}`}
                onClick={() => setHasAuthorization(false)}
              >
                No
              </button>
              <button
                className={`${styles.toggleButton} ${hasAuthorization ? styles.active : ''}`}
                onClick={() => setHasAuthorization(true)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>

        {/* Banner */}
        {missingRequiredDocs.length > 0 ? (
          <div className={styles.banner}>
            <AlertCircle size={18} className={styles.bannerIcon} />
            <div className={styles.bannerText}>
              <strong>Thiếu biểu mẫu bắt buộc:</strong> {missingRequiredDocs.join(', ')}
            </div>
          </div>
        ) : validation.allRequiredComplete ? (
          <div className={`${styles.banner} ${styles.successBanner}`}>
            <CheckCircle2 size={18} className={styles.bannerIcon} />
            <div className={styles.bannerText}>
              <strong>Đã đủ biểu mẫu bắt buộc</strong>
            </div>
          </div>
        ) : null}
      </div>

      {/* Document List */}
      <div className={styles.content}>
          {visibleDocuments.length === 0 ? (
            <div className={styles.emptyState}>
              Không có biểu mẫu nào cần hiển thị với cấu hình hiện tại
            </div>
          ) : (
            visibleDocuments.map(doc => {
              const isHighlighted =
                highlightMissingDocs &&
                doc.requirement === 'required' &&
                (doc.instance.status === 'not_available' || doc.instance.status === 'error');

              return (
                <div
                  key={doc.instance.id}
                  className={`${styles.documentItem} ${isHighlighted ? styles.highlighted : ''}`}
                >
                  <div className={styles.documentHeader}>
                    <div className={styles.documentInfo}>
                      {/* Document Title (TÊN BIỂU MẪU - không dùng mã) */}
                      <div className={styles.documentTitle}>{doc.template.name}</div>

                      {/* Document Meta (mã/ký hiệu ở dưới nhỏ) */}
                      <div className={styles.documentMeta}>
                        <div className={styles.metaItem}>
                          Mẫu số {doc.template.number}
                        </div>
                        <div className={styles.metaItem}>•</div>
                        <div className={styles.metaItem}>
                          Ký hiệu: {doc.template.symbol}
                        </div>
                        <div className={styles.metaItem}>•</div>
                        {renderSourceBadge(doc.template.source)}
                        {doc.requirement === 'required' && (
                          <>
                            <div className={styles.metaItem}>•</div>
                            <span className={styles.requiredBadge}>Bắt buộc</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      {renderStatusBadge(doc.instance.status)}
                      {renderActions(doc)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      {/* Footer */}
      {onViewLogClick && (
        <div className={styles.footer}>
          <button className={styles.footerLink} onClick={onViewLogClick}>
            <History size={14} />
            Xem lịch sử đồng bộ INS
          </button>
        </div>
      )}
    </CenteredModalShell>
  );
}
