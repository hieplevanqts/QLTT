import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ImageLightbox.module.css';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ImageLightbox({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNext, 
  onPrev 
}: ImageLightboxProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle arrow keys
  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };

    document.addEventListener('keydown', handleArrowKeys);
    return () => document.removeEventListener('keydown', handleArrowKeys);
  }, [isOpen, onNext, onPrev]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
          <X size={24} />
        </button>

        {/* Navigation - Previous */}
        {hasMultiple && (
          <button 
            className={`${styles.navBtn} ${styles.navBtnPrev}`} 
            onClick={onPrev}
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* Image */}
        <div className={styles.imageWrapper}>
          <img 
            src={currentImage} 
            alt={`Ảnh đánh giá ${currentIndex + 1}`}
            className={styles.image}
          />
        </div>

        {/* Navigation - Next */}
        {hasMultiple && (
          <button 
            className={`${styles.navBtn} ${styles.navBtnNext}`} 
            onClick={onNext}
            aria-label="Ảnh tiếp theo"
          >
            <ChevronRight size={32} />
          </button>
        )}

        {/* Counter */}
        {hasMultiple && (
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnails */}
        {hasMultiple && images.length <= 10 && (
          <div className={styles.thumbnails}>
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`${styles.thumbnail} ${idx === currentIndex ? styles.thumbnailActive : ''}`}
                onClick={() => {
                  const diff = idx - currentIndex;
                  if (diff > 0) {
                    for (let i = 0; i < diff; i++) onNext();
                  } else if (diff < 0) {
                    for (let i = 0; i < Math.abs(diff); i++) onPrev();
                  }
                }}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}