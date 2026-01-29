import React, { useState } from 'react';
import styles from './ReviewImageGallery.module.css';
import { ImageLightbox } from './ImageLightbox';

interface ReviewImageGalleryProps {
  images: string[];
}

export function ReviewImageGallery({ images }: ReviewImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const displayImages = images.slice(0, 3); // Show max 3 thumbnails
  const remainingCount = images.length - 3;

  return (
    <>
      <div className={styles.gallery}>
        {displayImages.map((img, idx) => (
          <div 
            key={idx} 
            className={styles.thumbnail}
            onClick={() => handleImageClick(idx)}
          >
            <img src={img} alt={`Review image ${idx + 1}`} />
            {idx === 2 && remainingCount > 0 && (
              <div className={styles.overlay}>
                <span className={styles.overlayText}>+{remainingCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <ImageLightbox
        images={images}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
}
