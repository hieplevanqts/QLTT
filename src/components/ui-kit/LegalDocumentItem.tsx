import { FileText, Home, Shield, ChevronRight, Upload, Edit, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import styles from './LegalDocumentItem.module.css';

export type DocumentStatus = 'valid' | 'expiring' | 'missing';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface LegalDocument {
  id: string;
  type: string;
  title: string;
  status: DocumentStatus;
  statusText?: string;
  approvalStatus?: ApprovalStatus;
  approvalStatusText?: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  notes?: string;
  fileUrl?: string;
  fileName?: string;
  backFileUrl?: string;  // For ID cards with 2 sides
  backFileName?: string; // For ID cards with 2 sides
  uploadDate?: string;
  uploadedBy?: string;
  uploadedData?: any;
}

interface LegalDocumentItemProps {
  document: LegalDocument;
  onClick?: () => void;
  onUploadClick?: (docType: string) => void;
  onEditClick?: (doc: any) => void;
  onApprove?: (docId: string) => void;
  onReject?: (docId: string) => void;
}

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'cccd':
      return FileText;
    case 'business-license':
      return FileText;
    case 'lease-contract':
      return Home;
    case 'food-safety':
      return Shield;
    case 'specialized-license':
      return FileText;
    case 'fire-safety':
      return Shield;
    default:
      return FileText;
  }
};

export function LegalDocumentItem({ document, onClick, onUploadClick, onEditClick, onApprove, onReject }: LegalDocumentItemProps) {
  const Icon = getDocumentIcon(document.type);
  const isMissing = document.status === 'missing';

  const getIconClass = () => {
    if (document.status === 'valid') return styles.iconValid;
    if (document.status === 'expiring') return styles.iconExpiring;
    return styles.iconMissing;
  };

  return (
    <div
      className={`${styles.documentItem} ${isMissing ? styles.documentItemMissing : ''}`}
      onClick={isMissing ? undefined : onClick}
    >
      <div className={`${styles.documentIcon} ${getIconClass()}`}>
        <Icon size={20} />
      </div>

      <div className={styles.documentContent}>
        <div className={styles.documentTitle}>{document.title}</div>

        {!isMissing && (
          <div className={styles.documentMeta}>
            {document.documentNumber && (
              <span className={styles.metaItem}>Số: {document.documentNumber}</span>
            )}
            {document.issueDate && (
              <span className={styles.metaItem}>Ngày cấp: {document.issueDate}</span>
            )}
            {document.expiryDate && (
              <span className={styles.metaItem}>HH: {document.expiryDate}</span>
            )}
          </div>
        )}

        <div className={styles.documentStatus}>
          {document.statusText && (
            <Badge
              variant={
                document.status === 'valid' ? 'secondary' :
                  document.status === 'expiring' ? 'default' :
                    'outline'
              }
              className={
                document.status === 'valid' ? styles.badgeValid :
                  document.status === 'expiring' ? styles.badgeExpiring :
                    ''
              }
            >
              {document.statusText}
            </Badge>
          )}
          {document.approvalStatusText && (
            <Badge
              variant="secondary"
              className={
                document.approvalStatus === 'pending' ? styles.badgePending :
                  document.approvalStatus === 'approved' ? styles.badgeApproved :
                    document.approvalStatus === 'rejected' ? styles.badgeRejected :
                      ''
              }
            >
              {document.approvalStatusText}
            </Badge>
          )}
        </div>
      </div>

      <div className={styles.documentAction}>
        {isMissing ? (
          <Button
            size="sm"
            variant="outline"
            className={styles.uploadButton}
            onClick={(e) => {
              e.stopPropagation();
              onUploadClick?.(document.type);
            }}
          >
            <Upload size={16} />
            Tải lên
          </Button>
        ) : (
          <div className={styles.actionButtons}>
            {onEditClick && (
              <Button
                size="sm"
                variant="outline"
                className={styles.editButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick?.(document);
                }}
              >
                <Edit size={16} />
                Cập nhật hồ sơ
              </Button>
            )}
            
            {/* Phê duyệt/Từ chối buttons */}
            {document.approvalStatus === 'pending' && (
              <div className={styles.approvalActions}>
                {onApprove && (
                  <Button
                    size="sm"
                    variant="outline"
                    className={styles.approveButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove?.(document.id);
                    }}
                  >
                    <CheckCircle2 size={16} />
                    Phê duyệt
                  </Button>
                )}
                {onReject && (
                  <Button
                    size="sm"
                    variant="outline"
                    className={styles.rejectButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject?.(document.id);
                    }}
                  >
                    <XCircle size={16} />
                    Từ chối
                  </Button>
                )}
              </div>
            )}
            
            <ChevronRight size={20} className={styles.chevron} />
          </div>
        )}
      </div>
    </div>
  );
}
