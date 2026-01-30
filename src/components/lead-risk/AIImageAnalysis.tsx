import { useState } from 'react';
import { Edit3, CheckCircle2, X, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import styles from './AIImageAnalysis.module.css';

interface ViolationTag {
  type: string;
  label: string;
  confidence: number;
  color: string;
  bgColor: string;
}

interface ImageAnalysis {
  imageUrl: string;
  fileName: string;
  detectedObjects: string[];
  suggestedTags: ViolationTag[];
  keyFindings: string[];
  overallConfidence: number;
}

interface AIImageAnalysisProps {
  images: ImageAnalysis[];
  onUpdateTags?: (imageIndex: number, tags: ViolationTag[]) => void;
}

export function AIImageAnalysis({ images, onUpdateTags }: AIImageAnalysisProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Get all unique tags across all images
  const allTags = images.flatMap(img => img.suggestedTags);
  const uniqueTagTypes = Array.from(new Set(allTags.map(tag => tag.type)));
  
  const tagSummary = uniqueTagTypes.map(type => {
    const tags = allTags.filter(tag => tag.type === type);
    const count = tags.length;
    const avgConfidence = Math.round(
      tags.reduce((sum, tag) => sum + tag.confidence, 0) / count
    );
    return {
      type,
      label: tags[0].label,
      count,
      avgConfidence,
      color: tags[0].color,
      bgColor: tags[0].bgColor,
    };
  });

  const handleEditTags = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveTags = (index: number) => {
    setEditingIndex(null);
    // Callback to parent if needed
    if (onUpdateTags) {
      onUpdateTags(index, images[index].suggestedTags);
    }
  };

  const handleRemoveTag = (imageIndex: number, tagType: string) => {
    if (onUpdateTags) {
      const updatedTags = images[imageIndex].suggestedTags.filter(
        tag => tag.type !== tagType
      );
      onUpdateTags(imageIndex, updatedTags);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <ImageIcon size={24} className={styles.headerIcon} />
          <div>
            <h2 className={styles.title}>🤖 AI Phân tích hình ảnh</h2>
            <p className={styles.subtitle}>
              AI đã phân tích {images.length} hình ảnh và gán nhãn vi phạm tự động
            </p>
          </div>
        </div>
      </div>

      {/* Summary Dashboard */}
      {tagSummary.length > 0 && (
        <div className={styles.summaryDashboard}>
          <h3 className={styles.summaryTitle}>📊 Tổng hợp nhãn vi phạm từ ảnh</h3>
          <div className={styles.summaryTags}>
            {tagSummary.map((tag) => (
              <div
                key={tag.type}
                className={styles.summaryTag}
                style={{
                  backgroundColor: tag.bgColor,
                  borderLeft: `4px solid ${tag.color}`,
                }}
              >
                <div className={styles.summaryTagHeader}>
                  <span
                    className={styles.summaryTagLabel}
                    style={{ color: tag.color }}
                  >
                    {tag.label}
                  </span>
                  <span
                    className={styles.summaryTagCount}
                    style={{ color: tag.color }}
                  >
                    {tag.count} ảnh
                  </span>
                </div>
                <div className={styles.summaryTagConfidence}>
                  Độ tin cậy trung bình: {tag.avgConfidence}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className={styles.imagesGrid}>
        {images.map((image, index) => (
          <div key={index} className={styles.imageCard}>
            {/* Image Thumbnail */}
            <div className={styles.imageThumbnail}>
              <img
                src={image.imageUrl}
                alt={image.fileName}
                className={styles.image}
              />
              <div className={styles.imageOverlay}>
                <span className={styles.imageNumber}>#{index + 1}</span>
              </div>
            </div>

            {/* Analysis Content */}
            <div className={styles.analysisContent}>
              {/* File Name */}
              <div className={styles.fileName}>{image.fileName}</div>

              {/* Detected Objects */}
              <div className={styles.detectedObjects}>
                <strong>AI nhận diện:</strong>{' '}
                {image.detectedObjects.join(', ')}
              </div>

              {/* Violation Tags */}
              <div className={styles.violationTags}>
                <div className={styles.violationTagsHeader}>
                  <strong>Nhãn vi phạm:</strong>
                  {editingIndex !== index && (
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditTags(index)}
                    >
                      <Edit3 size={14} />
                      Sửa
                    </button>
                  )}
                </div>
                <div className={styles.tagsList}>
                  {image.suggestedTags.map((tag) => (
                    <div
                      key={tag.type}
                      className={styles.tag}
                      style={{
                        backgroundColor: tag.bgColor,
                        borderLeft: `3px solid ${tag.color}`,
                      }}
                    >
                      <div className={styles.tagContent}>
                        <span className={styles.tagLabel}>{tag.label}</span>
                        <span
                          className={styles.tagConfidence}
                          style={{ color: tag.color }}
                        >
                          {tag.confidence}%
                        </span>
                      </div>
                      {editingIndex === index && (
                        <button
                          className={styles.removeTagButton}
                          onClick={() => handleRemoveTag(index, tag.type)}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  {image.suggestedTags.length === 0 && (
                    <span className={styles.noTags}>
                      Chưa phát hiện vi phạm rõ ràng
                    </span>
                  )}
                </div>
              </div>

              {/* Key Findings - Collapsible */}
              <div className={styles.keyFindings}>
                <button
                  className={styles.findingsToggle}
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  <AlertTriangle size={16} />
                  <strong>Dấu hiệu chính ({image.keyFindings.length})</strong>
                  <span className={styles.toggleIcon}>
                    {expandedIndex === index ? '▼' : '▶'}
                  </span>
                </button>

                {expandedIndex === index && (
                  <ul className={styles.findingsList}>
                    {image.keyFindings.map((finding, idx) => (
                      <li key={idx}>{finding}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Overall Confidence */}
              <div className={styles.overallConfidence}>
                <strong>Độ tin cậy tổng thể:</strong>
                <div className={styles.confidenceBar}>
                  <div
                    className={styles.confidenceBarFill}
                    style={{
                      width: `${image.overallConfidence}%`,
                      backgroundColor:
                        image.overallConfidence >= 80
                          ? 'rgb(34, 197, 94)'
                          : image.overallConfidence >= 60
                          ? 'rgb(245, 158, 11)'
                          : 'rgb(239, 68, 68)',
                    }}
                  />
                </div>
                <span className={styles.confidenceValue}>
                  {image.overallConfidence}%
                </span>
              </div>

              {/* Edit Actions */}
              {editingIndex === index && (
                <div className={styles.editActions}>
                  <button
                    className={styles.saveButton}
                    onClick={() => handleSaveTags(index)}
                  >
                    <CheckCircle2 size={16} />
                    Lưu thay đổi
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setEditingIndex(null)}
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Images */}
      {images.length === 0 && (
        <div className={styles.emptyState}>
          <ImageIcon size={48} />
          <p>Không có hình ảnh để phân tích</p>
        </div>
      )}
    </div>
  );
}
