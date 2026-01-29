import React from 'react';
import { X, User, Calendar } from 'lucide-react';
import { StoreImage, getCategoryLabel } from '@/utils/data/mockImages';
import styles from './ImageDetailModal.module.css';

interface ImageDetailModalProps {
  image: StoreImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageDetailModal({ image, isOpen, onClose }: ImageDetailModalProps) {
  // Handle escape key and body scroll
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Always restore body scroll when modal closes
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Don't render if not open
  if (!isOpen || !image) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {/* Header - Fixed */}
        <div className={styles.header}>
          <h2 className={styles.title}>{getCategoryLabel(image.category)}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className={styles.scrollableContent}>
          {/* Image Container */}
          <div className={styles.imageContainer}>
            <img
              src={image.url}
              alt={image.title}
              className={styles.image}
              loading="lazy"
            />
          </div>

          {/* Metadata */}
          <div className={styles.metadata}>
            <div className={styles.metadataRow}>
              <div className={styles.metadataItem}>
                <User size={16} className={styles.metadataIcon} />
                <div className={styles.metadataContent}>
                  <div className={styles.metadataLabel}>Người tải lên</div>
                  <div className={styles.metadataValue}>{image.uploadedBy}</div>
                </div>
              </div>

              <div className={styles.metadataItem}>
                <Calendar size={16} className={styles.metadataIcon} />
                <div className={styles.metadataContent}>
                  <div className={styles.metadataLabel}>Thời gian tải lên</div>
                  <div className={styles.metadataValue}>{image.displayUploadedAt}</div>
                </div>
              </div>
            </div>

            {/* Description if available */}
            {image.description && (
              <div className={styles.descriptionSection}>
                <div className={styles.descriptionLabel}>Ghi chú</div>
                <div className={styles.descriptionText}>{image.description}</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className={styles.footer}>
          <button className={styles.closeFooterButton} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
