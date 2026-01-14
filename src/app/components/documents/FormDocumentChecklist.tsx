import React, { useMemo } from 'react';
import { 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  FileText,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  History
} from 'lucide-react';
import styles from './FormDocumentChecklist.module.css';
import { Button } from '../ui/button';
import {
  type DocumentInstance,
  type DocumentChecklistItem,
  type DocumentSource,
  type DocumentRequirement,
  type DocumentStatus,
  getStatusLabel,
  getStatusColor,
  canPerformAction,
} from '../../../types/ins-documents';

export interface FormDocumentChecklistProps {
  title?: string;
  subtitle?: string;
  documents: DocumentChecklistItem[];
  onImportClick?: (documentId: string) => void;
  onCreateClick?: (documentId: string) => void;
  onEditClick?: (documentId: string) => void;
  onViewPdfClick?: (documentId: string) => void;
  onSignClick?: (documentId: string) => void;
  onPushToInsClick?: (documentId: string) => void;
  onSyncClick?: (documentId: string) => void;
  onViewLogClick?: () => void;
  showWarnings?: boolean;
  compact?: boolean;
}

export function FormDocumentChecklist({
  title = 'Hồ sơ biểu mẫu (INS)',
  subtitle,
  documents,
  onImportClick,
  onCreateClick,
  onEditClick,
  onViewPdfClick,
  onSignClick,
  onPushToInsClick,
  onSyncClick,
  onViewLogClick,
  showWarnings = true,
  compact = false,
}: FormDocumentChecklistProps) {
  // Calculate missing required documents
  const missingRequired = useMemo(() => {
    return documents.filter(
      doc => 
        doc.visible && 
        doc.requirement === 'required' && 
        (doc.instance.status === 'not_available' || doc.instance.status === 'error')
    ).length;
  }, [documents]);

  // Visible documents only
  const visibleDocuments = useMemo(() => {
    return documents.filter(doc => doc.visible);
  }, [documents]);

  // Check if all required documents are complete
  const allRequiredComplete = useMemo(() => {
    return documents
      .filter(doc => doc.visible && doc.requirement === 'required')
      .every(doc => 
        ['content_ready', 'pdf_generated', 'signed', 'pushed_to_ins'].includes(doc.instance.status)
      );
  }, [documents]);

  const renderStatusBadge = (status: DocumentStatus) => {
    const color = getStatusColor(status);
    const label = getStatusLabel(status);

    return (
      <div className={styles.statusBadge} style={{ backgroundColor: `${color}15`, color }}>
        <div className={styles.statusDot} style={{ backgroundColor: color }} />
        {label}
      </div>
    );
  };

  const renderSourceBadge = (source: DocumentSource) => {
    return (
      <span className={`${styles.sourceBadge} ${styles[source]}`}>
        {source === 'import' ? (
          <>
            <Download size={12} />
            Import từ INS
          </>
        ) : (
          <>
            <Upload size={12} />
            Lập tại phần mềm
          </>
        )}
      </span>
    );
  };

  const renderRequirementBadge = (requirement: DocumentRequirement) => {
    return (
      <span className={`${styles.requirementBadge} ${styles[requirement]}`}>
        {requirement === 'required' ? 'Bắt buộc' : 'Tùy chọn'}
      </span>
    );
  };

  const renderActions = (doc: DocumentChecklistItem) => {
    const { instance, template } = doc;
    const { source, status } = instance;

    if (doc.disabled) {
      return null;
    }

    // Import actions
    if (source === 'import') {
      return (
        <div className={styles.actions}>
          {status === 'not_available' && onImportClick && (
            <Button
              variant="ghost"
              size="sm"
              className={styles.actionButton}
              onClick={() => onImportClick(instance.id)}
              title="Chọn từ INS"
            >
              <Download size={16} />
            </Button>
          )}
          {status !== 'not_available' && onSyncClick && (
            <Button
              variant="ghost"
              size="sm"
              className={styles.actionButton}
              onClick={() => onSyncClick(instance.id)}
              title="Đồng bộ lại"
            >
              <RefreshCw size={16} />
            </Button>
          )}
          {canPerformAction(status, 'view_pdf') && onViewPdfClick && (
            <Button
              variant="ghost"
              size="sm"
              className={styles.actionButton}
              onClick={() => onViewPdfClick(instance.id)}
              title="Xem"
            >
              <Eye size={16} />
            </Button>
          )}
        </div>
      );
    }

    // Export actions
    return (
      <div className={styles.actions}>
        {(status === 'not_available' || status === 'error') && onCreateClick && (
          <Button
            variant="ghost"
            size="sm"
            className={styles.actionButton}
            onClick={() => onCreateClick(instance.id)}
            title="Tạo"
          >
            <FileText size={16} />
          </Button>
        )}
        {canPerformAction(status, 'edit') && onEditClick && (
          <Button
            variant="ghost"
            size="sm"
            className={styles.actionButton}
            onClick={() => onEditClick(instance.id)}
            title="Sửa"
          >
            <Edit size={16} />
          </Button>
        )}
        {canPerformAction(status, 'view_pdf') && onViewPdfClick && (
          <Button
            variant="ghost"
            size="sm"
            className={styles.actionButton}
            onClick={() => onViewPdfClick(instance.id)}
            title="Xem PDF"
          >
            <Eye size={16} />
          </Button>
        )}
        {canPerformAction(status, 'push_to_ins') && onPushToInsClick && (
          <Button
            variant="ghost"
            size="sm"
            className={styles.actionButton}
            onClick={() => onPushToInsClick(instance.id)}
            title="Đẩy INS"
          >
            <Upload size={16} />
          </Button>
        )}
      </div>
    );
  };

  const renderDocumentRow = (doc: DocumentChecklistItem) => {
    const { instance, template, requirement, disabled } = doc;
    const isNested = !!instance.parentDocumentId;

    return (
      <div
        key={instance.id}
        className={`${styles.documentRow} ${disabled ? styles.disabled : ''} ${isNested ? styles.nested : ''}`}
      >
        <div className={styles.documentNumber}>
          {template.number}
        </div>

        <div className={styles.documentInfo}>
          <div className={styles.documentName}>
            <span className={styles.documentSymbol}>{template.symbol}</span>
            {template.name}
          </div>
          <div className={styles.documentMeta}>
            {renderSourceBadge(template.source)}
            {renderRequirementBadge(requirement)}
            {doc.warning && (
              <span style={{ color: 'var(--color-warning)', fontSize: 'var(--font-size-xs)' }}>
                {doc.warning}
              </span>
            )}
          </div>
        </div>

        {renderStatusBadge(instance.status)}

        {renderActions(doc)}
      </div>
    );
  };

  if (visibleDocuments.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
        <div className={styles.emptyState}>
          Không có biểu mẫu nào cần hiển thị trong ngữ cảnh này
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>

      {/* Warning/Success Alert */}
      {showWarnings && (
        <>
          {missingRequired > 0 ? (
            <div className={styles.alert}>
              <AlertCircle size={20} className={styles.alertIcon} />
              <div className={styles.alertContent}>
                <div className={styles.alertTitle}>
                  Thiếu {missingRequired} biểu mẫu bắt buộc
                </div>
                <div className={styles.alertMessage}>
                  Vui lòng hoàn thiện các biểu mẫu bắt buộc để thực hiện thao tác này
                </div>
              </div>
            </div>
          ) : allRequiredComplete ? (
            <div className={`${styles.alert} ${styles.successAlert}`}>
              <CheckCircle2 size={20} className={styles.alertIcon} />
              <div className={styles.alertContent}>
                <div className={styles.alertTitle}>
                  Đã đủ biểu mẫu bắt buộc
                </div>
                <div className={styles.alertMessage}>
                  Tất cả biểu mẫu bắt buộc đã được hoàn thiện
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* Document List */}
      <div className={styles.documentList}>
        {visibleDocuments.map(renderDocumentRow)}
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
    </div>
  );
}
