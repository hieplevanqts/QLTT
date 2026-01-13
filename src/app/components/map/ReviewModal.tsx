import React, { useEffect, useState } from 'react';
import { X, Star, ThumbsUp, MessageCircle, User, Calendar } from 'lucide-react';
import styles from './ReviewModal.module.css';
import { Restaurant } from '../../../data/restaurantData';
import { ReviewImageGallery } from './ReviewImageGallery';

interface ReviewModalProps {
  point: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  helpful: number;
  replies: number;
}

// Generate mock reviews
function generateMockReviews(point: Restaurant | null): Review[] {
  if (!point) return [];
  
  try {
    const reviewTemplates = {
      positive: [
        'Đồ ăn rất ngon, vệ sinh sạch sẽ. Nhân viên phục vụ nhiệt tình.',
        'Món ăn đa dạng, giá cả hợp lý. Không gian thoáng mát.',
        'Chất lượng ổn định, kiểm định ATTP đầy đủ. Sẽ quay lại.',
        'Rất hài lòng về vệ sinh thực phẩm. Giấy phép đầy đủ.',
        'Không gian sạch sẽ, thoáng mát. Phục vụ nhanh.'
      ],
      neutral: [
        'Đồ ăn bình thường, không có gì đặc biệt. Giá cả hơi cao.',
        'Món ăn tạm được. Chỗ đậu xe hơi khó.',
        'Phục vụ chậm một chút. Nhưng nhìn chung ổn.',
        'Không gian hơi chật vào giờ cao điểm.'
      ],
      negative: [
        'Vệ sinh chưa được tốt lắm. Cần cải thiện.',
        'Món ăn không đúng khẩu vị. Hơi mặn.',
        'Thời gian chờ lâu. Nhân viên ít.',
        'Giá cả cao hơn mặt bằng chung.'
      ]
    };

    const names = [
      'Nguyễn Văn A', 'Trần Thị B', 'Lê Hoàng C', 'Phạm Minh D',
      'Hoàng Thu E', 'Đặng Quốc F', 'Vũ Thị G', 'Bùi Văn H'
    ];

    // Real food images from Unsplash
    const foodImages = [
      'https://images.unsplash.com/photo-1597345637412-9fd611e758f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      'https://images.unsplash.com/photo-1622643944007-450264a5f9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      'https://images.unsplash.com/photo-1614597134736-a8e0616933d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      'https://images.unsplash.com/photo-1609590981063-d495e2914ce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      'https://images.unsplash.com/photo-1552912470-ee2e96439539?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800'
    ];

    const reviewCount = point.category === 'certified' ? 8 : point.category === 'hotspot' ? 4 : 6;
    const reviews: Review[] = [];

    for (let i = 0; i < reviewCount; i++) {
      let rating: number;
      let commentPool: string[];
      
      if (point.category === 'certified') {
        rating = Math.random() > 0.2 ? (Math.random() > 0.5 ? 5 : 4) : 3;
        commentPool = rating >= 4 ? reviewTemplates.positive : reviewTemplates.neutral;
      } else if (point.category === 'hotspot') {
        rating = Math.random() > 0.3 ? (Math.random() > 0.5 ? 2 : 1) : 3;
        commentPool = rating <= 2 ? reviewTemplates.negative : reviewTemplates.neutral;
      } else {
        rating = Math.floor(Math.random() * 3) + 3; // 3-5
        commentPool = rating >= 4 ? reviewTemplates.positive : reviewTemplates.neutral;
      }
      
      const daysAgo = Math.floor(Math.random() * 90);
      const reviewDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      // 60% chance to have images
      const hasImages = Math.random() > 0.4;
      let reviewImages: string[] | undefined = undefined;
      
      if (hasImages) {
        const imageCount = Math.floor(Math.random() * 3) + 1; // 1-3 images
        reviewImages = [];
        for (let j = 0; j < imageCount; j++) {
          const imgIndex = (i * 3 + j) % foodImages.length;
          reviewImages.push(foodImages[imgIndex]);
        }
      }

      reviews.push({
        id: `review-${point.id}-${i}`,
        userName: names[i % names.length],
        rating,
        date: reviewDate.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        comment: commentPool[Math.floor(Math.random() * commentPool.length)],
        images: reviewImages,
        helpful: Math.floor(Math.random() * 20),
        replies: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0
      });
    }

    return reviews.sort((a, b) => b.rating - a.rating);
  } catch (error) {
    console.error('Error generating reviews:', error);
    return [];
  }
}

export function ReviewModal({ point, isOpen, onClose }: ReviewModalProps) {
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

  if (!isOpen || !point) return null;

  const reviews = generateMockReviews(point);
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  
  const averageRating = safeReviews.length > 0 
    ? safeReviews.reduce((sum, r) => sum + (r?.rating || 0), 0) / safeReviews.length 
    : 0;
  
  // Rating distribution
  const ratingCounts = [0, 0, 0, 0, 0];
  safeReviews.forEach(r => {
    if (r && typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating - 1]++;
    }
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
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
              <div className={styles.reviewCount}>{safeReviews.length} đánh giá</div>
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
                        width: `${safeReviews.length > 0 ? ((ratingCounts[star - 1] || 0) / safeReviews.length) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <div className={styles.ratingBarCount}>{ratingCounts[star - 1] || 0}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className={styles.reviewsList}>
            {safeReviews.map((review) => {
              if (!review || !review.id) return null;
              
              return (
                <div key={review.id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewUser}>
                      <div className={styles.userAvatar}>
                        <User size={18} />
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
              );
            })}
          </div>
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