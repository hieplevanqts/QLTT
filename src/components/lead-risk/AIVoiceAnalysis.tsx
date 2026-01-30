import { useState } from 'react';
import { Mic, Play, Pause, Edit3, CheckCircle2, X, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './AIVoiceAnalysis.module.css';

interface ViolationTag {
  type: string;
  label: string;
  confidence: number;
  color: string;
  bgColor: string;
}

interface ExtractedInfo {
  behavior?: string; // Hành vi bị phản ánh
  subject?: string; // Đối tượng / sản phẩm
  location?: string; // Địa điểm
  time?: string; // Thời gian
}

interface VoiceAnalysis {
  voiceUrl: string;
  fileName: string;
  duration: string;
  summary: string; // Tóm tắt 1-3 dòng
  extractedInfo: ExtractedInfo;
  suggestedTags: ViolationTag[];
  confidence: number;
  status: 'violation' | 'needs_info' | 'insufficient'; // Có vi phạm / Cần bổ sung / Không đủ căn cứ
}

interface AIVoiceAnalysisProps {
  voices: VoiceAnalysis[];
  onUpdateSummary?: (voiceIndex: number, summary: string) => void;
  onUpdateTags?: (voiceIndex: number, tags: ViolationTag[]) => void;
}

export function AIVoiceAnalysis({ voices, onUpdateSummary, onUpdateTags }: AIVoiceAnalysisProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [editedSummary, setEditedSummary] = useState<string>('');

  const getStatusConfig = (status: string) => {
    const configs = {
      violation: {
        label: 'Có dấu hiệu vi phạm',
        color: 'rgb(239, 68, 68)',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        icon: '⚠️',
      },
      needs_info: {
        label: 'Cần bổ sung thông tin',
        color: 'rgb(245, 158, 11)',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        icon: '⚠️',
      },
      insufficient: {
        label: 'Không đủ căn cứ',
        color: 'rgb(107, 114, 128)',
        bgColor: 'rgba(107, 114, 128, 0.1)',
        icon: 'ℹ️',
      },
    };
    return configs[status as keyof typeof configs] || configs.insufficient;
  };

  const handleEditSummary = (index: number) => {
    setEditingIndex(index);
    setEditedSummary(voices[index].summary);
  };

  const handleSaveSummary = (index: number) => {
    setEditingIndex(null);
    if (onUpdateSummary) {
      onUpdateSummary(index, editedSummary);
    }
  };

  const handleRemoveTag = (voiceIndex: number, tagType: string) => {
    if (onUpdateTags) {
      const updatedTags = voices[voiceIndex].suggestedTags.filter(
        tag => tag.type !== tagType
      );
      onUpdateTags(voiceIndex, updatedTags);
    }
  };

  const handlePlayPause = (index: number) => {
    if (playingIndex === index) {
      setPlayingIndex(null);
    } else {
      setPlayingIndex(index);
      // In real implementation, would control actual audio playback
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Mic size={24} className={styles.headerIcon} />
          <div>
            <h2 className={styles.title}>🎙️ AI Phân tích voice</h2>
            <p className={styles.subtitle}>
              AI đã chuyển {voices.length} file voice thành nội dung nghiệp vụ ngắn gọn
            </p>
          </div>
        </div>
      </div>

      {/* Voices List */}
      <div className={styles.voicesList}>
        {voices.map((voice, index) => {
          const statusConfig = getStatusConfig(voice.status);
          const isEditing = editingIndex === index;
          const isExpanded = expandedIndex === index;
          const isPlaying = playingIndex === index;

          return (
            <div key={index} className={styles.voiceCard}>
              {/* Voice Header */}
              <div className={styles.voiceHeader}>
                <div className={styles.voiceInfo}>
                  <div className={styles.voiceNumber}>
                    <Mic size={16} />
                    <span>Voice #{index + 1}</span>
                  </div>
                  <span className={styles.voiceMeta}>
                    {voice.fileName} • {voice.duration}
                  </span>
                </div>

                <div
                  className={styles.statusBadge}
                  style={{
                    color: statusConfig.color,
                    backgroundColor: statusConfig.bgColor,
                  }}
                >
                  <span>{statusConfig.icon}</span>
                  <span>{statusConfig.label}</span>
                </div>
              </div>

              {/* AI Summary */}
              <div className={styles.summarySection}>
                <div className={styles.summaryHeader}>
                  <strong>🤖 AI Tóm tắt nội dung:</strong>
                  {!isEditing && (
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditSummary(index)}
                    >
                      <Edit3 size={14} />
                      Sửa
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className={styles.editSummaryBox}>
                    <textarea
                      className={styles.summaryTextarea}
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      rows={3}
                    />
                    <div className={styles.editActions}>
                      <button
                        className={styles.saveButton}
                        onClick={() => handleSaveSummary(index)}
                      >
                        <CheckCircle2 size={16} />
                        Lưu
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={() => setEditingIndex(null)}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={styles.summaryText}>{voice.summary}</p>
                )}
              </div>

              {/* Extracted Information */}
              <div className={styles.extractedInfo}>
                <strong>Thông tin trích xuất:</strong>
                <div className={styles.infoGrid}>
                  {voice.extractedInfo.behavior && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Hành vi:</span>
                      <span className={styles.infoValue}>{voice.extractedInfo.behavior}</span>
                    </div>
                  )}
                  {voice.extractedInfo.subject && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Đối tượng:</span>
                      <span className={styles.infoValue}>{voice.extractedInfo.subject}</span>
                    </div>
                  )}
                  {voice.extractedInfo.location && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Địa điểm:</span>
                      <span className={styles.infoValue}>{voice.extractedInfo.location}</span>
                    </div>
                  )}
                  {voice.extractedInfo.time && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Thời gian:</span>
                      <span className={styles.infoValue}>{voice.extractedInfo.time}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Violation Tags */}
              <div className={styles.violationTags}>
                <div className={styles.violationTagsHeader}>
                  <strong>Nhãn vi phạm:</strong>
                </div>
                <div className={styles.tagsList}>
                  {voice.suggestedTags.map((tag) => (
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
                      {isEditing && (
                        <button
                          className={styles.removeTagButton}
                          onClick={() => handleRemoveTag(index, tag.type)}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  {voice.suggestedTags.length === 0 && (
                    <span className={styles.noTags}>
                      Chưa phát hiện vi phạm rõ ràng
                    </span>
                  )}
                </div>
              </div>

              {/* Confidence Score */}
              <div className={styles.confidenceSection}>
                <strong>Độ tin cậy nội dung:</strong>
                <div className={styles.confidenceBar}>
                  <div
                    className={styles.confidenceBarFill}
                    style={{
                      width: `${voice.confidence}%`,
                      backgroundColor:
                        voice.confidence >= 80
                          ? 'rgb(34, 197, 94)'
                          : voice.confidence >= 60
                          ? 'rgb(245, 158, 11)'
                          : 'rgb(239, 68, 68)',
                    }}
                  />
                </div>
                <span className={styles.confidenceValue}>{voice.confidence}%</span>
              </div>

              {/* Voice Player - Collapsed */}
              <div className={styles.voicePlayer}>
                <button
                  className={styles.playerToggle}
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                >
                  <span className={styles.playerToggleText}>
                    🎧 Nghe lại voice gốc (nếu cần đối chiếu)
                  </span>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isExpanded && (
                  <div className={styles.playerContent}>
                    <div className={styles.audioPlayer}>
                      <button
                        className={styles.playButton}
                        onClick={() => handlePlayPause(index)}
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <div className={styles.audioWaveform}>
                        <div className={styles.audioProgress} style={{ width: '0%' }} />
                      </div>
                      <span className={styles.audioDuration}>{voice.duration}</span>
                    </div>
                    <p className={styles.playerNote}>
                      ℹ️ Chỉ nghe lại khi cần xác minh thông tin AI tóm tắt
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* No Voices */}
      {voices.length === 0 && (
        <div className={styles.emptyState}>
          <Mic size={48} />
          <p>Không có file voice để phân tích</p>
        </div>
      )}
    </div>
  );
}
