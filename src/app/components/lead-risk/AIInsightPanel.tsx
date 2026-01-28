import { X, MapPin, Clock, Package, Check, Edit } from 'lucide-react';
import styles from './AIInsightPanel.module.css';

interface AIRecommendation {
  icon: string;
  action: string;
  reason: string;
  confidence: number;
}

interface AIInsight {
  leadId: string;
  riskScore: number;
  confidence: number;
  priority: 'Thấp' | 'Trung bình' | 'Cao' | 'Khẩn cấp';
  summary: string;
  location: string;
  duration: string;
  scale: string;
  category: string;
  recommendations: AIRecommendation[];
  evidenceNeeded: string[];
  legalBasis: string[];
}

interface AIInsightPanelProps {
  insight: AIInsight;
  isOpen: boolean;
  onClose: () => void;
  onAcceptAll: () => void;
  onCustomize: () => void;
}

export function AIInsightPanel({
  insight,
  isOpen,
  onClose,
  onAcceptAll,
  onCustomize,
}: AIInsightPanelProps) {
  if (!isOpen) return null;

  const getScoreColor = (score: number): string => {
    if (score >= 8) return '#ef4444';
    if (score >= 6) return '#f59e0b';
    if (score >= 4) return '#eab308';
    return '#22c55e';
  };

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'Khẩn cấp': return '🔴 Mức độ nghiêm trọng: KHẨN CẤP';
      case 'Cao': return '🔴 Mức độ nghiêm trọng: CAO';
      case 'Trung bình': return '🟡 Mức độ nghiêm trọng: TRUNG BÌNH';
      default: return '🟢 Mức độ nghiêm trọng: THẤP';
    }
  };

  const getConfidenceLabel = (conf: number): string => {
    return conf >= 90 ? '✅ Độ tin cậy: CAO' : conf >= 70 ? '⚠️ Độ tin cậy: TRUNG BÌNH' : '❌ Độ tin cậy: THẤP';
  };

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>🤖</div>
        <div className={styles.headerText}>
          <h3 className={styles.title}>AI Đánh giá</h3>
          <p className={styles.leadId}>{insight.leadId}</p>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Score Overview */}
      <div className={styles.scoreOverview}>
        <div className={styles.scoreCircle}>
          <svg className={styles.progressRing} width="120" height="120">
            <circle
              className={styles.progressRingCircleBg}
              cx="60"
              cy="60"
              r="52"
            />
            <circle
              className={styles.progressRingCircle}
              cx="60"
              cy="60"
              r="52"
              stroke={getScoreColor(insight.riskScore)}
              strokeDasharray={`${(insight.riskScore / 10) * 326.73} 326.73`}
            />
          </svg>
          <div className={styles.scoreCenter}>
            <span className={styles.scoreNum}>{insight.riskScore.toFixed(1)}</span>
            <span className={styles.scoreMax}>/10</span>
          </div>
        </div>
        
        <div className={styles.scoreLabels}>
          <div className={styles.priorityBadge} data-priority={insight.priority}>
            {getPriorityLabel(insight.priority)}
          </div>
          <div className={styles.confidenceBadge} data-confidence={insight.confidence >= 90 ? 'high' : insight.confidence >= 70 ? 'medium' : 'low'}>
            {getConfidenceLabel(insight.confidence)} ({insight.confidence}%)
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>📝 Tóm tắt (AI tạo)</h4>
        <p className={styles.summaryText}>{insight.summary}</p>
      </div>

      {/* Key Metrics */}
      <div className={styles.section}>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <MapPin size={20} className={styles.metricIcon} />
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Địa điểm</span>
              <span className={styles.metricValue}>{insight.location}</span>
            </div>
          </div>

          <div className={styles.metric}>
            <Clock size={20} className={styles.metricIcon} />
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Thời gian</span>
              <span className={styles.metricValue}>{insight.duration}</span>
            </div>
          </div>

          <div className={styles.metric}>
            <Package size={20} className={styles.metricIcon} />
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Quy mô</span>
              <span className={styles.metricValue}>{insight.scale}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>💡 AI đề xuất</h4>
        <div className={styles.recommendations}>
          {insight.recommendations.map((rec, idx) => (
            <div key={idx} className={styles.recommendation}>
              <div className={styles.recIcon}>{rec.icon}</div>
              <div className={styles.recContent}>
                <span className={styles.recAction}>{rec.action}</span>
                <span className={styles.recReason}>{rec.reason}</span>
              </div>
              <div 
                className={styles.recBadge}
                data-confidence={rec.confidence >= 90 ? 'high' : rec.confidence >= 70 ? 'medium' : 'low'}
              >
                {rec.confidence}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.actions}>
        <button className={styles.btnAcceptAll} onClick={onAcceptAll}>
          <Check size={20} />
          Chấp nhận tất cả đề xuất AI
        </button>
        
        <button className={styles.btnCustomize} onClick={onCustomize}>
          <Edit size={20} />
          Tùy chỉnh
        </button>
      </div>

      {/* Advanced Section */}
      <details className={styles.advanced}>
        <summary className={styles.advancedSummary}>🔍 Thông tin nâng cao</summary>
        <div className={styles.advancedContent}>
          <div className={styles.advancedItem}>
            <strong className={styles.advancedLabel}>Bằng chứng cần thu:</strong>
            <ul className={styles.advancedList}>
              {insight.evidenceNeeded.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.advancedItem}>
            <strong className={styles.advancedLabel}>Cơ sở pháp lý:</strong>
            <ul className={styles.advancedList}>
              {insight.legalBasis.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
}
