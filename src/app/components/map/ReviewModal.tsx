import React, { useEffect } from 'react';
import { X, Star, ThumbsUp, MessageCircle, User, Calendar, AlertTriangle } from 'lucide-react';
import styles from './ReviewModal.module.css';
import { Restaurant } from '../../../data/restaurantData';
import { ReviewImageGallery } from './ReviewImageGallery'; // Assuming this component exists and is correct
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { RootState } from '../../../store/rootReducer';
import { fetchReviewsRequest, clearReviews } from '../../../store/slices/reviewSlice';

interface ReviewModalProps {
  point: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ point, isOpen, onClose }: ReviewModalProps) {
  const dispatch = useAppDispatch();
  const { reviews, isLoading, error } = useAppSelector((state: RootState) => state.reviews);

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

  // Prevent body scroll when modal is open
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

  // Fetch reviews when modal opens and clear on close
  useEffect(() => {
    if (isOpen && point?.id) {
      dispatch(fetchReviewsRequest(point.id));
    }

    return () => {
      if (!isOpen) {
        dispatch(clearReviews());
      }
    };
  }, [isOpen, point?.id, dispatch]);

  if (!isOpen || !point) return null;

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r?.rating || 0), 0) / reviews.length
    : 0;

  // Rating distribution
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    if (r && typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating - 1]++;
    }
  });
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </button>

        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Đánh giá của khách hàng</h1>
          <div className={styles.headerSubtitle}>{point?.name || 'N/A'}</div>
        </div>

        {/* Content Section */}
        <div className={styles.content}>
          {/* Rating Summary */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryLeft}>
              <div className={styles.averageRating}>{averageRating.toFixed(1)}</div>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= Math.round(averageRating) ? '#facc15' : 'none'}
                    stroke={star <= Math.round(averageRating) ? '#facc15' : '#d1d5db'}
                    strokeWidth={2}
                  />
                ))}
              </div>
              <div className={styles.reviewCount}>{reviews.length} đánh giá</div>
            </div>

            <div className={styles.summaryRight}>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className={styles.ratingBar}>
                  <div className={styles.ratingBarLabel}>
                    <Star size={14} fill="#facc15" stroke="#facc15" />
                    <span>{star}</span>
                  </div>
                  <div className={styles.ratingBarTrack}>
                    <div 
                      className={styles.ratingBarFill}
                      style={{
                        width: `${reviews.length > 0 ? ((ratingCounts[star - 1] || 0) / reviews.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <div className={styles.ratingBarCount}>{ratingCounts[star - 1] || 0}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          {isLoading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
              <p>Đang tải đánh giá...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <AlertTriangle size={48} strokeWidth={1} />
              <p>Không thể tải được danh sách đánh giá.</p>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className={styles.noReviewsContainer}>
              <MessageCircle size={48} strokeWidth={1} />
              <p>Chưa có đánh giá nào cho cơ sở này.</p>
            </div>
          ) : (
            <div className={styles.reviewsList}>
              {reviews.map((review) => (
                <div key={review.id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewUser}>
                      <div className={styles.userAvatar}> 
                        {review.userAvatar ? <img src={review.userAvatar} alt={review.userName} /> : <User size={18} />}
                      </div>
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>{review.userName || 'Anonymous'}</div>
                        <div className={styles.reviewDate}>
                          <Calendar size={12} />
                          <span>{review.date || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.reviewRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          fill={star <= (review.rating || 0) ? '#facc15' : 'none'}
                          stroke={star <= (review.rating || 0) ? '#facc15' : '#d1d5db'}
                          strokeWidth={2}
                        />
                      ))}
                    </div>
                  </div>

                  <div className={styles.reviewContent}>
                    <p className={styles.reviewComment}>{review.comment || ''}</p>
                    {review.images && review.images.length > 0 && (
                      <ReviewImageGallery images={review.images} />
                    )}
                  </div>

                  <div className={styles.reviewActions}>
                    <button className={styles.actionBtn}>
                      <ThumbsUp size={14} />
                      <span>Hữu ích ({review.helpful || 0})</span>
                    </button>
                    {(review.replies || 0) > 0 && (
                      <button className={styles.actionBtn}>
                        <MessageCircle size={14} />
                        <span>{review.replies} phản hồi</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <button className={styles.btnSecondary} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}