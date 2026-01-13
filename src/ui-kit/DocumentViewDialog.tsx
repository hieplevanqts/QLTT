import React from 'react';
import { X, FileText, CheckCircle, XCircle, Calendar, Building, AlertCircle, Download } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Badge } from '../app/components/ui/badge';
import { LegalDocument, ApprovalStatus } from './LegalDocumentItem';
import { getDocumentTypeById } from '../data/documentTypes';
import styles from './DocumentViewDialog.module.css';

interface DocumentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: LegalDocument | null;
  onApprove?: (documentId: string) => void;
  onReject?: (documentId: string) => void;
}

export function DocumentViewDialog({
  open,
  onOpenChange,
  document,
  onApprove,
  onReject,
}: DocumentViewDialogProps) {
  if (!open || !document) return null;

  const documentType = getDocumentTypeById(document.type);
  const isPending = document.approvalStatus === 'pending';
  const isApproved = document.approvalStatus === 'approved';
  const isRejected = document.approvalStatus === 'rejected';

  const handleApprove = () => {
    if (onApprove && document.id) {
      onApprove(document.id);
    }
  };

  const handleReject = () => {
    if (onReject && document.id) {
      onReject(document.id);
    }
  };

  const handleDownload = () => {
    if (!document.fileUrl || !document.fileName) return;
    
    // If ID card with 2 sides, download both
    if (document.backFileUrl && document.backFileName) {
      // Download front side
      const frontLink = document.createElement('a');
      frontLink.href = document.fileUrl;
      frontLink.download = document.fileName;
      frontLink.target = '_blank';
      document.body.appendChild(frontLink);
      frontLink.click();
      document.body.removeChild(frontLink);
      
      // Download back side (with slight delay)
      setTimeout(() => {
        const backLink = document.createElement('a');
        backLink.href = document.backFileUrl!;
        backLink.download = document.backFileName!;
        backLink.target = '_blank';
        document.body.appendChild(backLink);
        backLink.click();
        document.body.removeChild(backLink);
      }, 300);
    } else {
      // Single file download
      const link = document.createElement('a');
      link.href = document.fileUrl;
      link.download = document.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => onOpenChange(false)}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>{document.title}</h2>
            <p className={styles.description}>{documentType?.description || 'Chi tiết giấy tờ pháp lý'}</p>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => onOpenChange(false)}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Status Section */}
          <div className={styles.statusSection}>
            <div className={styles.statusBadges}>
              {document.statusText && (
                <Badge 
                  variant="secondary"
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
                    isPending ? styles.badgePending :
                    isApproved ? styles.badgeApproved :
                    isRejected ? styles.badgeRejected :
                    ''
                  }
                >
                  {document.approvalStatusText}
                </Badge>
              )}
            </div>

            {/* Approval Alert */}
            {isPending && (
              <div className={styles.alertPending}>
                <AlertCircle size={20} />
                <span>Giấy tờ này đang chờ phê duyệt. Vui lòng kiểm tra thông tin và phê duyệt.</span>
              </div>
            )}
          </div>

          {/* File Preview */}
          {document.fileUrl && (
            <div className={styles.filePreview}>
              <div className={styles.filePreviewLabel}>
                <FileText size={16} />
                <span>File đính kèm</span>
              </div>
              
              {/* Check if this is ID Card with 2 sides */}
              {document.backFileUrl ? (
                <div className={styles.idCardGrid}>
                  {/* Front Side */}
                  <div className={styles.idCardSide}>
                    <div className={styles.idCardLabel}>Mặt trước</div>
                    <div className={styles.imagePreviewContainer}>
                      <img 
                        src={document.fileUrl} 
                        alt="CCCD Mặt trước" 
                        className={styles.previewImage}
                      />
                    </div>
                    {document.fileName && (
                      <div className={styles.fileName}>{document.fileName}</div>
                    )}
                  </div>
                  
                  {/* Back Side */}
                  <div className={styles.idCardSide}>
                    <div className={styles.idCardLabel}>Mặt sau</div>
                    <div className={styles.imagePreviewContainer}>
                      <img 
                        src={document.backFileUrl} 
                        alt="CCCD Mặt sau" 
                        className={styles.previewImage}
                      />
                    </div>
                    {document.backFileName && (
                      <div className={styles.fileName}>{document.backFileName}</div>
                    )}
                  </div>
                </div>
              ) : (
                /* Single file preview */
                <>
                  <div className={styles.imagePreviewContainer}>
                    <img 
                      src={document.fileUrl} 
                      alt={document.fileName || 'Document preview'} 
                      className={styles.previewImage}
                    />
                  </div>
                  {document.fileName && (
                    <div className={styles.fileName}>{document.fileName}</div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Document Details */}
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionTitle}>Thông tin chi tiết</h3>
            <div className={styles.detailsGrid}>
              {document.documentNumber && (
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Số giấy tờ</div>
                  <div className={styles.detailValue}>{document.documentNumber}</div>
                </div>
              )}
              {document.issueDate && (
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <Calendar size={14} />
                    <span>Ngày cấp</span>
                  </div>
                  <div className={styles.detailValue}>{document.issueDate}</div>
                </div>
              )}
              {document.expiryDate && (
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <Calendar size={14} />
                    <span>Ngày hết hạn</span>
                  </div>
                  <div className={styles.detailValue}>{document.expiryDate}</div>
                </div>
              )}
              {document.issuingAuthority && (
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <Building size={14} />
                    <span>Cơ quan cấp</span>
                  </div>
                  <div className={styles.detailValue}>{document.issuingAuthority}</div>
                </div>
              )}
              {document.uploadDate && (
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Ngày tải lên</div>
                  <div className={styles.detailValue}>{document.uploadDate}</div>
                </div>
              )}
              {document.uploadedBy && (
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Người tải lên</div>
                  <div className={styles.detailValue}>{document.uploadedBy}</div>
                </div>
              )}
            </div>
            {document.notes && (
              <div className={styles.notesSection}>
                <div className={styles.detailLabel}>Ghi chú</div>
                <div className={styles.detailValue}>{document.notes}</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {/* Left side - Download button */}
          {document.fileUrl && (
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className={styles.downloadButton}
            >
              <Download size={16} />
              Tải về
            </Button>
          )}
          
          {/* Right side - Approval/Close buttons */}
          <div className={styles.footerRight}>
            {isPending ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleReject}
                  className={styles.rejectButton}
                >
                  <XCircle size={16} />
                  Từ chối
                </Button>
                <Button 
                  onClick={handleApprove}
                  className={styles.approveButton}
                >
                  <CheckCircle size={16} />
                  Phê duyệt
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}