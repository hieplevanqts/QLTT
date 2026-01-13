import React from 'react';
import { Download, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../app/components/ui/dialog';
import { Button } from '../app/components/ui/button';
import { Badge } from '../app/components/ui/badge';
import { LegalDocument } from './LegalDocumentItem';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';
import styles from './LegalDocumentDialog.module.css';

interface LegalDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: LegalDocument | null;
}

export function LegalDocumentDialog({ open, onOpenChange, document }: LegalDocumentDialogProps) {
  if (!document) return null;

  const handleDownload = async () => {
    if (!document.fileUrl) return;

    try {
      // Fetch the image as a blob
      const response = await fetch(document.fileUrl);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = window.document.createElement('a');
      link.href = blobUrl;
      link.download = document.fileName || `${document.type}.png`;
      
      // Append to body, click, and remove
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
      
      console.log('Downloaded:', document.fileName);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getStatusBadge = () => {
    if (document.status === 'valid') {
      return (
        <Badge variant="secondary" className={styles.badgeValid}>
          Còn hiệu lực
        </Badge>
      );
    }
    if (document.status === 'expiring') {
      return (
        <Badge variant="default" className={styles.badgeExpiring}>
          Sắp hết hạn
        </Badge>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>Chi tiết giấy phép</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết và tải xuống giấy phép
          </DialogDescription>
        </DialogHeader>

        <div className={styles.content}>
          {/* Image Preview */}
          <div className={styles.imagePreview}>
            <ImageWithFallback
              src={document.fileUrl || ''}
              alt={document.title}
              className={styles.previewImage}
            />
            <Button 
              size="sm" 
              variant="outline"
              className={styles.downloadButton}
              onClick={handleDownload}
            >
              <Download size={16} />
              Tải xuống
            </Button>
          </div>

          {/* Document Details */}
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <div className={styles.detailColumn}>
                <div className={styles.detailLabel}>Loại giấy phép</div>
                <div className={styles.detailValue}>{document.title}</div>
              </div>
              <div className={styles.detailColumn}>
                <div className={styles.detailLabel}>Số giấy phép</div>
                <div className={styles.detailValue}>{document.documentNumber}</div>
              </div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailColumn}>
                <div className={styles.detailLabel}>Ngày cấp</div>
                <div className={styles.detailValue}>{document.issueDate}</div>
              </div>
              <div className={styles.detailColumn}>
                <div className={styles.detailLabel}>Ngày hết hạn</div>
                <div className={styles.detailValue}>{document.expiryDate}</div>
              </div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailColumn}>
                <div className={styles.detailLabel}>Cơ quan cấp</div>
                <div className={styles.detailValue}>{document.issuingAuthority}</div>
              </div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailColumn}>
                <div className={styles.detailLabel}>Trạng thái</div>
                <div className={styles.detailValue}>{getStatusBadge()}</div>
              </div>
            </div>

            {document.notes && (
              <div className={styles.notesSection}>
                <div className={styles.detailLabel}>Ghi chú</div>
                <div className={styles.notesBox}>
                  {document.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}