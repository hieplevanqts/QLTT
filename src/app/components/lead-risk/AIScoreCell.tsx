import styles from './AIScoreCell.module.css';

interface AIScoreCellProps {
  riskScore: number; // 0-10
  confidence: number; // 0-100
  priority: 'Thấp' | 'Trung bình' | 'Cao' | 'Khẩn cấp';
  category?: string;
  location?: string;
}

export function AIScoreCell({
  riskScore,
  confidence,
  priority,
  category,
  location,
}: AIScoreCellProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 8) return '#ef4444'; // Red
    if (score >= 6) return '#f59e0b'; // Orange
    if (score >= 4) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  const getPriorityIcon = (priority: string): string => {
    switch (priority) {
      case 'Khẩn cấp': return '🔴';
      case 'Cao': return '🔴';
      case 'Trung bình': return '🟡';
      case 'Thấp': return '🟢';
      default: return '⚪';
    }
  };

  const getPriorityVariant = (priority: string): 'danger' | 'warning' | 'success' => {
    switch (priority) {
      case 'Khẩn cấp': return 'danger';
      case 'Cao': return 'danger';
      case 'Trung bình': return 'warning';
      default: return 'success';
    }
  };

  const getConfidenceIcon = (conf: number): string => {
    return conf >= 90 ? '✅' : conf >= 70 ? '⚠️' : '❌';
  };

  return (
    <div className={styles.container}>
      {/* Score Progress Bar */}
      <div className={styles.scoreBar}>
        <div 
          className={styles.scoreFill}
          style={{
            width: `${riskScore * 10}%`,
            backgroundColor: getScoreColor(riskScore),
          }}
        />
        <span className={styles.scoreValue}>{riskScore.toFixed(1)}/10</span>
      </div>

      {/* Priority & Confidence Badges */}
      <div className={styles.badges}>
        <span 
          className={styles.badge}
          data-variant={getPriorityVariant(priority)}
        >
          {getPriorityIcon(priority)} {priority}
        </span>
        
        <span 
          className={styles.badge}
          data-variant={confidence >= 90 ? 'success' : confidence >= 70 ? 'warning' : 'danger'}
        >
          {getConfidenceIcon(confidence)} {confidence}% tin cậy
        </span>
      </div>

      {/* Tags */}
      {(category || location) && (
        <div className={styles.tags}>
          {category && (
            <span className={styles.tag} data-color="red">
              {category}
            </span>
          )}
          {location && (
            <span className={styles.tag} data-color="blue">
              {location}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
